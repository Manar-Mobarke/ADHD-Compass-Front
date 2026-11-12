import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-specialist-registration',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './specialist-registration.html',
  styleUrl: './specialist-registration.css'
})
export class SpecialistRegistrationComponent {
  currentStep = 1;
  selectedPhotoName = '';
  totalSteps = 10;
  submitted = false;
  
  readonly steps = [
    'معلوماتك الشخصية',
    'تأمين الحساب',
    'التعليم',
    'المعلومات المهنية',
    'النهج المهني',
    'الخدمات الطبية',
    'الشهادات',
    'الأنشطة',
    'المنصات والمواعيد',
    'المراجعة'
  ];

  readonly personalForm: FormGroup;
  readonly accountForm: FormGroup;
  readonly educationForm: FormGroup;
  readonly professionalForm: FormGroup;
  readonly methodologyForm: FormGroup;
  readonly medicalServicesForm: FormGroup;
  readonly certificatesForm: FormGroup;
  readonly activitiesForm: FormGroup;
  readonly scheduleForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.personalForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      country: ['مصر', Validators.required],
      city: ['', Validators.required],
      professionalTitle: ['', Validators.required],
      profilePhoto: this.fb.control<File | null>(null)
    });

    this.accountForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
      },
      { validators: this.passwordsMatchValidator }
    );

    this.educationForm = this.fb.group({
      university: ['', Validators.required],
      graduationYear: ['', [Validators.required, Validators.min(1960), Validators.max(new Date().getFullYear())]],
      address: ['', Validators.required]
    });

    this.professionalForm = this.fb.group({
      specialization: ['', Validators.required],
      ageGroups: this.fb.nonNullable.control<string[]>(['children'], this.atLeastOneSelection),
      workMode: ['online', Validators.required],
      childExperience: ['', [Validators.required, Validators.min(0)]],
      adhdExperience: ['', [Validators.required, Validators.min(0)]],
      caseCount: ['10-30', Validators.required]
    });

    this.methodologyForm = this.fb.group({
      focusStrategy: ['', Validators.required],
      parentCommunication: ['', Validators.required],
      referralCriteria: ['', Validators.required]
    });

    this.medicalServicesForm = this.fb.group({
      adhdDiagnosis: ['yes', Validators.required],
      adhdMedication: ['no', Validators.required]
    });

    this.certificatesForm = this.fb.group({
      certificates: this.fb.array([this.createCertificateGroup()], Validators.required)
    });

    this.activitiesForm = this.fb.group({
      activities: this.fb.array([this.createActivityGroup()], Validators.required)
    });

    this.scheduleForm = this.fb.group({
      platforms: this.fb.nonNullable.control<string[]>(['zoom', 'google-meet'], this.atLeastOneSelection),
      slots: this.fb.array([
        this.createScheduleSlot('sunday', '16:00', '20:00'),
        this.createScheduleSlot('tuesday', '17:00', '21:00')
      ], Validators.required)
    });
  }

  get f() {
    return this.personalForm.controls;
  }

  get personalControls() {
    return this.personalForm.controls;
  }

  get accountControls() {
    return this.accountForm.controls;
  }

  get educationControls() {
    return this.educationForm.controls;
  }

  get professionalControls() {
    return this.professionalForm.controls;
  }

  get methodologyControls() {
    return this.methodologyForm.controls;
  }

  get medicalServicesControls() {
    return this.medicalServicesForm.controls;
  }

  get selectedAgeGroups(): string[] {
    return this.professionalForm.controls['ageGroups'].value;
  }

  get certificates(): FormArray {
    return this.certificatesForm.controls['certificates'] as FormArray;
  }

  get activities(): FormArray {
    return this.activitiesForm.controls['activities'] as FormArray;
  }

  get scheduleSlots(): FormArray {
    return this.scheduleForm.controls['slots'] as FormArray;
  }

  get selectedPlatforms(): string[] {
    return this.scheduleForm.controls['platforms'].value;
  }

  get ageGroupLabels(): string[] {
    const labels: Record<string, string> = {
      children: 'الأطفال',
      adolescents: 'المراهقون',
      adults: 'البالغون'
    };

    return this.selectedAgeGroups.map((ageGroup) => labels[ageGroup] ?? ageGroup);
  }

  get selectedPlatformLabels(): string[] {
    const labels: Record<string, string> = {
      zoom: 'Zoom',
      'google-meet': 'Google Meet',
      'microsoft-teams': 'Microsoft Teams',
      other: 'أخرى'
    };

    return this.selectedPlatforms.map((platform) => labels[platform] ?? platform);
  }

  get progressPercent(): number {
    return Math.round((this.currentStep / this.steps.length) * 100);
  }

  passwordsMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }

  private atLeastOneSelection(control: AbstractControl) {
    return Array.isArray(control.value) && control.value.length > 0
      ? null
      : { required: true };
  }

  private certificateFileValidator(control: AbstractControl): ValidationErrors | null {
    const file = control.value as File | null;
    if (!file) {
      return { required: true };
    }

    const allowedExtensions = /\.(pdf|doc|docx|jpg|jpeg|png)$/i;
    if (!allowedExtensions.test(file.name)) {
      return { fileType: true };
    }

    return file.size <= 5 * 1024 * 1024 ? null : { fileSize: true };
  }

  private createCertificateGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      issuer: [''],
      issueDate: [''],
      file: [null, this.certificateFileValidator.bind(this)]
    });
  }

  private createActivityGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  private createScheduleSlot(day = '', startTime = '', endTime = ''): FormGroup {
    return this.fb.group(
      {
        day: [day, Validators.required],
        startTime: [startTime, Validators.required],
        endTime: [endTime, Validators.required]
      },
      { validators: this.validTimeRange }
    );
  }

  private validTimeRange(group: AbstractControl): ValidationErrors | null {
    const startTime = group.get('startTime')?.value as string;
    const endTime = group.get('endTime')?.value as string;

    return startTime && endTime && startTime >= endTime
      ? { invalidTimeRange: true }
      : null;
  }

  addCertificate(): void {
    this.certificates.push(this.createCertificateGroup());
  }

  removeCertificate(index: number): void {
    this.certificates.removeAt(index);
    this.certificates.markAsDirty();
  }

  onCertificateFileSelected(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    const fileControl = this.certificates.at(index).get('file');

    if (!fileControl) {
      throw new Error('Certificate file control is missing.');
    }

    fileControl.setValue(file);
    fileControl.markAsTouched();

    if (file && fileControl.invalid) {
      input.value = '';
    }
  }

  onAgeGroupChange(ageGroup: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const selected = new Set(this.selectedAgeGroups);

    if (checked) {
      selected.add(ageGroup);
    } else {
      selected.delete(ageGroup);
    }

    this.professionalForm.controls['ageGroups'].setValue([...selected]);
    this.professionalForm.controls['ageGroups'].markAsTouched();
  }

  onPlatformChange(platform: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const selected = new Set(this.selectedPlatforms);

    if (checked) {
      selected.add(platform);
    } else {
      selected.delete(platform);
    }

    this.scheduleForm.controls['platforms'].setValue([...selected]);
    this.scheduleForm.controls['platforms'].markAsTouched();
  }

  addActivity(): void {
    this.activities.push(this.createActivityGroup());
  }

  removeActivity(index: number): void {
    this.activities.removeAt(index);
    this.activities.markAsDirty();
  }

  addScheduleSlot(): void {
    this.scheduleSlots.push(this.createScheduleSlot());
  }

  removeScheduleSlot(index: number): void {
    this.scheduleSlots.removeAt(index);
    this.scheduleSlots.markAsDirty();
  }

  editStep(step: number): void {
    this.submitted = false;
    this.currentStep = step;
  }

  dayLabel(day: string): string {
    const labels: Record<string, string> = {
      saturday: 'السبت',
      sunday: 'الأحد',
      monday: 'الاثنين',
      tuesday: 'الثلاثاء',
      wednesday: 'الأربعاء',
      thursday: 'الخميس',
      friday: 'الجمعة'
    };

    return labels[day] ?? day;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      input.value = '';
      return;
    }

    this.selectedPhotoName = file.name;
    this.personalForm.patchValue({ profilePhoto: file });
  }

  onSubmit(): void {
    this.personalForm.markAllAsTouched();

    if (this.personalForm.invalid) {
      return;
    }

    console.log('Personal information:', this.personalForm.value);
    this.goNext();
  }

  goBack(): void {
    if (this.currentStep > 1) {
      this.currentStep -= 1;
    }
  }

  goNext(): void {
    if (this.currentStep < this.steps.length) {
      this.currentStep += 1;
    }
  }

  onAccountSubmit(): void {
    this.accountForm.markAllAsTouched();

    if (this.accountForm.invalid) {
      return;
    }

    console.log('Account details:', this.accountForm.value);
    this.goNext();
  }

  onEducationSubmit(): void {
    this.educationForm.markAllAsTouched();

    if (this.educationForm.invalid) {
      return;
    }

    console.log('Education details:', this.educationForm.value);
    this.goNext();
  }

  onProfessionalSubmit(): void {
    this.professionalForm.markAllAsTouched();

    if (this.professionalForm.invalid) {
      return;
    }

    console.log('Professional information:', this.professionalForm.value);
    this.goNext();
  }

  onMethodologySubmit(): void {
    this.methodologyForm.markAllAsTouched();

    if (this.methodologyForm.invalid) {
      return;
    }

    console.log('Professional methodology:', this.methodologyForm.value);
    this.goNext();
  }

  onMedicalServicesSubmit(): void {
    this.medicalServicesForm.markAllAsTouched();

    if (this.medicalServicesForm.invalid) {
      return;
    }

    console.log('Medical services:', this.medicalServicesForm.value);
    this.goNext();
  }

  onCertificatesSubmit(): void {
    this.certificatesForm.markAllAsTouched();

    if (this.certificatesForm.invalid) {
      return;
    }

    console.log('Certificates:', this.certificatesForm.value);
    this.goNext();
  }

  onActivitiesSubmit(): void {
    this.activitiesForm.markAllAsTouched();

    if (this.activitiesForm.invalid) {
      return;
    }

    console.log('Activities:', this.activitiesForm.value);
    this.goNext();
  }

  onScheduleSubmit(): void {
    this.scheduleForm.markAllAsTouched();

    if (this.scheduleForm.invalid) {
      return;
    }

    console.log('Platforms and availability:', this.scheduleForm.value);
    this.goNext();
  }

  onRegistrationSubmit(): void {
    const formsByStep = [
      this.personalForm,
      this.accountForm,
      this.educationForm,
      this.professionalForm,
      this.methodologyForm,
      this.medicalServicesForm,
      this.certificatesForm,
      this.activitiesForm,
      this.scheduleForm
    ];

    const firstInvalidStep = formsByStep.findIndex((form) => form.invalid);
    if (firstInvalidStep !== -1) {
      formsByStep[firstInvalidStep].markAllAsTouched();
      this.currentStep = firstInvalidStep + 1;
      return;
    }

    this.submitted = true;
  }
}