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

    @IsNotEmpty()
    status: number;
}
