
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email:string;
    @ApiProperty()
    @IsNotEmpty()
    password:string;
    @ApiProperty()
    @IsNotEmpty()
    firstName:string;
    @ApiProperty()
    @IsNotEmpty()
    lastName:string;
}
export class LoginUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email:string;
    @ApiProperty()
    @IsNotEmpty()
    password:string;

}