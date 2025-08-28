import { Injectable } from '@angular/core';
import { Database, ref, get, push, set, remove, update } from '@angular/fire/database';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private db: Database) {}

  // Ambil semua users
  getUsers(): Observable<any[]> {
    const usersRef = ref(this.db);
    return from(
      get(usersRef).then(snapshot => {
        if (!snapshot.exists()) return [];
        return Object.entries(snapshot.val()).map(([key, value]: any) => ({
          id: key,
          ...value
        }));
      })
    );
  }

  // Tambah user baru
  addUser(user: any): Promise<void> {
    const usersRef = ref(this.db);
    const newUserRef = push(usersRef); 
    return set(newUserRef, { ...user, id: newUserRef.key });
  }

  // Update user berdasarkan id
  updateUser(id: string, user: any): Promise<void> {
    const userRef = ref(this.db, `/${id}`);
    return update(userRef, user);
  }

  // Hapus user
  deleteUser(id: string): Promise<void> {
    const userRef = ref(this.db, `/${id}`);
    return remove(userRef);
  }
}
