import { Video } from './entities/videos.entity';
import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Req, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateVideoDto } from './dto/createvideo.dto'; // DTO để tạo mới video
import { GoogleService } from 'src/google/google/google.service';
import { VideosService } from './videos.service';

@Controller('files')
export class VideoController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly videoService: VideosService,
  ) {}

  // Định nghĩa các định dạng video hợp lệ
  private readonly allowedMimeTypes: string[] = ['video/mp4', 'video/avi', 'video/mkv'];

  private isMimeTypeAllowed(mimeType: string): boolean {
    return this.allowedMimeTypes.includes(mimeType);
  }

  @Post('upload-video')
  @UseInterceptors(FileInterceptor('file')) // 'file' là tên của field input từ form
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    // Kiểm tra định dạng file có phải là video hợp lệ hay không
    if (!this.isMimeTypeAllowed(file.mimetype)) {
      throw new BadRequestException('Chỉ được phép upload các định dạng video hợp lệ');
    }

    // Gọi hàm uploadFile từ GoogleService để upload file lên Google Drive
    const uploadResult = await this.googleService.uploadFile(file);

    // Tạo DTO cho video để lưu vào DB
    const createVideoDto: CreateVideoDto = {
      video_name: file.originalname,          // Tên của video
      mime_type: file.mimetype,               // MIME type của video
      file_id: uploadResult.fileId,           // ID file trên Google Drive
      web_view_link: uploadResult.webViewLink, // Link để xem video
      web_content_link: uploadResult.webContentLink, // Link để tải video
    };

    // Gọi ImagesService để lưu thông tin video vào CSDL
    const savedVideo = await this.videoService.createVideo(createVideoDto);

    // Trả về thông tin video đã lưu
    return {
      message: 'Upload và lưu video thành công',
      videoInfo: savedVideo,
    };
  }
  // Route mới để stream video
  @Get('stream/:fileId')
  async streamVideo(
    @Param('fileId') fileId: string,  // Lấy fileId từ URL
    @Req() req,                       // Yêu cầu HTTP từ client
    @Res() res                        // Phản hồi HTTP để stream video
  ) {
    try {
      // Gọi hàm streamVideoToFLV từ GoogleService để xử lý stream video
      await this.googleService.streamVideoToFLV(fileId, req, res);
    } catch (error) {
      res.status(500).send('Lỗi khi stream video: ' + error.message);
    }
  }
}
