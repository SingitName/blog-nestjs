import { Injectable, Controller } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import * as streamifier from 'streamifier';
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
}