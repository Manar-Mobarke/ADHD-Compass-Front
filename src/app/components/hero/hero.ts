import { Component, inject, computed} from '@angular/core';
import { Language } from '../../services/language';


@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})

export class Hero {
  languageService = inject(Language);

  currentLang = this.languageService.currentLang;
  direction = this.languageService.direction;

  /**
   * النصوص الرئيسية للصفحة الأولية ثابتة بالعربية لأن التطبيق يعمل حاليًا فقط بالنسخة العربية.
   */
  content = computed(() => {

    const translations = {
      ar: {
        titleLine1: 'بوصلتك لفهم ADHD',
        titleLine2: 'والوصول للدعم المناسب',

        description:
          'اكتشف متخصصين موثوقين، ومعلومات علمية، وخدمات تساعدك أنت وأسرتك في رحلتكم مع ADHD.',

        specialists: 'تصفح المتخصصين',
        articles: 'استكشف المحتوى العلمي',

        imageAlt: 'رسم لبوصلة داخل دماغ يرمز إلى التوجيه والدعم لاضطراب ADHD'
      },

      en: {
        titleLine1: 'Your Compass to Understanding ADHD',
        titleLine2: 'and Finding the Right Support',

        description:
          'Discover trusted specialists, scientific information, and services that support you and your family throughout your ADHD journey.',

        specialists: 'Explore Specialists',
        articles: 'Explore Scientific Content',

        imageAlt: 'A compass within a brain representing guidance and ADHD support'
      }
    };

    return translations[this.currentLang()];
  });

}
