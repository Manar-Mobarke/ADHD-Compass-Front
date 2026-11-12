import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Navbar } from './navbar';
import { routes } from '../../app.routes';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should link to the specialists directory', () => {
    const link = fixture.nativeElement.querySelector('a[href="/specialists"]') as HTMLAnchorElement | null;
    expect(link?.textContent).toContain('المتخصصون');
  });

  it('should show the compact header on registration and the landing header elsewhere', async () => {
    const router = TestBed.inject(Router);
    fixture.detectChanges();

    await router.navigateByUrl('/register');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.auth-header')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.nav-link')).toBeNull();

    await router.navigateByUrl('/specialist-register');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.auth-brand-copy small')?.textContent)
      .toContain('بوابة انضمام المتخصصين');

    await router.navigateByUrl('/login');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.auth-login-link')?.getAttribute('href'))
      .toBe('/register');
    expect(fixture.nativeElement.querySelector('.auth-login-link')?.textContent)
      .toContain('ليس لديك حساب؟');

    await router.navigateByUrl('/');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.auth-header')).toBeNull();
    expect(fixture.nativeElement.querySelector('.nav-link')).not.toBeNull();
  });

  it('should link the register action to registration type selection on desktop and mobile', async () => {
    const desktopLink = fixture.nativeElement.querySelector(
      '.register-btn[href="/register"]'
    ) as HTMLAnchorElement | null;
    expect(desktopLink?.textContent).toContain('إنشاء حساب');

    const menuButton = fixture.nativeElement.querySelector(
      'button[aria-controls="mobile-menu"]'
    ) as HTMLButtonElement;
    menuButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const mobileLink = fixture.nativeElement.querySelector(
      '#mobile-menu .register-btn[href="/register"]'
    ) as HTMLAnchorElement | null;
    expect(mobileLink?.textContent).toContain('إنشاء حساب');
  });
});
