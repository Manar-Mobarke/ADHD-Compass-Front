import { Component, inject, computed } from '@angular/core';
import { Language, LanguageCode } from '../../services/language';

@Component({
  selector: 'app-audience',
  standalone: true,
  imports: [],
  templateUrl: './audience.html',
  styleUrl: './audience.css',
})
export class Audience {
  languageService = inject(Language);

  currentLang = this.languageService.currentLang;
  direction = this.languageService.direction;

  content = computed(() => {
    const translations = {
      ar: {
        badge: 'مسارات مخصصة',
        title: 'المنصة معمولة عشان تساعدك في رحلتك، أيًا كانت بدايتها',
        description: 'سواء كنت تبحث عن توجيه لطفلك أو تسعى لفهم تجاربك الشخصية كبالغ، صممنا مسارات واضحة تدعمك خطوة بخطوة.',

        familyLabel: 'للأسر وأولياء الأمور',
        familyTitle: 'افهم احتياجات طفلك، واكتشف الدعم المناسب',
        familyDescription: 'افهم احتياجات طفلك، واكتشف المعلومات والمتخصصين اللي يساعدوكم في رحلتكم، من التقييم المبدئي حتى توجيه المدرسة والمنزل.',
        familyButton: 'اكتشف الدعم لطفلك',
        familyImageAlt: 'أم وطفلها في لحظة دعم حانية',

        adultLabel: 'للبالغين والشباب',
        adultTitle: 'افهم نفسك بشكل أفضل، واكتشف مسارك',
        adultDescription: 'افهم نفسك بشكل أفضل، واكتشف مصادر موثوقة ودعم يناسب احتياجاتك في العمل، الدراسة، وإدارة الوظائف التنفيذية اليومية.',
        adultButton: 'ابدأ رحلتك',
        adultImageAlt: 'شاب بالغ ينظم مهامه اليومية بهدوء وتركيز'
      },

      en: {
        badge: 'Personalized Pathways',
        title: 'A platform designed to support you, wherever your journey begins',
        description: 'Whether you are looking for guidance for your child or trying to better understand your own experiences as an adult, we have designed clear pathways to support you every step of the way.',

        familyLabel: 'Families & Parents',
        familyTitle: 'Understand your child’s needs and discover the right support',
        familyDescription: 'Explore helpful information and trusted specialists who can support your family, from initial assessment to guidance at school and home.',
        familyButton: 'Explore Support for Your Child',
        familyImageAlt: 'A mother sharing a caring moment with her child',

        adultLabel: 'Adults & Young People',
        adultTitle: 'Understand yourself better and discover your path',
        adultDescription: 'Find reliable resources and support tailored to your needs at work, in education, and in managing everyday executive functioning challenges.',
        adultButton: 'Start Your Journey',
        adultImageAlt: 'A young adult calmly organizing daily tasks'
      }
    };

    return translations[this.currentLang()];
  });
}
