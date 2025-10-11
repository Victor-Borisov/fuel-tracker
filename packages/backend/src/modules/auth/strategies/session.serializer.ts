import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }

  serializeUser(user: any, done: (err: Error | null, user: any) => void): any {
    done(null, user.id);
  }

  async deserializeUser(userId: number, done: (err: Error | null, user: any) => void) {
    const user = await this.authService.findById(userId);
    done(null, user);
  }
}
