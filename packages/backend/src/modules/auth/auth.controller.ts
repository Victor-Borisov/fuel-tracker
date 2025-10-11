import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  HttpCode,
  HttpStatus,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      message: 'User registered successfully',
      user,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Req() req: any, @Body() loginDto: LoginDto) {
    return {
      message: 'Login successful',
      user: req.user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout current user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout(@Req() req: any) {
    req.logout((err: any) => {
      if (err) {
        return { message: 'Logout failed' };
      }
    });
    return { message: 'Logout successful' };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns current user data' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  getProfile(@Req() req: any) {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile settings' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    const updatedUser = await this.authService.updateProfile(req.user.id, updateProfileDto);
    return {
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('account')
  @ApiOperation({ summary: 'Delete user account and all associated data' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteAccount(@Req() req: any) {
    const result = await this.authService.deleteAccount(req.user.id);
    req.logout((err: any) => {
      if (err) {
        console.error('Logout after account deletion failed:', err);
      }
    });
    return result;
  }
}
