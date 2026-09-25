import { Timestamp } from '@angular/fire/firestore';

export interface AppUser {
  id?: string;
  name: string;
  role: string;
  enabled: boolean;
  createdAt?: Timestamp;
}