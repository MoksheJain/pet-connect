import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Vaccination } from './vaccination.entity';
import { Reminder } from './reminder.entity';
import { MedicalHistory } from './medical-history.entity';

@Entity()
export class Pet {
    @PrimaryGeneratedColumn()
    pet_id: number;

    @Column()
    name: string;

    @Column()
    breed: string;

    @Column()
    age: number;

    @CreateDateColumn()
    created_date: Date;

    @ManyToOne(() => User, (user) => user.pets, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => Vaccination, (v) => v.pet, { cascade: true })
    vaccinations: Vaccination[];

    @OneToMany(() => Reminder, (r) => r.pet, { cascade: true })
    reminders: Reminder[];

    @OneToMany(() => MedicalHistory, (h) => h.pet, { cascade: true })
    history: MedicalHistory[];
}