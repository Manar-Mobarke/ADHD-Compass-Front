import { Component, computed, inject } from '@angular/core';
import { Language } from '../../services/language';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [],
  templateUrl: './articles.html',
  styleUrl: './articles.css'
})
export class Articles{
  languageService = inject(Language);

  currentLang = this.languageService.currentLang;
  direction = this.languageService.direction;

  /**
   * نصوص المحتوى العلمي موجهة للعربية فقط لأن هذا الإصدار يعمل على لغة واحدة.
   */
  content = computed(() => {
    const translations = {
      ar: {
        badge: 'المقالات والأبحاث',
        title: 'المعرفة بتفرق في رحلتك',
        description:
          'محتوى مكتوب ومراجع بعناية لمساعدة الأسر والبالغين على التعامل الإيجابي والواعي.',
        readMore: 'اقرأ المزيد',
        viewAll: 'اكتشف كل المقالات والأبحاث',
        articles: [
          {
            category: 'أولياء الأمور والأطفال',
            readTime: '٥ دقائق قراءة',
            title:
              'كيف تتحدث مع طفلك عن طبيعة تشتت الانتباه بأسلوب إيجابي ومعزز للثقة؟',
            description:
              'طرق عملية لبناء الحوار الإيجابي وتجاوز مشاعر الإحباط المدرسية بدعم من بيئة المنزل الهادئة.',
            image:
              'https://lh3.googleusercontent.com/aida/AEtjO1UeSTTFKI_6Ql-4nus10eV0o-Kj_17rMaKm9tQvNgqDFuBKx-cwDeiV0_c_GhbIR4P1CXUuvxF0WImQlbNKtM7If13g5PUTm26aizZPJX3962OBtDDmz-gN4whmBs541C6zwlkOYCTZ1CzGDSfSb0lgRyfmjjI33XY7hKYVT2nPyOLqzF0d0cEWD9UwDRJVntUDcxeSlGR1GoEvYOXEtPPMjsUXB-lgzebSIWpnVFoGlg',
            alt: 'كيف تتحدث مع طفلك عن طبيعة تشتت الانتباه'
          },
          {
            category: 'البالغين وإدارة الحياة',
            readTime: '٧ دقائق قراءة',
            title:
              'إدارة المهام والوظائف التنفيذية في بيئة العمل: استراتيجيات عملية بدون إجهاد',
            description:
              'أدوات ملموسة لمساعدة البالغين على التعامل مع المماطلة وتشتت التركيز باستخدام تقنيات تنظيم الوقت المرنة.',
            image:
              'https://lh3.googleusercontent.com/aida/AEtjO1UPLjb-YI68Z998ZuASKJrL-RIDpebbZ1RS85g8Ck3GEruC4K2mlHKLphNn8kGqGgRa6t0MK3hr0ydUp3w3FO5pk1n3FdrOg5bcCZSE_YjYT1_2T4tFAxwPqUZMk-XlipzJLRLhVkXgly1dBevUC5r3bIlKRgBrD8P5ABcBP9yrYndhOUyl1sj7JRbBN65YfSoscrDaLJnhSELdlvMUWzQK_5WdETIklIDJNRARdrwuDA',
            alt: 'إدارة المهام والوظائف التنفيذية في بيئة العمل'
          },
          {
            category: 'أبحاث وطب نمائي',
            readTime: '٦ دقائق قراءة',
            title:
              'مفاهيم خاطئة وشائعة حول ADHD بين العلم والتجارب الحياتية',
            description:
              'نظرة موضوعية على الأدلة العلمية الحديثة لتصحيح النظرة المجتمعية المغلوطة وتعزيز الوعي الصحي الصحيح.',
            image:
              'https://lh3.googleusercontent.com/aida/AEtjO1Xb7YPzH9rSXEr25cYaNRB52PT6Mb6NBJdv3bIUlKHZJNPXx1PUYDK8YkSlgiYK_cYueAPymQz5JvSd7Gkeh2VPLyoI2psyCnv19IfSsq0N-SEtGoj75ybwWJLhBzABSw1j1FlFg_v75jiC9CqQ4e0O1tDZxV8u8zfu3IN08yp7mpeRPZNvQqZfy-3KJWyTMAdzd2XDQvY6Cu-AbW9MsvR-HG_zJZ4PqGYvquFFMR0wvQ',
            alt: 'مفاهيم خاطئة وشائعة حول ADHD'
          }
        ]
      },
      en: {
        badge: 'Articles & Research',
        title: 'Knowledge makes a difference in your journey',
        description:
          'Carefully written and reviewed content to help families and adults navigate ADHD with awareness and confidence.',
        readMore: 'Read More',
        viewAll: 'Explore All Articles & Research',
        articles: [
          {
            category: 'Parents & Children',
            readTime: '5 min read',
            title:
              'How to Talk to Your Child About ADHD in a Positive and Confidence-Building Way',
            description:
              'Practical ways to build positive conversations and overcome school-related frustration through a supportive home environment.',
            image:
              'https://lh3.googleusercontent.com/aida/AEtjO1UeSTTFKI_6Ql-4nus10eV0o-Kj_17rMaKm9tQvNgqDFuBKx-cwDeiV0_c_GhbIR4P1CXUuvxF0WImQlbNKtM7If13g5PUTm26aizZPJX3962OBtDDmz-gN4whmBs541C6zwlkOYCTZ1CzGDSfSb0lgRyfmjjI33XY7hKYVT2nPyOLqzF0d0cEWD9UwDRJVntUDcxeSlGR1GoEvYOXEtPPMjsUXB-lgzebSIWpnVFoGlg',
            alt: 'Talking to your child about ADHD'
          },
          {
            category: 'Adults & Daily Life',
            readTime: '7 min read',
            title:
              'Managing Tasks and Executive Functions at Work: Practical Strategies Without Burnout',
            description:
              'Practical tools to help adults manage procrastination and focus challenges using flexible time-management techniques.',
            image:
              'https://lh3.googleusercontent.com/aida/AEtjO1UPLjb-YI68Z998ZuASKJrL-RIDpebbZ1RS85g8Ck3GEruC4K2mlHKLphNn8kGqGgRa6t0MK3hr0ydUp3w3FO5pk1n3FdrOg5bcCZSE_YjYT1_2T4tFAxwPqUZMk-XlipzJLRLhVkXgly1dBevUC5r3bIlKRgBrD8P5ABcBP9yrYndhOUyl1sj7JRbBN65YfSoscrDaLJnhSELdlvMUWzQK_5WdETIklIDJNRARdrwuDA',
            alt: 'Managing executive functions at work'
          },
          {
            category: 'Research & Development',
            readTime: '6 min read',
            title:
              'Common Misconceptions About ADHD: Science vs. Everyday Experiences',
            description:
              'An objective look at recent scientific evidence to challenge misconceptions and promote accurate health awareness.',
            image:
              'https://lh3.googleusercontent.com/aida/AEtjO1Xb7YPzH9rSXEr25cYaNRB52PT6Mb6NBJdv3bIUlKHZJNPXx1PUYDK8YkSlgiYK_cYueAPymQz5JvSd7Gkeh2VPLyoI2psyCnv19IfSsq0N-SEtGoj75ybwWJLhBzABSw1j1FlFg_v75jiC9CqQ4e0O1tDZxV8u8zfu3IN08yp7mpeRPZNvQqZfy-3KJWyTMAdzd2XDQvY6Cu-AbW9MsvR-HG_zJZ4PqGYvquFFMR0wvQ',
            alt: 'Common misconceptions about ADHD'
          }
        ]
      }
    };

    return translations[this.currentLang()];
  });
}
