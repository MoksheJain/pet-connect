import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Get,
    Param,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';

@Controller('pet')
export class PetController {
    constructor(private petService: PetService) { }

    // ✅ CREATE PET
    @UseGuards(JwtAuthGuard)
    @Post()
    createPet(@Req() req, @Body() body: CreatePetDto) {
        return this.petService.createPet(req.user.userId, body);
    }

    // ✅ FULL PROFILE (DECORATOR)
    @UseGuards(JwtAuthGuard)
    @Get(':id/full-profile')
    getFullProfile(@Req() req, @Param('id') id: number) {
        return this.petService.getFullPetProfile(id, req.user.userId);
    }

    // ✅ GET SINGLE PET
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getPet(@Req() req, @Param('id') id: number) {
        return this.petService.getPetById(id, req.user.userId);
    }

    // ✅ GET ALL PETS
    @UseGuards(JwtAuthGuard)
    @Get()
    getPets(@Req() req) {
        return this.petService.getUserPets(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/vaccination')
    addVaccination(@Req() req, @Param('id') id: number, @Body() body: any) {
        return this.petService.addVaccination(id, req.user.userId, body);
    }

    // ✅ ADD REMINDER API
    @UseGuards(JwtAuthGuard)
    @Post(':id/reminder')
    addReminder(@Req() req, @Param('id') id: number, @Body() body: any) {
        return this.petService.addReminder(id, req.user.userId, body);
    }

    // ✅ ADD HISTORY API
    @UseGuards(JwtAuthGuard)
    @Post(':id/history')
    addHistory(@Req() req, @Param('id') id: number, @Body() body: any) {
        return this.petService.addHistory(id, req.user.userId, body);
    }
}