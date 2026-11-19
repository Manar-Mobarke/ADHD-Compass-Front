import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialistsDirectoryComponent } from './specialists-directory';

describe('SpecialistsDirectory', () => {
  let component: SpecialistsDirectoryComponent;
  let fixture: ComponentFixture<SpecialistsDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialistsDirectoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialistsDirectoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters specialists by category and price', () => {
    component.selectedCategory.set('adults');
    component.selectedPrice.set('300');

    expect(component.filteredSpecialists().length).toBe(1);
    expect(component.filteredSpecialists()[0].name).toContain('ندى');
  });

  it('clears every active filter', () => {
    component.searchTerm.set('يوسف');
    component.selectedCategory.set('children');
    component.selectedPrice.set('350');

    component.clearFilters();

    expect(component.searchTerm()).toBe('');
    expect(component.selectedCategory()).toBe('all');
    expect(component.selectedPrice()).toBe('all');
  });

  it('opens and closes the specialist dialogs', () => {
    const specialist = component.specialists[0];

    component.openProfile(specialist);
    expect(component.dialogMode()).toBe('profile');
    expect(component.selectedSpecialist()).toBe(specialist);

    component.closeDialog();
    expect(component.dialogMode()).toBeNull();
    expect(component.selectedSpecialist()).toBeNull();
  });
});
