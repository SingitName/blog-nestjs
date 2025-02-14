import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { TypeInformation } from "../interface/information.interface";

export class SaveInformationDto {
    @IsNumber()
    user_id:number|null;
    @IsOptional()
    @IsBoolean()
    status: boolean | null;
  
    @IsOptional()
    @IsEnum(TypeInformation)
    type: TypeInformation | null;
  
    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    value: string | null;

}