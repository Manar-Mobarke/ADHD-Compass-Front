import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('بوصلتك لفهم ADHD');
    expect(compiled.querySelectorAll('app-navbar')).toHaveLength(1);
  });

  it('should keep the app in Arabic and without a language toggle', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('header')?.getAttribute('lang')).toBe('ar');
    expect(compiled.querySelector('#home')?.getAttribute('lang')).toBe('ar');
    expect(compiled.querySelector('button[aria-label="تغيير اللغة"]')).toBeNull();
    expect(compiled.querySelector('h1')?.textContent).toContain('بوصلتك لفهم ADHD');
  });

  it('should keep one shared navbar throughout registration', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    fixture.detectChanges();

    for (const path of ['/register', '/self-register', '/parent-register', '/specialist-register']) {
      await router.navigateByUrl(path);
      await fixture.whenStable();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll('app-navbar')).toHaveLength(1);
    }
  });
});
