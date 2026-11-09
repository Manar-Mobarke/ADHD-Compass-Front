import { Injectable, signal, computed } from '@angular/core';

export type LanguageCode = 'ar' | 'en';

@Injectable({
  providedIn: 'root',
})
export class Language {
  /**
   * اللغة الحالية للنظام؛ تم تثبيت التطبيق على النسخة العربية فقط.
   * هذا يجعل جميع النصوص والواجهات تظهر بتنسيق عربي بشكل افتراضي.
   */
  currentLang = signal<LanguageCode>('ar');

  /**
   * اتجاه النص ثابت إلى اليمين (RTL) لأن النسخة الحالية موجهة للعربية فقط.
   */
  direction = computed(() => 'rtl');

  /**
   * يحتفظ التطبيق بتكوينه العربية حتى لو تم تمرير قيمة أخرى في المستقبل.
   */
  setLanguage(_lang: LanguageCode): void {
    this.currentLang.set('ar');
  }
}

