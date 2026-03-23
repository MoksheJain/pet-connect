import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async signup(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = this.userRepo.create({
            ...data,
            password: hashedPassword,
        });

        return this.userRepo.save(user);
    }

    async login(data: any) {
        const user = await this.userRepo.findOne({
            where: { email: data.email },
        });

        if (!user) throw new UnauthorizedException();

        const isMatch = await bcrypt.compare(data.password, user.password);

        if (!isMatch) throw new UnauthorizedException();

        const token = this.jwtService.sign({ userId: user.id });

        return { access_token: token };
    }
}