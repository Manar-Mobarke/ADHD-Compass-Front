import { Component, inject, computed } from '@angular/core';
import { Language } from '../../services/language';
@Component({
  selector: 'app-user-journey',
  imports: [],
  templateUrl: './user-journey.html',
  styleUrl: './user-journey.css',
})


export class UserJourney {
   languageService = inject(Language);

  currentLang = this.languageService.currentLang;
  direction = this.languageService.direction;

  /**
   * نصوص رحلة المستخدم ثابتة بالعربية لتوفير تجربة موحدة في التطبيق الحالي.
   */
  content = computed(() => {
    const translations = {
      ar: {
        badge: 'خطوات بسيطة',
        title: 'رحلتك مع ADHD Compass تبدأ من هنا',
        description: 'خطوات بسيطة ومرنة تمنحك الوضوح والدعم المناسب.',

        steps: [
          {
            number: '١',
            title: 'اكتشف وافهم',
            description: 'تعرّف على ADHD من خلال محتوى علمي ودليل إرشادي موثوق يصحح المفاهيم الشائعة.',
            color: 'navy'
          },
          {
            number: '٢',
            title: 'ابدأ بالفحص المبدئي',
            description: 'يمكنك إجراء الفحص المبدئي إذا رغبت، كأداة استكشاف ذاتي اختيارية لفهم مشاعرك وأعراضك.',
            color: 'teal'
          },
          {
            number: '٣',
            title: 'اختر المتخصص المناسب',
            description: 'استكشف ملفات المتخصصين المفصلة والموثقة وتعرف على خبراتهم لتختار الأنسب لاحتياجك.',
            color: 'navy'
          },
          {
            number: '٤',
            title: 'احجز وتابع',
            description: 'احجز جلساتك المرئية بمرونة وتابع خطة العمل وتوصيات المختص بسهولة وخصوصية تامة.',
            color: 'orange'
          }
        ]
      },

      en: {
        badge: 'Simple Steps',
        title: 'Your ADHD Compass Journey Starts Here',
        description: 'Simple and flexible steps to help you find clarity and the right support.',

        steps: [
          {
            number: '1',
            title: 'Discover & Understand',
            description: 'Learn about ADHD through reliable scientific content and practical guidance that helps correct common misconceptions.',
            color: 'navy'
          },
          {
            number: '2',
            title: 'Try the Initial Screening',
            description: 'If you wish, complete an optional preliminary screening as a self-exploration tool to better understand your experiences and symptoms.',
            color: 'teal'
          },
          {
            number: '3',
            title: 'Choose the Right Specialist',
            description: 'Explore detailed, verified specialist profiles and learn about their experience to find the right match for your needs.',
            color: 'navy'
          },
          {
            number: '4',
            title: 'Book & Follow Up',
            description: 'Book flexible online sessions and conveniently follow your care plan and specialist recommendations with privacy.',
            color: 'orange'
          }
        ]
      }
    };

    return translations[this.currentLang()];
  });
}
