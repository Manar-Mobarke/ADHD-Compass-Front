import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: '../account-registration/account-registration.css'
})
export class SignInComponent {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  showPassword = false;
  submitted = false;

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.submitted = false;
      return;
    }

    this.submitted = true;
  }
}
