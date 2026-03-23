import { PetProfile } from "./pet-profile.interface";

export abstract class PetDecorator implements PetProfile {
    constructor(protected petProfile: PetProfile) { }

    getDetails(): any {  
        return this.petProfile.getDetails();
    }
}