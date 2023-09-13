import { IsJWT, IsNotEmpty } from 'class-validator';
import { isValidJWT } from 'src/utils/customValidators';

export class AllowUserDTO {
  @IsNotEmpty()
  noteId: string;

  @IsJWT()
  @isValidJWT()
  token: string;

  @IsNotEmpty()
  userToAdd: string;
}
