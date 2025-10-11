import { IsEmail, IsString, MinLength, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Pass1234',
    description: 'Password (min 8 characters, must contain at least 1 letter and 1 number)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'Password must contain at least 1 letter and 1 number',
  })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Display name (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  displayName?: string;
}
