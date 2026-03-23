import { PetDecorator } from "./pet.decorator";

export class MedicalHistoryDecorator extends PetDecorator {
    constructor(petProfile: any, private history: any[]) {
        super(petProfile);
    }

    getDetails() {
        const base = super.getDetails();

        return {
            ...base,
            history: this.history.map(h => ({
                diagnosis: h.diagnosis,
                treatment: h.treatment,
            })),
        };
    }
}