import { AuthCredantialsDto } from './dto/auth-credantials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredantialsDto: AuthCredantialsDto) {
    const { username, password } = authCredantialsDto;

    const salt = await bcrypt.genSalt();

    const user = new User();
    user.username = username;
    user.salt = salt;
    user.password = await this.hashPassword(password, salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Kullanici Mevcut');
      }
      throw new InternalServerErrorException();
    }
  }

  async valdidateUserPassword(
    authCredantialsDto: AuthCredantialsDto,
  ): Promise<string> {
    const { username, password } = authCredantialsDto;
    const user = await this.findOne({ username });
    if (user && user.validatePassword(password)) {
      return user.username;
    }
    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
