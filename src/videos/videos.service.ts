import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateVideoDto } from "./dto/createvideo.dto";
import { Video } from "./entities/videos.entity";

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videosRepository: Repository<Video>,
  ) {}

  async createVideo(createVideoDto: CreateVideoDto): Promise<Video> {
    return await this.videosRepository.save(createVideoDto);
  }

  // Thêm phương thức để lấy video theo fileId
  async findVideoByFileId(fileId: string): Promise<Video> {
    return await this.videosRepository.findOne({ where: { file_id: fileId } });
  }
}
