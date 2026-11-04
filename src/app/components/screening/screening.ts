import { Component, inject, computed } from '@angular/core';
import { Language } from '../../services/language';

@Component({
  selector: 'app-screening',
  standalone: true,
  imports: [],
  templateUrl: './screening.html',
  styleUrl: './screening.css',
})
export class Screening {
  languageService = inject(Language);

  currentLang = this.languageService.currentLang;
  direction = this.languageService.direction;

  content = computed(() => {
    const translations = {
      ar: {
        badge: 'استكشاف ذاتي واسترشادي',
        title: 'ابدأ بخطوة أولى لفهم حالتك',
        description: 'يساعدك الفحص المبدئي على استكشاف بعض المؤشرات المرتبطة بـ ADHD والتعرف على الخطوات التالية.',

        disclaimerTitle: 'تنويه هام:',
        disclaimer: 'الفحص المبدئي ليس تشخيصًا طبيًا، ولا يغني عن التقييم لدى متخصص مؤهل. هو أداة استرشادية لمساعدتك في فهم تجربتك والتحضير لمناقشتها مع مختص.',

        optional: '* الفحص اختياري تماماً ولا يشترط إتمامه للتواصل مع الأطباء.',
        button: 'ابدأ الفحص المبدئي',

        cardTitle: 'استبيان مقنن ومبسط',
        cardDescription: 'أسئلة تركز على جوانب التركيز، الحركة، والوظائف التنفيذية في الحياة اليومية.',
        duration: 'يستغرق ٥ دقائق فقط'
      },

      en: {
        badge: 'Self-Exploration & Guidance',
        title: 'Take the First Step Toward Understanding Yourself',
        description: 'A preliminary screening can help you explore certain indicators associated with ADHD and understand possible next steps.',

        disclaimerTitle: 'Important Disclaimer:',
        disclaimer: 'This preliminary screening is not a medical diagnosis and does not replace an assessment by a qualified professional. It is a guidance tool to help you understand your experiences and prepare to discuss them with a specialist.',

        optional: '* Screening is completely optional and is not required to contact specialists.',
        button: 'Start Preliminary Screening',

        cardTitle: 'Simple, Structured Questionnaire',
        cardDescription: 'Questions focusing on attention, activity levels, and executive functioning in everyday life.',
        duration: 'Takes only 5 minutes'
      }
    };

    return translations[this.currentLang()];
  });
}
