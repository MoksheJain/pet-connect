import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pet } from './entities/pet.entity';
import { Vaccination } from './entities/vaccination.entity';
import { Reminder } from './entities/reminder.entity';
import { MedicalHistory } from './entities/medical-history.entity';
import { User } from '../auth/entities/user.entity';   // ✅ ADD THIS

import { PetController } from './pet.controller';
import { PetService } from './pet.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Pet,
            Vaccination,
            Reminder,
            MedicalHistory,
            User,   // ❗ ADD THIS LINE
        ]),
    ],
    controllers: [PetController],
    providers: [PetService],
})
export class PetModule { }