import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

type AccountType = 'self' | 'parent';

@Component({
  selector: 'app-account-registration',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './account-registration.html',
  styleUrl: './account-registration.css'
})
export class AccountRegistrationComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  readonly accountType: AccountType =
    this.route.snapshot.data['accountType'] === 'parent' ? 'parent' : 'self';
  readonly isParent = this.accountType === 'parent';
  readonly form: FormGroup;
  showPassword = false;
  showPasswordConfirm = false;
  submitted = false;

  constructor() {
    const accountControls = this.isParent
      ? {
          fullName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          phone: ['', [Validators.required, Validators.pattern(/^01[0125]\d{8}$/)]],
          relation: ['', Validators.required],
          childName: ['', Validators.required],
          childBirthDate: ['', Validators.required],
          childGender: ['', Validators.required],
          diagnosisStatus: ['not_diagnosed', Validators.required],
          password: ['', this.passwordValidators],
          passwordConfirm: ['', [Validators.required, Validators.minLength(8)]]
        }
      : {
          fullName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          phone: ['', [Validators.required, Validators.pattern(/^01[0125]\d{8}$/)]],
          birthDate: ['', Validators.required],
          gender: ['', Validators.required],
          diagnosisStatus: ['not_diagnosed', Validators.required],
          password: ['', this.passwordValidators],
          passwordConfirm: ['', [Validators.required, Validators.minLength(8)]]
        };

    this.form = this.fb.group(accountControls, { validators: this.passwordsMatchValidator });
  }

  private readonly passwordValidators = [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/(?=.*\p{N})(?=.*[^\p{L}\p{N}]).{8,}/u)
  ];

  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmation = group.get('passwordConfirm')?.value;

    return password && confirmation && password !== confirmation
      ? { passwordMismatch: true }
      : null;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.submitted = false;
      return;
    }

    this.submitted = true;
  }
}
