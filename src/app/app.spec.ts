import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
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

  it('should keep the navbar and hero language in sync', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector<HTMLButtonElement>('button[aria-label="تغيير اللغة"]')?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('header')?.getAttribute('lang')).toBe('en');
    expect(compiled.querySelector('#home')?.getAttribute('lang')).toBe('en');
    expect(compiled.querySelector('h1')?.textContent).toContain('Your Compass to Understanding ADHD');
  });
});
