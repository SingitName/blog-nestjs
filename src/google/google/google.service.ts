import { Injectable, Controller } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import * as streamifier from 'streamifier';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
@Injectable()
export class GoogleService {
private oauth2Client:any;
constructor(){
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;
    if (!clientID || !clientSecret || !redirectUri) {
        throw new Error('Missing Google OAuth2 credentials in environment variables');
      }
      this.oauth2Client = new google.auth.OAuth2(clientID, clientSecret, redirectUri);
      // Lấy Access Token và Refresh Token từ biến môi trường
      const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
      const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  
      if (accessToken && refreshToken) {
        this.oauth2Client.setCredentials({
          access_token_google: accessToken,
          refresh_token: refreshToken,
        });
      } else {
        throw new Error('Access token or refresh token is missing');
      }
      
}

async uploadFile(file: Express.Multer.File): Promise<any> {
    const drive = google.drive({ version: 'v3', auth: this.oauth2Client });
    try {
      const fileStream = streamifier.createReadStream(file.buffer);
      const res = await drive.files.create({
        media: {
          mimeType: file.mimetype,
          body: fileStream,
        },
        requestBody: {
          name: file.originalname,
          parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
        },
      });
  
      // Kiểm tra nếu không có id trong response
      if (!res.data.id) {
        throw new Error('File ID is missing from Google Drive response');
      }
  
      const fileId = res.data.id;
      console.log(fileId);
      // Gọi API để lấy thông tin file với các trường webViewLink và webContentLink
      const fileInfo = await drive.files.get({
        fileId,
        fields: 'webViewLink,webContentLink',
      });
  
      // Kiểm tra nếu không có thông tin file
      if (!fileInfo.data.webViewLink || !fileInfo.data.webContentLink) {
        throw new Error('Failed to retrieve file links');
      }
      return {
        fileData: res.data,
        fileId:res.data.id,
        webViewLink: fileInfo.data.webViewLink,
        webContentLink: fileInfo.data.webContentLink,
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async streamVideoToFLV(fileId: string, req: any, res: any): Promise<void> {
    const drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  
    try {
      const tempFilePath = path.join(os.tmpdir(), 'video.mp4'); // Đường dẫn tạm
      const dest = fs.createWriteStream(tempFilePath);
      const videoFile = await drive.files.get(
        {
          fileId: fileId,
          alt: 'media',
        },
        { responseType: 'stream' }
      );
  
      videoFile.data.pipe(dest).on('finish', () => {
        console.log('File downloaded, starting conversion...');
  
        // Lấy thông tin file
        const stat = fs.statSync(tempFilePath);
        const fileSize = stat.size;
        const range = req.headers.range;
  
        if (range) {
          // Nếu trình duyệt yêu cầu Range, xử lý
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          if (start >= fileSize) {
            res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
            return;
          }
  
          const chunksize = end - start + 1;
          const file = fs.createReadStream(tempFilePath, { start, end });
          const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
          };
  
          res.writeHead(206, head); // Gửi phản hồi Partial Content (206)
          file.pipe(res);
        } else {
          // Nếu không có Range request, trả về toàn bộ video
          const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
          };
  
          res.writeHead(200, head);
          fs.createReadStream(tempFilePath).pipe(res);
        }
      });
    } catch (error) {
      console.error(`Failed to stream video: ${error.message}`);
      if (!res.headersSent) {
        res.status(500).send(`Failed to stream video: ${error.message}`);
      }
    }
  }
}