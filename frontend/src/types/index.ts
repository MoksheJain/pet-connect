export interface Pet {
  _id: string;
  id?: string;
  name: string;
  breed: string;
  age: number;
  species?: string;
  weight?: number;
  owner?: string;
}

export interface Vaccination {
  _id: string;
  vaccineName: string;
  dateAdministered: string;
  nextDueDate?: string;
  notes?: string;
}

export interface Reminder {
  _id: string;
  title: string;
  dueDate: string;
  description?: string;
  completed?: boolean;
}

export interface MedicalHistory {
  _id: string;
  date: string;
  description: string;
  veterinarian?: string;
}

export interface PetFullProfile extends Pet {
  vaccinations: Vaccination[];
  reminders: Reminder[];
  medicalHistory: MedicalHistory[];
}

export interface AuthUser {
  name?: string;
  email: string;
  id?: string;
}
