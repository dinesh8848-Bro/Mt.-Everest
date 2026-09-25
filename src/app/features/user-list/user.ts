import { Service, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  CollectionReference,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AppUser } from './user.model';

@Service()
export class User {
  private firestore = inject(Firestore);

  private usersCollection = collection(
    this.firestore,
    'users'
  ) as CollectionReference<AppUser>;

  /** Live stream of all users, each including its Firestore document id. */
  getUsers(): Observable<AppUser[]> {
    return collectionData(this.usersCollection, { idField: 'id' }) as Observable<AppUser[]>;
  }

  /** Create a new user. createdAt is stamped server-side. */
  addUser(name: string, role: string) {
    return addDoc(this.usersCollection, {
      name,
      role,
      enabled: true,
      createdAt: serverTimestamp(),
    } as unknown as AppUser);
  }

  /** Update name/role on an existing user. */
  updateUser(id: string, changes: Partial<Pick<AppUser, 'name' | 'role'>>) {
    const userDoc = doc(this.firestore, `users/${id}`);
    return updateDoc(userDoc, changes);
  }

  /** Toggle a user's enabled/disabled state. */
  setEnabled(id: string, enabled: boolean) {
    const userDoc = doc(this.firestore, `users/${id}`);
    return updateDoc(userDoc, { enabled });
  }
  /** Permanently delete a user document. */
 deleteUser(id: string) {
  const userDoc = doc(this.firestore, `users/${id}`);
  return deleteDoc(userDoc);
}
}