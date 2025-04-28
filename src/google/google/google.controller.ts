import { Controller, Get, HttpStatus, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { GoogleService } from './google.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { userInfo } from 'os';
import { Response } from 'express';
@Controller('google')
export class GoogleController {
  constructor(
    private readonly googleDriveService: GoogleService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Chọn file từ laptop để upload',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    const uploadedFile = await this.googleDriveService.uploadFile(file);
    console.log('upload id:', uploadedFile.fileId);
    return {
      fileId: uploadedFile.fileId,
      message: 'Upload file thành công!',
      webViewLink: uploadedFile.webViewLink, // Link xem file
      webContentLink: uploadedFile.webContentLink, // Link tải file
    };
  }
  @Get('streamvideo/:fileId')
  async streamVideo(
    @Param('fileId') fileId: string,
    @Req() req: Request, // Thêm Request để lấy Range header từ client
    @Res() res: Response,
  ): Promise<void> {
    try {
      // Gọi service để stream video với hỗ trợ Range
      await this.googleDriveService.streamVideoToFLV(fileId, req, res); // Truyền req để xử lý Range
    } catch (error) {
      console.error('Stream video failed:', error.message);
      // Sử dụng số trực tiếp thay cho HttpStatus nếu vẫn lỗi
      if (!res.headersSent) {
        res.status(500).send('Failed to stream video');
      }
    }
  }

  @Get('googles')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Xử lý đăng nhập Google (đã được thực hiện qua AuthGuard)
  }

  @Get('googles/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
      const { user, tokens } = req.user; // Thông tin người dùng và token sau khi xác thực
      if (user) {
          // Nếu người dùng đã tồn tại trong hệ thống, trả về token và điều hướng tới frontend dashboard
          const plainUser = JSON.parse(JSON.stringify(user));
          const plainTokens = JSON.parse(JSON.stringify(tokens));
          const userInfo = `?email=${plainUser.email}&avatar=${plainUser.avatar}&firstName=${plainUser.firstName}&lastName=${plainUser.lastName}&access_token=${plainTokens.access_token}&refresh_token=${plainTokens.refresh_token}`;
          // Điều hướng về frontend với token
          const redirectUrl = `http://localhost:3000/client`; // Chuyển hướng tới dashboard của frontend
          return res.redirect(`${redirectUrl}${userInfo}`); 
      } else if (req.user.userInfo) {
          const frontendURL = `http://localhost:3000/register`;
          const userInfo = `?email=${req.user.userInfo.email}&firstName=${req.user.userInfo.firstName}&lastName=${req.user.userInfo.lastName}`;
          return res.redirect(`${frontendURL}${userInfo}`); 
      } else {
          // Trường hợp lỗi không mong muốn
          return res.status(400).json({ message: 'Xác thực Google thất bại' });
      }
  }
}
