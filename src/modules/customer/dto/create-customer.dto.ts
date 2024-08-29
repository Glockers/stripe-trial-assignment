import { IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @IsEmail()
  email: string;
}
