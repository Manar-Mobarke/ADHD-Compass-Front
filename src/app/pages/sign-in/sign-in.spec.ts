import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SignInComponent } from './sign-in';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should require a valid email and password', () => {
    component.onSubmit();

    expect(component.form.invalid).toBe(true);
    expect(component.form.controls.email.touched).toBe(true);
    expect(component.form.controls.password.touched).toBe(true);
    expect(component.submitted).toBe(false);
  });

  it('should locally validate the credentials without claiming a server sign-in', () => {
    component.form.setValue({
      email: 'person@example.com',
      password: 'secure-password'
    });

    component.onSubmit();
    fixture.detectChanges();

    expect(component.submitted).toBe(true);
    expect(fixture.nativeElement.querySelector('.submission-notice')?.textContent)
      .toContain('غير متاح حاليًا');
  });
});
