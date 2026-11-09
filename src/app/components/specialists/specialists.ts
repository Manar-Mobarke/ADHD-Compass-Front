
import { Component, computed, inject } from '@angular/core';
import { Language } from '../../services/language';

@Component({
  selector: 'app-specialists',
  standalone: true,
  imports: [],
  templateUrl: './specialists.html',
  styleUrl: './specialists.css'
})
export class Specialists {
  languageService = inject(Language);

  currentLang = this.languageService.currentLang;
  direction = this.languageService.direction;

  /**
   * محتوى قسم المتخصصين ثابت بالعربية فقط في النسخة الحالية.
   */
  content = computed(() => {
    const translations = {
      ar: {
        badge: 'انضم لشبكة الخبراء',
        title: 'هل أنت متخصص في ADHD؟',
        description:
          'انضم إلى ADHD Compass وساهم في مساعدة الأفراد والأسر على الوصول إلى رعاية ومعلومات موثوقة في بيئة مهنية منظمة تحترم تخصصك.',
        benefits: [
          'وصول مباشر لأشخاص يبحثون عن خبرتك المتخصصة',
          'منصة متطورة لإدارة الجلسات والتقارير بأمان وسرية',
          'مجتمع مهني يعلي شأن المعايير العلمية'
        ],
        button: 'انضم إلينا الآن',
        imageAlt: 'متخصص في مجال الصحة النفسية داخل عيادته'
      },
      en: {
        badge: 'Join Our Network of Experts',
        title: 'Are You an ADHD Specialist?',
        description:
          'Join ADHD Compass and help individuals and families access reliable care and information in a professional, organized environment that respects your expertise.',
        benefits: [
          'Connect directly with people seeking your expertise',
          'An advanced platform for managing sessions and reports securely',
          'A professional community that values scientific standards'
        ],
        button: 'Join Us Today',
        imageAlt: 'Healthcare specialist in a professional clinic'
      }
    };

    return translations[this.currentLang()];
  });

  // Replace this with your actual specialist registration page.
  registrationUrl = '#';
}
