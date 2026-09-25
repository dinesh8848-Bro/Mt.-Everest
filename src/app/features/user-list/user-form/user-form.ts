import { Component, inject, input, output, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppUser } from '../user.model';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-user-form',
  styleUrl: './user-form.scss',
  templateUrl: './user-form.html',
})
export class UserForm {
  private fb = inject(FormBuilder);

  editingUser = input<AppUser | null>(null);
  save = output<{ name: string; role: string }>();

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    role: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const user = this.editingUser();
      if (user) {
        this.form.setValue({ name: user.name, role: user.role });
      } else {
        this.form.reset({ name: '', role: '' });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue());
    this.form.reset({ name: '', role: '' });
  }
}