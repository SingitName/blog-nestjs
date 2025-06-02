import { User } from "src/user/entities/user.entity";

export class CreateImagesDto{
    fileId:string;
    webViewLink:string;
    webContentLink:string;
    user:User;

}