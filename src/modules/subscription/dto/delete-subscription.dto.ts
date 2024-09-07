import { IsString, Matches } from 'class-validator';

export class DeleteSubscriptionDto {
  @IsString()
  @Matches(/^sub_/, { message: 'id must start with "sub_"' })
  id: string;
}
