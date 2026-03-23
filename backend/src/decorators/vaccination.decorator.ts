import { PetDecorator } from "./pet.decorator";

export class VaccinationDecorator extends PetDecorator {
    constructor(petProfile: any, private vaccinations: any[]) {
        super(petProfile);
    }

    getDetails() {
        const base = super.getDetails();

        return {
            ...base,
            vaccinations: this.vaccinations.map(v => ({
                vaccine_name: v.vaccine_name,
                dose: v.dose,
            })),
        };
    }
}