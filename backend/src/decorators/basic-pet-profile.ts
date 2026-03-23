import { PetProfile } from "./pet-profile.interface";

export class BasicPetProfile implements PetProfile {
    constructor(private pet: any) { }

    getDetails() {
        return {
            name: this.pet.name,
            breed: this.pet.breed,
            age: this.pet.age,
        };
    }
}