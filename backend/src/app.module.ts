import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetModule } from './modules/pet/pet.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'mokshejain',
      password: 'yourpassword',
      database: 'petdb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    PetModule,   // ❗ MUST be here
    AuthModule,  // ❗ MUST be here
  ],
})
export class AppModule { }