import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export const RESOURCE_TYPES = ['email_template', 'call_script'] as const;

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsIn(RESOURCE_TYPES)
  type!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content!: string;
}
