import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";
export class UserJwtDto {
    id:string;
    email:string;
    isAdmin:boolean;
    role?:{permission_name:string}[];
}
export class LoginUserDto{
    @IsEmail()
    @ApiProperty()
    email: string;
    @ApiProperty()
    @IsString()
    password: string;
}