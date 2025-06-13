<<<<<<< HEAD:src/auth/dto/register_user.dto.ts
import { IsString, IsNotEmpty, IsEmail, IsOptional } from "class-validator";

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty({ message: 'Không được để trống!' })
    firstName: string;

    @IsString()
    @IsNotEmpty({ message: 'Không được để trống!' })
    lastName: string;

    @IsEmail({}, { message: 'Email không hợp lệ!' })
    @IsNotEmpty()
    email: string;

    @IsNotEmpty({ message: 'Không được để trống!' })
    password: string;

=======

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
>>>>>>> bdd37fd (wip:begin login):src/modules/auth/auth.dto.ts
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