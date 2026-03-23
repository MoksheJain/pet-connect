import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pet } from './entities/pet.entity';
import { User } from '../auth/entities/user.entity';
import { BasicPetProfile } from 'src/decorators/basic-pet-profile';
import { MedicalHistoryDecorator } from 'src/decorators/medical-history.decorator';
import { ReminderDecorator } from 'src/decorators/reminder.decorator';
import { VaccinationDecorator } from 'src/decorators/vaccination.decorator';
import { PetProfile } from 'src/decorators/pet-profile.interface';
import { Vaccination } from './entities/vaccination.entity';
import { MedicalHistory } from './entities/medical-history.entity';
import { Reminder } from './entities/reminder.entity';

@Injectable()
export class PetService {
    constructor(
        @InjectRepository(Pet)
        private petRepo: Repository<Pet>,

        @InjectRepository(User)
        private userRepo: Repository<User>,

        @InjectRepository(Vaccination)
        private vaccinationRepo: Repository<Vaccination>,

        @InjectRepository(Reminder)             // ✅ ADD
        private reminderRepo: Repository<Reminder>,

        @InjectRepository(MedicalHistory)       // ✅ ADD
        private historyRepo: Repository<MedicalHistory>,
    ) { }

    // ✅ CREATE PET
    async createPet(userId: number, data: any) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const pet = this.petRepo.create({
            name: data.name,
            breed: data.breed,
            age: data.age,
            user: user,
        });

        return this.petRepo.save(pet);
    }

    // ✅ GET ALL PETS OF USER
    async getUserPets(userId: number) {
        return this.petRepo.find({
            where: {
                user: { id: userId },
            },
            relations: ['vaccinations', 'reminders', 'history'],
        });
    }

    // ✅ GET SINGLE PET
    async getPetById(petId: number, userId: number) {
        const pet = await this.petRepo.findOne({
            where: {
                pet_id: petId,
                user: { id: userId },
            },
            relations: ['vaccinations', 'reminders', 'history'],
        });

        if (!pet) {
            throw new NotFoundException('Pet not found');
        }

        return pet;
    }

    async getFullPetProfile(petId: number, userId: number) {
        const pet = await this.petRepo.findOne({
            where: {
                pet_id: petId,
                user: { id: userId },
            },
            relations: ['vaccinations', 'reminders', 'history'],
        });

        if (!pet) {
            throw new NotFoundException('Pet not found');
        }

        let profile: PetProfile = new BasicPetProfile(pet);

        if (pet.vaccinations?.length) {
            profile = new VaccinationDecorator(profile, pet.vaccinations);
        }

        if (pet.reminders?.length) {
            profile = new ReminderDecorator(profile, pet.reminders);
        }

        if (pet.history?.length) {
            profile = new MedicalHistoryDecorator(profile, pet.history);
        }

        return profile.getDetails();
    }

    async addVaccination(petId: number, userId: number, data: any) {
        const pet = await this.petRepo.findOne({
            where: {
                pet_id: petId,
                user: { id: userId },
            },
        });

        if (!pet) throw new NotFoundException('Pet not found');

        const vaccination = this.vaccinationRepo.create({
            ...data,
            pet,
        });

        return this.vaccinationRepo.save(vaccination);
    }

    // ✅ ADD REMINDER
    async addReminder(petId: number, userId: number, data: any) {
        const pet = await this.petRepo.findOne({
            where: { pet_id: petId, user: { id: userId } },
        });

        if (!pet) throw new NotFoundException('Pet not found');

        const reminder = this.reminderRepo.create({
            reminder_type: data.reminder_type,
            due_date: data.due_date,
            sent_status: false,
            pet,
        });

        return this.reminderRepo.save(reminder);
    }


    // ✅ ADD HISTORY
    async addHistory(petId: number, userId: number, data: any) {
        const pet = await this.petRepo.findOne({
            where: { pet_id: petId, user: { id: userId } },
        });

        if (!pet) throw new NotFoundException('Pet not found');

        const history = this.historyRepo.create({
            diagnosis: data.diagnosis,
            treatment: data.treatment,
            visit_date: data.visit_date,
            notes: data.notes,
            pet,
        });

        return this.historyRepo.save(history);
    }
}