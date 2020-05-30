import { JwtPayload } from './jwt-payload.interface';
import { AuthCredantialsDto } from './dto/auth-credantials.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signAuth(authCredantialsDto: AuthCredantialsDto): Promise<void> {
    return this.userRepository.signUp(authCredantialsDto);
  }
  async signIn(
    authCredantialsDto: AuthCredantialsDto,
  ): Promise<{ accesToken: string }> {
    const username = await this.userRepository.valdidateUserPassword(
      authCredantialsDto,
    );
    if (!username) {
      throw new UnauthorizedException('Kullanici Mevcut Deyil');
    }

    const payload: JwtPayload = { username };
    const accesToken = await this.jwtService.sign(payload);
    return { accesToken };
  }
}
