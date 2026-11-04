
import { Component, computed, inject } from '@angular/core';
import { Language } from '../../services/language';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer{
  languageService = inject(Language);

  currentLang = this.languageService.currentLang;
  direction = this.languageService.direction;

  currentYear = new Date().getFullYear();

  content = computed(() => {
    const translations = {
      ar: {
        brandDescription:
          'بوصلتك لفهم اضطراب فرط الحركة وتشتت الانتباه والوصول إلى الرعاية المتخصصة والدعم المعرفي الموثوق في مصر والمنطقة.',

        quickLinksTitle: 'روابط سريعة',
        quickLinks: [
          { label: 'الرئيسية', url: '#home' },
          { label: 'المتخصصون', url: '#for-specialists' },
          { label: 'المحتوى العلمي', url: '#articles' },
          { label: 'المجتمع الداعم', url: '#community' },
          { label: 'الإشراف المهني', url: '#oversight' }
        ],

        accountTitle: 'الحساب والخدمات',
        accountLinks: [
          { label: 'تسجيل الدخول', url: '#' },
          { label: 'إنشاء حساب', url: '#' },
          { label: 'انضم كمتخصص', url: '#for-specialists' },
          { label: 'الفحص المبدئي', url: '#screening' }
        ],

        legalTitle: 'قانوني وتواصل',
        legalLinks: [
          { label: 'سياسة الخصوصية', url: '#' },
          { label: 'الشروط والأحكام', url: '#' },
          { label: 'تواصل معنا', url: '#contact' }
        ],

        medicalTitle: 'تنبيه طبي:',
        medicalDisclaimer:
          'المحتوى المنشور على المنصة لأغراض التوعية والتثقيف، ولا يُعد بديلًا عن الاستشارة أو التقييم الطبي المتخصص.',

        copyright: 'جميع الحقوق محفوظة',
        platformDescription:
          'منصة استرشادية وتواصل مهني موثوق.',
        tagline: 'نحو فهم أفضل ودعم أكثر وعيًا.'
      },

      en: {
        brandDescription:
          'Your compass to understanding Attention Deficit Hyperactivity Disorder (ADHD) and accessing specialized care and reliable knowledge-based support in Egypt and the region.',

        quickLinksTitle: 'Quick Links',
        quickLinks: [
          { label: 'Home', url: '#home' },
          { label: 'Specialists', url: '#for-specialists' },
          { label: 'Scientific Content', url: '#articles' },
          { label: 'Support Community', url: '#community' },
          { label: 'Professional Oversight', url: '#oversight' }
        ],

        accountTitle: 'Account & Services',
        accountLinks: [
          { label: 'Log In', url: '#' },
          { label: 'Create Account', url: '#' },
          { label: 'Join as a Specialist', url: '#for-specialists' },
          { label: 'Initial Screening', url: '#screening' }
        ],

        legalTitle: 'Legal & Contact',
        legalLinks: [
          { label: 'Privacy Policy', url: '#' },
          { label: 'Terms & Conditions', url: '#' },
          { label: 'Contact Us', url: '#contact' }
        ],

        medicalTitle: 'Medical Disclaimer:',
        medicalDisclaimer:
          'All content published on this platform is for educational and awareness purposes only. It is not a substitute for professional medical consultation or assessment.',

        copyright: 'All Rights Reserved',
        platformDescription:
          'An educational and professional connection platform.',
        tagline: 'Better understanding. More informed support.'
      }
    };

    return translations[this.currentLang()];
  });
}
