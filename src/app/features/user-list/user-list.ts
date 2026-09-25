import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from './user';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppUser } from './user.model';
import { UserForm } from './user-form/user-form';

@Component({
  imports: [CommonModule, UserForm],
  selector: 'app-user-list',
  styleUrl: './user-list.scss',
  templateUrl: './user-list.html',
})
export class UserList {
  private userService = inject(User);

  users$: Observable<AppUser[]> = this.userService.getUsers();

  private searchTerm$ = new BehaviorSubject<string>('');
  private roleFilter$ = new BehaviorSubject<string>('ALL');

  filteredUsers$: Observable<AppUser[]> = combineLatest([
    this.users$,
    this.searchTerm$,
    this.roleFilter$,
  ]).pipe(
    map(([users, term, role]) => {
      const t = term.trim().toLowerCase();
      return users.filter((u) => {
        const matchesSearch =
          !t || u.name.toLowerCase().includes(t) || u.role.toLowerCase().includes(t);
        const matchesRole = role === 'ALL' || u.role === role;
        return matchesSearch && matchesRole;
      });
    })
  );

  onSearch(term: string) {
    this.searchTerm$.next(term);
  }

  onRoleFilterChange(role: string) {
    this.roleFilter$.next(role);
  }

  isModalOpen = signal(false);
  editingUser = signal<AppUser | null>(null);

  openAddModal() {
    this.editingUser.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(user: AppUser) {
    this.editingUser.set(user);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingUser.set(null);
  }

 onSave(value: { name: string; role: string }) {
  const current = this.editingUser();
  if (current?.id) {
    this.userService.updateUser(current.id, value);
  } else {
    this.userService.addUser(value.name, value.role);
  }
  this.closeModal();
}

  onDelete(user: AppUser) {
    if (!user.id) return;
    const confirmed = confirm(`Remove ${user.name}? This can't be undone.`);
    if (!confirmed) return;
    this.userService.deleteUser(user.id);
  }
  onToggleEnabled(user: AppUser) {
  if (!user.id) return;
  this.userService.setEnabled(user.id, !user.enabled);
}

}