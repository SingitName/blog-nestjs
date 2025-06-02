import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    firstName:string;
    @IsString()
    @IsNotEmpty()
    lastName:string;
    @IsEmail({},{message:'Email không hợp lệ!'})
    @IsNotEmpty()
    email:string;
    @IsNotEmpty()
    password:string;
    @IsNotEmpty()
    status:number;
}