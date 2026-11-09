import { Component, inject, computed } from '@angular/core';
import { Language } from '../../services/language';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.css',
})

export class Services {

  languageService = inject(Language);

  currentLang = this.languageService.currentLang;
  direction = this.languageService.direction;

  /**
   * نصوص الخدمات ثابتة بالعربية لأن التطبيق لا يدعم حاليًا إلا اللغة العربية.
   */
  content = computed(() => {
    const translations = {
      ar: {
        badge: 'خدمات المنصة',
        title: 'كل ما تحتاجه في مكان واحد',
        description: 'منظومة متكاملة توفر لك المساندة الطبية والتثقيفية دون تعقيد.',

        services: [
          {
            icon: 'videocam',
            title: 'الجلسات أونلاين',
            description: 'استشارات مرنة وعالية الخصوصية مع المتخصصين عبر مكالمات مرئية آمنة من راحة منزلك.'
          },
          {
            icon: 'description',
            title: 'تقارير بعد الجلسات',
            description: 'ملخصات وتوصيات مهنية واضحة يمكن مشاركتها مع الأسرة أو المدرسة لتنسيق خطة الرعاية.'
          },
          {
            icon: 'menu_book',
            title: 'المقالات التثقيفية',
            description: 'محتوى توعوي عربي موثوق يشرح السلوكيات والاحتياجات اليومية بأسلوب علمي وإنساني.'
          },
          {
            icon: 'science',
            title: 'الأبحاث العلمية',
            description: 'إضاءات ملخصة لأحدث الدراسات والأدلة السريرية المعتمدة بعيداً عن المبالغات والشائعات.'
          }
        ]
      },

      en: {
        badge: 'Platform Services',
        title: 'Everything You Need in One Place',
        description: 'An integrated platform providing medical guidance and educational support, made simple.',

        services: [
          {
            icon: 'videocam',
            title: 'Online Sessions',
            description: 'Flexible and private consultations with specialists through secure video calls from the comfort of your home.'
          },
          {
            icon: 'description',
            title: 'Post-Session Reports',
            description: 'Clear professional summaries and recommendations that can be shared with families or schools to coordinate care.'
          },
          {
            icon: 'menu_book',
            title: 'Educational Articles',
            description: 'Reliable Arabic educational content explaining behaviors and everyday needs through a scientific and compassionate approach.'
          },
          {
            icon: 'science',
            title: 'Scientific Research',
            description: 'Easy-to-understand summaries of recent studies and trusted clinical evidence, free from exaggeration and misinformation.'
          }
        ]
      }
    };

    return translations[this.currentLang()];
  });
}
