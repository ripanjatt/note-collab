import { IsJWT, IsNotEmpty } from 'class-validator';
import { isValidJWT } from 'src/utils/customValidators';

export class DeleteNoteDTO {
  @IsNotEmpty()
  noteId: string;

  @IsJWT()
  @isValidJWT()
  token: string;
}
