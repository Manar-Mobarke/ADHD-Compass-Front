import { Component, computed, inject, signal } from '@angular/core';
import { Language, LanguageCode } from '../../services/language';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly language = inject(Language);
  currentLang = this.language.currentLang;
  direction = this.language.direction;

  isMenuOpen = signal(false);

  /**
   * التعليقات النصية الخاصة بالشريط العلوي ثابتة باللغة العربية.
   * تم إلغاء خيار تبديل اللغة لأن التطبيق يعمل حاليًا فقط على العربية.
   */
  private readonly translations = {
    ar: {
      brand: 'ADHD Compass',
      tagline: 'البوصلة',
      mainNavigation: 'التنقل الرئيسي',
      mobileNavigation: 'التنقل على الهاتف',
      home: 'الرئيسية',
      specialists: 'المتخصصون',
      articles: 'المحتوى العلمي',
      community: 'المجتمع',
      about: 'عن المنصة',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      openMenu: 'فتح القائمة',
      closeMenu: 'إغلاق القائمة',
    },
    en: {
      brand: 'ADHD Compass',
      tagline: 'Your compass to understanding ADHD',
      mainNavigation: 'Main navigation',
      mobileNavigation: 'Mobile navigation',
      home: 'Home',
      specialists: 'Specialists',
      articles: 'Scientific Content',
      community: 'Community',
      about: 'About Us',
      login: 'Login',
      register: 'Register',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
  } satisfies Record<LanguageCode, {
    brand: string;
    tagline: string;
    mainNavigation: string;
    mobileNavigation: string;
    home: string;
    specialists: string;
    articles: string;
    community: string;
    about: string;
    login: string;
    register: string;
    openMenu: string;
    closeMenu: string;
  }>;

  t = computed(() => this.translations[this.currentLang()]);

  toggleMenu(): void {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
