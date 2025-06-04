import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, IsOptional } from "class-validator";

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    firstName: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @ApiProperty()
    @IsNotEmpty()
    password: string;
    @ApiProperty()
    @IsNotEmpty()
    status: number;
}
