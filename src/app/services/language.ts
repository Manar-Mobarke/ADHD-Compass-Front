import { Injectable, signal, computed } from '@angular/core';

export type LanguageCode = 'ar' | 'en';

@Injectable({
  providedIn: 'root',
})


export class Language {

  currentLang = signal<LanguageCode>('ar');

  direction = computed(() =>
    this.currentLang() === 'ar' ? 'rtl' : 'ltr'
  );

  toggleLanguage(): void {
    this.currentLang.update(lang =>
      lang === 'ar' ? 'en' : 'ar'
    );
  }

  setLanguage(lang: LanguageCode): void {
    this.currentLang.set(lang);
  }

}
