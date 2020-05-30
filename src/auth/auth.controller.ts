import { AuthService } from './auth.service';
import { AuthCredantialsDto } from './dto/auth-credantials.dto';
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredantialsDto: AuthCredantialsDto,
  ): Promise<void> {
    return this.authService.signAuth(authCredantialsDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredantialsDto: AuthCredantialsDto,
  ): Promise<{ accesToken: string }> {
    return this.authService.signIn(authCredantialsDto);
  }
}
