import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GoogleService } from './google.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
@Controller('google')
export class GoogleController {
    constructor(private readonly googleDriveService: GoogleService) {}
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
      console.log('upload id:',uploadedFile.fileId);
      return {
        fileId:uploadedFile.fileId,
        message: "Upload file thông!",
        webViewLink: uploadedFile.webViewLink,  // Link xem file
        webContentLink: uploadedFile.webContentLink,  // Link tải file
      };
    }
}
