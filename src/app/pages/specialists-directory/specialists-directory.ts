
import { Component, computed, signal } from '@angular/core';

interface Specialist {
  id: number;
  name: string;
  title: string;
  initials: string;
  experience: number;
  category: string;
  specialty: string;
  description: string;
  price: number;
  duration: number;
}

@Component({
  selector: 'app-specialists-directory',
  standalone: true,
  imports: [],
  templateUrl: './specialists-directory.html',
  styleUrl: './specialists-directory.css'
})
export class SpecialistsDirectoryComponent {
  searchTerm = signal('');
  selectedCategory = signal('all');
  selectedPrice = signal('all');

  categories = [
    { value: 'all', label: 'كل الفئات' },
    { value: 'adults', label: 'البالغين' },
    { value: 'children', label: 'الأطفال والأهالي' },
    { value: 'family', label: 'الإرشاد الأسري' }
  ];

  specialists: Specialist[] = [
    {
      id: 1,
      name: 'أ. سارة هاشم',
      title: 'أخصائية نفسية إكلينيكية',
      initials: 'س هـ',
      experience: 8,
      category: 'children',
      specialty: 'الإرشاد الأسري',
      description: 'خبرة في التعامل مع التحديات الدراسية والسلوكية وتنظيم التعامل مع الأطفال.',
      price: 300,
      duration: 45
    },
    {
      id: 2,
      name: 'أ. أحمد منصور',
      title: 'أخصائي نفسي',
      initials: 'أ م',
      experience: 12,
      category: 'adults',
      specialty: 'الوظائف التنفيذية',
      description: 'مهتم بدعم البالغين في فهم تحديات التركيز وتنظيم الحياة والعمل.',
      price: 400,
      duration: 45
    },
    {
      id: 3,
      name: 'أ. ليلى عبد الرحمن',
      title: 'أخصائية نفسية وتربوية',
      initials: 'ل ع',
      experience: 10,
      category: 'family',
      specialty: 'الإرشاد الأسري',
      description: 'تعمل مع أولياء الأمور على تطوير مهارات التواصل ودعم احتياجات الأبناء.',
      price: 350,
      duration: 45
    },
    {
      id: 4,
      name: 'أ. ندى علي',
      title: 'أخصائية نفسية',
      initials: 'ن ع',
      experience: 6,
      category: 'adults',
      specialty: 'إدارة الضغوط',
      description: 'جلسات توجيه ومساندة نفسية للبالغين مع التركيز على التحديات اليومية.',
      price: 300,
      duration: 45
    },
    {
      id: 5,
      name: 'أ. يوسف سالم',
      title: 'أخصائي نفسي',
      initials: 'ي س',
      experience: 9,
      category: 'children',
      specialty: 'الدعم الدراسي',
      description: 'يركز على الدعم النفسي المناسب للمراهقين والتحديات في البيئة التعليمية.',
      price: 350,
      duration: 45
    },
    {
      id: 6,
      name: 'أ. مريم عادل',
      title: 'أخصائية نفسية',
      initials: 'م ع',
      experience: 7,
      category: 'family',
      specialty: 'الإرشاد الأسري',
      description: 'تساعد الأسر على وضع خطوات واضحة لتحسين التواصل وتقليل الضغط اليومي.',
      price: 300,
      duration: 45
    }
  ];

  filteredSpecialists = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();
    const price = this.selectedPrice();

    return this.specialists.filter(specialist => {
      const matchesSearch =
        specialist.name.toLowerCase().includes(term) ||
        specialist.title.toLowerCase().includes(term) ||
        specialist.specialty.toLowerCase().includes(term);

      const matchesCategory =
        category === 'all' || specialist.category === category;

      const matchesPrice =
        price === 'all' || specialist.price <= Number(price);

      return matchesSearch && matchesCategory && matchesPrice;
    });
  });

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('all');
    this.selectedPrice.set('all');
  }
}
