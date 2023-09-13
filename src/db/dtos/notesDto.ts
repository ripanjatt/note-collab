import { IsJWT, IsNotEmpty, MaxLength } from 'class-validator';
import { isValidJWT } from 'src/utils/customValidators';

export class NotesDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsJWT()
  @isValidJWT()
  token: string;

  @MaxLength(25000)
  content: string;
}
