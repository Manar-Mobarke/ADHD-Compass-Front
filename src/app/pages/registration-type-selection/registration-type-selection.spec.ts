import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { RegistrationTypeSelectionComponent } from './registration-type-selection';

describe('RegistrationTypeSelectionComponent', () => {
  let component: RegistrationTypeSelectionComponent;
  let fixture: ComponentFixture<RegistrationTypeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationTypeSelectionComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationTypeSelectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should offer the three registration types', () => {
    const options = fixture.nativeElement.querySelectorAll('.type-option') as NodeListOf<HTMLButtonElement>;

    expect(options).toHaveLength(3);
    expect(fixture.nativeElement.querySelector('.selection-header')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('أسجل لنفسي');
    expect(fixture.nativeElement.textContent).toContain('أسجل كولي أمر');
    expect(fixture.nativeElement.textContent).toContain('أسجل كمتخصص');
  });

  it('should provide the existing specialist registration route when specialists are selected', () => {
    component.selectType('specialist');
    fixture.detectChanges();

    const continueLink = fixture.nativeElement.querySelector(
      '.continue-button'
    ) as HTMLAnchorElement | null;

    expect(continueLink?.getAttribute('href')).toBe('/specialist-register');
  });

  it('should direct self and parent selections to their registration forms', () => {
    component.selectType('self');
    fixture.detectChanges();

    expect(
      (fixture.nativeElement.querySelector('.continue-button') as HTMLAnchorElement).getAttribute('href')
    ).toBe('/self-register');

    component.selectType('parent');
    fixture.detectChanges();

    expect(
      (fixture.nativeElement.querySelector('.continue-button') as HTMLAnchorElement).getAttribute('href')
    ).toBe('/parent-register');
  });
});
