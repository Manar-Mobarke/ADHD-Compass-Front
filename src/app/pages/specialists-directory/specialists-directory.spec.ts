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
});
