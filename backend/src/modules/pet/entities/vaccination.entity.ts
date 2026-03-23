import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { Pet } from './pet.entity';

@Entity()
export class Vaccination {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    vaccine_name: string;

    @Column()
    dose: string;

    @Column({ type: 'date' })
    administered_date: Date;

    @Column({ type: 'date' })
    expiry: Date;

    @ManyToOne(() => Pet, (pet) => pet.vaccinations, {
        onDelete: 'CASCADE',
    })
    pet: Pet;
}