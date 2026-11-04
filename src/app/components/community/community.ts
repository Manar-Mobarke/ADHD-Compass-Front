import { Component, inject, computed} from '@angular/core';
import { Language } from '../../services/language';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [],
  templateUrl: './community.html',
  styleUrl: './community.css',
})
export class Community {
  languageService = inject(Language);

  currentLang = this.languageService.currentLang;
  direction = this.languageService.direction;

  content = computed(() => {
    const translations = {
      ar: {
        badge: 'مجتمع مجاني للدعم وتبادل الخبرات',
        title: 'مش لازم تخوض الرحلة لوحدك',
        description: 'انضم لمجتمع داعم يضم أشخاصًا وأهالي بيشاركوا تجاربهم، ويتبادلوا الخبرات والدعم في مساحة قائمة على الاحترام والتفهّم.',

        benefits: [
          'مساحة آمنة ومجانية بالكامل تجمع أولياء الأمور والبالغين ذوي التجارب المشابهة.',
          'جلسات حوار ومشاركة دورية ميسّرة بدون وصمة أو أحكام مسبقة.',
          'إشراف مجتمعي واعٍ يحافظ على الخصوصية ومبادئ الاحترام المتبادل.'
        ],

        noteTitle: 'ملاحظة هامة:',
        note: 'مجتمع الدعم مساحة لتبادل التجارب الإنسانية ولا يغني عن التوجيه الطبي أو الاستشارة المهنية المتخصصة.',

        button: 'انضم للمجتمع مجانًا',
        imageAlt: 'مجتمع داعم للأسر والبالغين'
      },

      en: {
        badge: 'A Free Community for Support & Shared Experiences',
        title: 'You Don’t Have to Navigate This Journey Alone',
        description: 'Join a supportive community of individuals and families who share their experiences, exchange knowledge, and offer encouragement in a space built on respect and understanding.',

        benefits: [
          'A completely free and safe space bringing together parents and adults with similar experiences.',
          'Regular facilitated discussions and sharing sessions without stigma or judgment.',
          'Thoughtful community moderation that protects privacy and promotes mutual respect.'
        ],

        noteTitle: 'Important Note:',
        note: 'The support community is a space for sharing personal experiences. It does not replace medical guidance or professional consultation.',

        button: 'Join the Community for Free',
        imageAlt: 'A supportive community for families and adults'
      }
    };

    return translations[this.currentLang()];
  });
}
