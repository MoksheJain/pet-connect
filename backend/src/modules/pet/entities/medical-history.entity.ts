import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { Pet } from './pet.entity';

@Entity()
export class MedicalHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    diagnosis: string;

    @Column()
    treatment: string;

    @Column({ type: 'date' })
    visit_date: Date;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @ManyToOne(() => Pet, (pet) => pet.history, {
        onDelete: 'CASCADE',
    })
    pet: Pet;
}