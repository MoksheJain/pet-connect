import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { Pet } from './pet.entity';

@Entity()
export class Reminder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    reminder_type: string;

    @Column({ type: 'timestamp' })
    due_date: Date;

    @Column({ default: false })
    sent_status: boolean;

    @ManyToOne(() => Pet, (pet) => pet.reminders, {
        onDelete: 'CASCADE',
    })
    pet: Pet;
}