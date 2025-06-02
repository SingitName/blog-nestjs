// src/group/group.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAllGroups(loggedInUserId: number): Promise<Group[]> {
    
    return this.groupRepository.find({ where: { members: { id: loggedInUserId } }, relations: ['members'] });
  }
  async findUserGroup(id: number): Promise<Group> {
    return this.groupRepository.findOne({
      where: { id }, 
      relations: ['members'], 
    });
  }
  async showAllGroup():Promise<Group[]>{
    return await this.groupRepository.find();
  }
  async createGroup(user: any, payload: { groupName: string, description: string }) {
    try {
      const senderId = user.id;

      const newGroup = this.groupRepository.create({
        name: payload.groupName,
        description: payload.description,
        creatorId: senderId,
        members: [{ id: senderId }],
      });
      const savedGroup = await this.groupRepository.save(newGroup);

      return {
        id: savedGroup.id,
        name: savedGroup.name,
        description: savedGroup.description,
        members: savedGroup.members,
      };
    } catch (error) {
      console.error('Lỗi khi tạo nhóm:', error);
      throw new UnauthorizedException('Lỗi trong quá trình tạo nhóm');
    }
  }
  async deleteGroup(id:number):Promise<DeleteResult>{
    const idGroup = this.groupRepository.findOne({where:{id:id}})
    if(!idGroup){
      throw new Error("Group không tồn tại!");
    }
    return await this.groupRepository.delete(id);
    
  }
  // Nhận thông tin user từ AuthGuard (req.user)
  async addToGroup(user: any, payload: { groupId: number, userId: string }) {
    try {
      const senderId = user.id;

      const group = await this.groupRepository.findOne({
        where: { id: payload.groupId },
        relations: ['members']
      });

      if (!group) {
        throw new UnauthorizedException('Nhóm không tồn tại');
      }

      const member = await this.userRepository.findOne({ where: { id: Number(payload.userId) } });
      if (!member) {
        throw new UnauthorizedException('Người dùng không tồn tại');
      }

      const isUserInGroup = group.members.some(m => m.id.toString() === payload.userId);
      if (isUserInGroup) {
        console.log(`Người dùng ${payload.userId} đã là thành viên`);
        return;  // Nếu người dùng đã có trong nhóm
      }

      group.members.push(member);
      await this.groupRepository.save(group);

      return { groupId: group.id, members: group.members };
    } catch (error) {
      console.error('Lỗi khi thêm người dùng vào nhóm:', error);
      throw new UnauthorizedException('Lỗi khi thêm người dùng vào nhóm');
    }
  }

  async getGroupUsers(groupId: string) {
    try {
      const group = await this.groupRepository.findOne({
        where: { id: Number(groupId) },
        relations: ['members'],
      });

      if (group) {
        const users = group.members.map(member => ({
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
        }));

        return { users };
      } else {
        console.log(`Nhóm với ID ${groupId} không tồn tại`);
        throw new UnauthorizedException('Nhóm không tồn tại');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thành viên nhóm:', error);
      throw new UnauthorizedException('Lỗi khi lấy danh sách thành viên');
    }
  }

}
