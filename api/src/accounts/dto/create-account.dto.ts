import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  status?: string;
}
