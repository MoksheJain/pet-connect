import { PetDecorator } from "./pet.decorator";

export class ReminderDecorator extends PetDecorator {
    constructor(petProfile: any, private reminders: any[]) {
        super(petProfile);
    }

    getDetails() {
        const base = super.getDetails();

        return {
            ...base,
            reminders: this.reminders.map(r => ({
                type: r.reminder_type,
                due_date: r.due_date,
            })),
        };
    }
}