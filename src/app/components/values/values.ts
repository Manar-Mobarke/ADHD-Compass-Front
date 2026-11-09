import { Component, inject, computed } from '@angular/core';
import { Language } from '../../services/language';

@Component({
  selector: 'app-values',
  standalone: true,
  imports: [],
  templateUrl: './values.html',
  styleUrl: './values.css',
})


export class Values {
  languageService = inject(Language);

  currentLang = this.languageService.currentLang;
  direction = this.languageService.direction;

  /**
   * نصوص القيم والرسالة الأساسية مذكورة بالعربية لتوحيد هوية المنصة.
   */
  content = computed(() => {
    const translations = {
      ar: {
        badge: 'قيمنا ورسالتنا',
        title: 'ليه ADHD Compass؟',
        description: 'صُممت المنصة لتكون رفيقاً إنسانياً وأميناً في بيئة خالية من التسميات المسبقة.',

        pillars: [
          {
            icon: 'verified',
            title: 'متخصصون بعد التحقق',
            description: 'التحقق من مؤهلات وشهادات وتراخيص الممارسين لضمان معايير الأمان المهني والطبي.'
          },
          {
            icon: 'menu_book',
            title: 'محتوى علمي موثوق',
            description: 'معلومات وأبحاث محكمة تساعدك على فهم أعمق واتخاذ قرارات واعية دون خرافات أو مبالغات شائعة.'
          },
          {
            icon: 'spa',
            title: 'الوصول الأسهل للخدمات',
            description: 'خدمات ومعلومات منظمة في واجهة ميسرة توفر الوقت والجهد وتراعي حساسية التجربة الإنسانية لكل فرد.'
          }
        ]
      },

      en: {
        badge: 'Our Values & Mission',
        title: 'Why ADHD Compass?',
        description: 'Our platform is designed to be a trustworthy and compassionate companion in a space free from labels and assumptions.',

        pillars: [
          {
            icon: 'verified',
            title: 'Verified Specialists',
            description: 'Verification of practitioners’ qualifications, certificates, and licenses to support professional and medical safety standards.'
          },
          {
            icon: 'menu_book',
            title: 'Reliable Scientific Content',
            description: 'Evidence-based information and research that help you gain a deeper understanding and make informed decisions without myths or exaggeration.'
          },
          {
            icon: 'spa',
            title: 'Easier Access to Services',
            description: 'Organized services and information through an accessible interface that saves time and respects each individual’s personal experience.'
          }
        ]
      }
    };

    return translations[this.currentLang()];
  });
}
