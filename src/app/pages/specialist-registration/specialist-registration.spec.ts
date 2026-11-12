import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SpecialistRegistrationComponent } from './specialist-registration';

describe('SpecialistRegistrationComponent', () => {
  let component: SpecialistRegistrationComponent;
  let fixture: ComponentFixture<SpecialistRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialistRegistrationComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialistRegistrationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render a duplicate page navbar', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.topbar')).toBeNull();
  });

  it('should require valid personal details before continuing', () => {
    expect(component.personalForm.invalid).toBe(true);

    component.personalForm.setValue({
      fullName: 'Manar Mobarke',
      email: 'manar@example.com',
      phone: '01012345678',
      country: 'مصر',
      city: 'القاهرة',
      professionalTitle: 'أخصائي نفسي',
      profilePhoto: null,
    });

    expect(component.personalForm.valid).toBe(true);
  });

  it('should require professional details and at least one age group', () => {
    component.currentStep = 4;
    component.professionalForm.patchValue({
      specialization: 'أخصائي نفسي',
      childExperience: 5,
      adhdExperience: 3
    });
    component.professionalForm.controls['ageGroups'].setValue([]);

    component.onProfessionalSubmit();

    expect(component.currentStep).toBe(4);
    expect(component.professionalForm.controls['ageGroups'].invalid).toBe(true);

    component.professionalForm.controls['ageGroups'].setValue(['children']);
    component.onProfessionalSubmit();

    expect(component.currentStep).toBe(5);
  });

  it('should require all methodology answers before continuing', () => {
    component.currentStep = 5;

    component.onMethodologySubmit();

    expect(component.currentStep).toBe(5);

    component.methodologyForm.setValue({
      focusStrategy: 'تقسيم المهام إلى خطوات قصيرة.',
      parentCommunication: 'مشاركة التوصيات بلغة واضحة.',
      referralCriteria: 'عند الحاجة إلى تقييم تخصصي إضافي.'
    });
    component.onMethodologySubmit();

    expect(component.currentStep).toBe(6);
  });

  it('should submit medical service selections and continue', () => {
    component.currentStep = 6;

    expect(component.medicalServicesForm.valid).toBe(true);
    component.onMedicalServicesSubmit();

    expect(component.currentStep).toBe(7);
  });

  it('should require a certificate name and supported file before continuing', () => {
    component.currentStep = 7;

    component.onCertificatesSubmit();

    expect(component.currentStep).toBe(7);
    expect(component.certificates.at(0).get('name')?.invalid).toBe(true);
    expect(component.certificates.at(0).get('file')?.hasError('required')).toBe(true);

    component.certificates.at(0).patchValue({ name: 'دبلوم تخصصي' });
    component.certificates.at(0).get('file')?.setValue(
      new File(['certificate'], 'certificate.pdf', { type: 'application/pdf' })
    );
    component.onCertificatesSubmit();

    expect(component.currentStep).toBe(8);
  });

  it('should allow adding and removing certificate entries', () => {
    component.addCertificate();
    expect(component.certificates.length).toBe(2);

    component.removeCertificate(0);
    expect(component.certificates.length).toBe(1);
  });

  it('should reject certificate files larger than 5 megabytes or with unsupported extensions', () => {
    const fileControl = component.certificates.at(0).get('file');
    fileControl?.setValue(new File(['content'], 'certificate.exe'));
    expect(fileControl?.hasError('fileType')).toBe(true);

    fileControl?.setValue(new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'certificate.pdf'));
    expect(fileControl?.hasError('fileSize')).toBe(true);
  });

  it('should require activity names and descriptions before continuing', () => {
    component.currentStep = 8;

    component.onActivitiesSubmit();

    expect(component.currentStep).toBe(8);

    component.activities.at(0).setValue({
      name: 'تدريب الوظائف التنفيذية',
      description: 'أنشطة قصيرة لتحسين التخطيط وإدارة الوقت.'
    });
    component.onActivitiesSubmit();

    expect(component.currentStep).toBe(9);
  });

  it('should support adding and removing activities', () => {
    component.addActivity();
    expect(component.activities.length).toBe(2);

    component.removeActivity(0);
    expect(component.activities.length).toBe(1);
  });

  it('should require online platforms and valid availability times', () => {
    component.currentStep = 9;
    component.scheduleForm.controls['platforms'].setValue([]);
    component.scheduleSlots.at(0).patchValue({ startTime: '20:00', endTime: '16:00' });

    component.onScheduleSubmit();

    expect(component.currentStep).toBe(9);
    expect(component.scheduleForm.controls['platforms'].invalid).toBe(true);
    expect(component.scheduleSlots.at(0).hasError('invalidTimeRange')).toBe(true);

    component.scheduleForm.controls['platforms'].setValue(['zoom']);
    component.scheduleSlots.at(0).patchValue({ startTime: '16:00', endTime: '20:00' });
    component.onScheduleSubmit();

    expect(component.currentStep).toBe(10);
  });

  it('should support adding and removing availability slots', () => {
    component.addScheduleSlot();
    expect(component.scheduleSlots.length).toBe(3);

    component.removeScheduleSlot(0);
    expect(component.scheduleSlots.length).toBe(2);
  });

  it('should send review edits back to the selected step', () => {
    component.currentStep = 10;
    fixture.detectChanges();

    const editButtons = fixture.nativeElement.querySelectorAll('.review-edit-button') as NodeListOf<HTMLButtonElement>;
    const submitButton = fixture.nativeElement.querySelector('.review-actions .primary-button') as HTMLButtonElement;

    expect(editButtons.length).toBe(9);
    expect(Array.from(editButtons).every((button) => button.textContent?.includes('←'))).toBe(true);
    expect(submitButton.textContent).toContain('→');

    component.editStep(4);

    expect(component.currentStep).toBe(4);
    expect(component.submitted).toBe(false);
  });

  it('should block final submission and navigate to the first invalid step', () => {
    component.currentStep = 10;

    component.onRegistrationSubmit();

    expect(component.currentStep).toBe(1);
    expect(component.personalForm.controls['fullName'].touched).toBe(true);
    expect(component.submitted).toBe(false);
  });

  it('should complete the local review only when every registration step is valid', () => {
    component.personalForm.patchValue({
      fullName: 'سارة خالد',
      email: 'sara@example.com',
      phone: '01012345678',
      country: 'مصر',
      city: 'القاهرة',
      professionalTitle: 'أخصائي نفسي'
    });
    component.accountForm.setValue({ password: 'password123', confirmPassword: 'password123' });
    component.educationForm.setValue({
      university: 'جامعة القاهرة',
      graduationYear: 2018,
      address: 'القاهرة'
    });
    component.professionalForm.patchValue({
      specialization: 'أخصائي نفسي',
      childExperience: 5,
      adhdExperience: 3
    });
    component.methodologyForm.setValue({
      focusStrategy: 'تقسيم المهام.',
      parentCommunication: 'شرح التوصيات.',
      referralCriteria: 'عند الحاجة.'
    });
    component.certificates.at(0).patchValue({ name: 'دبلوم تخصصي' });
    component.certificates.at(0).get('file')?.setValue(
      new File(['certificate'], 'certificate.pdf', { type: 'application/pdf' })
    );
    component.activities.at(0).setValue({
      name: 'تدريب المهارات',
      description: 'تطبيق نشاط تدريبي.'
    });

    component.currentStep = 10;
    component.onRegistrationSubmit();

    expect(component.submitted).toBe(true);
    expect(component.currentStep).toBe(10);

    fixture.detectChanges();

    const confirmation = fixture.nativeElement.querySelector('.registration-confirmation') as HTMLElement;
    expect(confirmation.textContent).toContain('لم يتم الإرسال');
    expect(confirmation.textContent).toContain('لا يتم تقديم طلب أو إنشاء رقم مرجعي');
    expect(confirmation.textContent).toContain('ربط نموذج التسجيل بخادم آمن');
  });
});
