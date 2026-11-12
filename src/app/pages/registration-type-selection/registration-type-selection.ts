import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type RegistrationType = 'self' | 'parent' | 'specialist';

@Component({
  selector: 'app-registration-type-selection',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './registration-type-selection.html',
  styleUrl: './registration-type-selection.css'
})
export class RegistrationTypeSelectionComponent {
  selectedType: RegistrationType | null = null;

  selectType(type: RegistrationType): void {
    this.selectedType = type;
  }
}
