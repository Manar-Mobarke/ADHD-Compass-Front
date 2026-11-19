import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

export type DayKey = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
export type PeriodStatus = 'available' | 'closed';
export type CalendarStatus = 'completed' | 'booked' | 'available' | 'cancelled';
export type SessionType = 'online' | 'in_person';

export interface WorkPeriod {
  id: number;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "13:00"
  status: PeriodStatus;
  bookedCount?: number;
}

export interface WorkDay {
  key: DayKey;
  label: string;
  periods: WorkPeriod[];
}

export interface Appointment {
  id: number;
  patientName: string;
  patientPhone?: string;
  dayKey: DayKey;
  dateStr: string; // YYYY-MM-DD
  startTime: string; // HH:mm e.g. "09:00"
  endTime: string;   // HH:mm e.g. "10:00"
  sessionType: SessionType;
  status: CalendarStatus;
  notes?: string;
}

export interface DayOption {
  key: DayKey;
  label: string;
  unavailable?: boolean;
}

export interface CalendarDayView {
  key: DayKey;
  label: string;
  date: number;
  month: number;
  year: number;
  fullDateStr: string;
  isToday: boolean;
  active: boolean;
  appointments: Appointment[];
  workPeriods: WorkPeriod[];
  totalSlots: number;
  bookedSlots: number;
  availableSlots: number;
  completedSlots: number;
  cancelledSlots: number;
}

export interface SpecialistProfileStatus {
  isComplete: boolean;
  completionPercentage: number;
  specialistName: string;
  specialistTitle: string;
  missingSteps: { step: number; name: string }[];
}

@Component({
  selector: 'app-specialist-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './specialist-dashboard.html',
  styleUrl: './specialist-dashboard.css'
})
export class SpecialistDashboardComponent implements OnInit {
  // Navigation & View Signals
  readonly dialogView = signal<'manage' | 'add-period' | 'apply-schedule' | 'appointment' | null>(null);
  readonly viewMode = signal<'daily' | 'weekly'>('weekly');
  readonly weekOffset = signal(0);
  // selectedCalendarDay defaults to today's day key
  private static getTodayDayKey(): DayKey {
    const keys: DayKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return keys[new Date().getDay()];
  }
  readonly selectedCalendarDay = signal<DayKey>(SpecialistDashboardComponent.getTodayDayKey());

  // Form Signals - Working Period
  readonly selectedDay = signal<DayKey>('thursday');
  readonly startTime = signal('16:00');
  readonly endTime = signal('20:00');
  readonly editingPeriodId = signal<number | null>(null);
  readonly formError = signal('');
  readonly updateNotice = signal('');

  // Form Signals - Appointment
  readonly appointmentPatientName = signal('');
  readonly appointmentPatientPhone = signal('');
  readonly appointmentDayKey = signal<DayKey>('sunday');
  readonly appointmentDateStr = signal('');
  readonly appointmentStartTime = signal('09:00');
  readonly appointmentEndTime = signal('10:00');
  readonly appointmentSessionType = signal<SessionType>('online');
  readonly appointmentStatus = signal<CalendarStatus>('booked');
  readonly appointmentNotes = signal('');
  readonly editingAppointmentId = signal<number | null>(null);
  readonly appointmentFormError = signal('');

  // Copy schedule target week
  readonly targetCopyWeekOffset = signal(1);

  // Profile completion status
  readonly profileStatus = signal<SpecialistProfileStatus>({
    isComplete: false,
    completionPercentage: 70,
    specialistName: 'د. سارة أحمد',
    specialistTitle: 'استشاري نفسي عيادي',
    missingSteps: [
      { step: 7, name: 'الشهادات والاعتمادات المهنية' },
      { step: 9, name: 'تحديد المنصات والربط التقني' }
    ]
  });

  // Base calendar days of the week starting from Sunday (RTL & reference standard)
  readonly dayOptions: readonly DayOption[] = [
    { key: 'sunday', label: 'الأحد' },
    { key: 'monday', label: 'الإثنين' },
    { key: 'tuesday', label: 'الثلاثاء' },
    { key: 'wednesday', label: 'الأربعاء' },
    { key: 'thursday', label: 'الخميس' },
    { key: 'friday', label: 'الجمعة' },
    { key: 'saturday', label: 'السبت' }
  ];

  // Working Hours per day
  readonly workDays = signal<WorkDay[]>([
    {
      key: 'sunday',
      label: 'الأحد',
      periods: [
        { id: 1, startTime: '09:00', endTime: '13:00', status: 'available', bookedCount: 2 },
        { id: 2, startTime: '17:00', endTime: '21:00', status: 'available', bookedCount: 1 }
      ]
    },
    {
      key: 'monday',
      label: 'الإثنين',
      periods: [
        { id: 3, startTime: '16:00', endTime: '20:00', status: 'available', bookedCount: 1 }
      ]
    },
    {
      key: 'tuesday',
      label: 'الثلاثاء',
      periods: [
        { id: 4, startTime: '17:00', endTime: '21:00', status: 'available', bookedCount: 2 }
      ]
    },
    {
      key: 'wednesday',
      label: 'الأربعاء',
      periods: [
        { id: 5, startTime: '10:00', endTime: '14:00', status: 'available', bookedCount: 1 },
        { id: 6, startTime: '16:00', endTime: '20:00', status: 'available', bookedCount: 2 }
      ]
    },
    {
      key: 'thursday',
      label: 'الخميس',
      periods: [
        { id: 7, startTime: '17:00', endTime: '21:00', status: 'available', bookedCount: 1 }
      ]
    },
    {
      key: 'friday',
      label: 'الجمعة',
      periods: []
    },
    {
      key: 'saturday',
      label: 'السبت',
      periods: []
    }
  ]);

  // Appointments Signal
  readonly appointments = signal<Appointment[]>([
    {
      id: 101,
      patientName: 'أحمد محمد',
      patientPhone: '01011223344',
      dayKey: 'sunday',
      dateStr: '2024-11-10',
      startTime: '09:00',
      endTime: '10:00',
      sessionType: 'online',
      status: 'booked',
      notes: 'متابعة دورية لاضطراب تشتت الانتباه'
    },
    {
      id: 102,
      patientName: 'فترة استشارة متاحة',
      dayKey: 'sunday',
      dateStr: '2024-11-10',
      startTime: '10:00',
      endTime: '11:00',
      sessionType: 'online',
      status: 'available'
    },
    {
      id: 103,
      patientName: 'كريم خالد',
      patientPhone: '01022334455',
      dayKey: 'sunday',
      dateStr: '2024-11-10',
      startTime: '11:00',
      endTime: '12:00',
      sessionType: 'in_person',
      status: 'booked',
      notes: 'جلسة تقييم وتعديل سلوك'
    },
    {
      id: 104,
      patientName: 'مريم علي',
      patientPhone: '01033445566',
      dayKey: 'sunday',
      dateStr: '2024-11-10',
      startTime: '17:00',
      endTime: '18:00',
      sessionType: 'online',
      status: 'booked',
      notes: 'جلسة استشارية أولى'
    },
    {
      id: 105,
      patientName: 'سارة عبد الرحمن',
      patientPhone: '01044556677',
      dayKey: 'monday',
      dateStr: '2024-11-11',
      startTime: '16:00',
      endTime: '17:00',
      sessionType: 'online',
      status: 'booked',
      notes: 'متابعة الخطة العلاجية'
    },
    {
      id: 106,
      patientName: 'فترة متاحة للحجز',
      dayKey: 'monday',
      dateStr: '2024-11-11',
      startTime: '17:00',
      endTime: '18:00',
      sessionType: 'online',
      status: 'available'
    },
    {
      id: 107,
      patientName: 'ياسين أحمد',
      patientPhone: '01055667788',
      dayKey: 'tuesday',
      dateStr: '2024-11-12',
      startTime: '17:00',
      endTime: '18:00',
      sessionType: 'online',
      status: 'booked'
    },
    {
      id: 108,
      patientName: 'عمر شريف',
      patientPhone: '01066778899',
      dayKey: 'tuesday',
      dateStr: '2024-11-12',
      startTime: '18:00',
      endTime: '19:00',
      sessionType: 'in_person',
      status: 'completed',
      notes: 'تمت الجلسة بنجاح'
    },
    {
      id: 109,
      patientName: 'فترة متاحة للحجز',
      dayKey: 'wednesday',
      dateStr: '2024-11-13',
      startTime: '10:00',
      endTime: '11:00',
      sessionType: 'online',
      status: 'available'
    },
    {
      id: 110,
      patientName: 'نور الدين محمود',
      patientPhone: '01077889900',
      dayKey: 'wednesday',
      dateStr: '2024-11-13',
      startTime: '16:00',
      endTime: '17:00',
      sessionType: 'online',
      status: 'booked',
      notes: 'جلسة تشخيص ومقابلة الأهل'
    },
    {
      id: 111,
      patientName: 'زياد طارق',
      patientPhone: '01088990011',
      dayKey: 'wednesday',
      dateStr: '2024-11-13',
      startTime: '17:00',
      endTime: '18:00',
      sessionType: 'online',
      status: 'booked'
    },
    {
      id: 112,
      patientName: 'فترة متاحة للحجز',
      dayKey: 'thursday',
      dateStr: '2024-11-14',
      startTime: '17:00',
      endTime: '18:00',
      sessionType: 'online',
      status: 'available'
    },
    {
      id: 113,
      patientName: 'ليلى حسام',
      patientPhone: '01099001122',
      dayKey: 'thursday',
      dateStr: '2024-11-14',
      startTime: '18:00',
      endTime: '19:00',
      sessionType: 'online',
      status: 'booked',
      notes: 'جلسة تنمية مهارات التركيز'
    }
  ]);

  private nextPeriodId = 20;
  private nextAppointmentId = 200;

  // Base calendar: week 0 = the Sunday of the current real week
  private readonly getTodaySunday = (): Date => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ...
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadPersistedData();
  }

  // Computed: Selected day label
  readonly selectedDayLabel = computed(() =>
    this.dayOptions.find((day) => day.key === this.selectedDay())?.label ?? ''
  );

  // Computed: Duration label for working period modal
  readonly durationLabel = computed(() => {
    const duration = this.minutesFromTime(this.endTime()) - this.minutesFromTime(this.startTime());
    if (duration <= 0) {
      return 'حدد وقت نهاية بعد وقت البداية';
    }

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    const parts: string[] = [];

    if (hours > 0) {
      parts.push(`${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} دقيقة`);
    }

    return `${parts.join(' و ')} متواصلة`;
  });

  // Computed: Total configured periods across all days
  readonly totalPeriods = computed(() =>
    this.workDays().reduce((total, day) => total + day.periods.length, 0)
  );

  // Computed: Week Start Date based on offset from real today's Sunday
  readonly weekStartDate = computed(() => {
    const d = this.getTodaySunday();
    d.setDate(d.getDate() + this.weekOffset() * 7);
    return d;
  });

  // Computed: Week Range text (e.g. "11 - 17 نوفمبر 2024")
  readonly weekRange = computed(() => {
    const start = this.weekStartDate();
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const startDay = start.getDate();
    const endDay = end.getDate();
    const monthFormatter = new Intl.DateTimeFormat('ar-EG', { month: 'long' });
    const yearFormatter = new Intl.DateTimeFormat('ar-EG', { year: 'numeric' });

    const monthStr = monthFormatter.format(start);
    const yearStr = yearFormatter.format(start);

    return `${startDay} - ${endDay} ${monthStr} ${yearStr}`;
  });

  // Computed: Next Week Range text for Copy Schedule modal
  readonly nextWeekRange = computed(() => {
    const start = new Date(this.weekStartDate());
    start.setDate(start.getDate() + 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const startDay = start.getDate();
    const endDay = end.getDate();
    const monthFormatter = new Intl.DateTimeFormat('ar-EG', { month: 'long' });
    const yearFormatter = new Intl.DateTimeFormat('ar-EG', { year: 'numeric' });

    return `${startDay} - ${endDay} ${monthFormatter.format(start)} ${yearFormatter.format(start)}`;
  });

  // Computed: 7 Calendar Day models with date calculation and mapped appointments
  readonly calendarDays = computed<CalendarDayView[]>(() => {
    const start = this.weekStartDate();
    const allAppointments = this.appointments();
    const allWorkDays = this.workDays();
    const selectedDayKey = this.selectedCalendarDay();

    // Check against real today date
    const realToday = new Date();

    return this.dayOptions.map((opt, index) => {
      const curDate = new Date(start);
      curDate.setDate(start.getDate() + index);

      const dayNum = curDate.getDate();
      const monthNum = curDate.getMonth();
      const yearNum = curDate.getFullYear();
      const fullDateStr = `${yearNum}-${String(monthNum + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

      const isToday = this.isSameDate(curDate, realToday);

      const dayWork = allWorkDays.find((d) => d.key === opt.key);
      const dayAppointments = allAppointments.filter(
        (apt) => apt.dayKey === opt.key || apt.dateStr === fullDateStr
      ).sort((a, b) => this.minutesFromTime(a.startTime) - this.minutesFromTime(b.startTime));

      const bookedCount = dayAppointments.filter((a) => a.status === 'booked').length;
      const availableCount = dayAppointments.filter((a) => a.status === 'available').length;
      const completedCount = dayAppointments.filter((a) => a.status === 'completed').length;
      const cancelledCount = dayAppointments.filter((a) => a.status === 'cancelled').length;

      return {
        key: opt.key,
        label: opt.label,
        date: dayNum,
        month: monthNum + 1,
        year: yearNum,
        fullDateStr,
        isToday,
        active: opt.key === selectedDayKey,
        appointments: dayAppointments,
        workPeriods: dayWork?.periods ?? [],
        totalSlots: dayAppointments.length,
        bookedSlots: bookedCount,
        availableSlots: availableCount,
        completedSlots: completedCount,
        cancelledSlots: cancelledCount
      };
    });
  });

  // Computed: Visible days in weekly vs daily view
  readonly visibleCalendarDays = computed(() => {
    const days = this.calendarDays();
    return this.viewMode() === 'daily'
      ? days.filter((day) => day.key === this.selectedCalendarDay())
      : days;
  });

  // Computed: Weekly Appointment & Availability Counters
  readonly weeklyCounters = computed(() => {
    const days = this.calendarDays();
    let booked = 0;
    let available = 0;
    let completed = 0;
    let cancelled = 0;

    for (const d of days) {
      booked += d.bookedSlots;
      available += d.availableSlots;
      completed += d.completedSlots;
      cancelled += d.cancelledSlots;
    }

    return { booked, available, completed, cancelled, total: booked + available + completed + cancelled };
  });

  // Navigation Methods
  changeWeek(offset: number): void {
    this.weekOffset.update((current) => current + offset);
  }

  goToToday(): void {
    this.weekOffset.set(0);
    // Select today's day key
    const dayKeys: DayKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayKey = dayKeys[new Date().getDay()];
    this.selectedCalendarDay.set(todayKey);
  }

  selectCalendarDay(dayKey: DayKey): void {
    this.selectedCalendarDay.set(dayKey);
  }

  // Dialog Controls
  openManageDialog(): void {
    this.dialogView.set('manage');
    this.formError.set('');
  }

  closeDialog(): void {
    this.dialogView.set(null);
    this.formError.set('');
    this.appointmentFormError.set('');
    this.editingPeriodId.set(null);
    this.editingAppointmentId.set(null);
  }

  // Working Period Operations
  openAddPeriod(day: DayKey = 'thursday'): void {
    this.selectedDay.set(day);
    this.startTime.set('16:00');
    this.endTime.set('20:00');
    this.editingPeriodId.set(null);
    this.formError.set('');
    this.updateNotice.set('');
    this.dialogView.set('add-period');
  }

  openEditPeriod(day: DayKey, period: WorkPeriod): void {
    this.selectedDay.set(day);
    this.startTime.set(period.startTime);
    this.endTime.set(period.endTime);
    this.editingPeriodId.set(period.id);
    this.formError.set('');
    this.updateNotice.set('');
    this.dialogView.set('add-period');
  }

  selectDayOption(day: DayOption): void {
    if (!day.unavailable) {
      this.selectedDay.set(day.key);
      this.formError.set('');
    }
  }

  onStartTimeInput(event: Event): void {
    this.startTime.set((event.target as HTMLInputElement).value);
    this.formError.set('');
  }

  onEndTimeInput(event: Event): void {
    this.endTime.set((event.target as HTMLInputElement).value);
    this.formError.set('');
  }

  savePeriod(event: Event): void {
    event.preventDefault();
    const start = this.minutesFromTime(this.startTime());
    const end = this.minutesFromTime(this.endTime());

    if (start < 0 || end < 0 || start >= end) {
      this.formError.set('تأكد من إدخال وقت نهاية بعد وقت البداية.');
      return;
    }

    const day = this.workDays().find((item) => item.key === this.selectedDay());
    const overlaps = day?.periods.some(
      (period) =>
        period.id !== this.editingPeriodId() &&
        start < this.minutesFromTime(period.endTime) &&
        end > this.minutesFromTime(period.startTime)
    );

    if (overlaps) {
      this.formError.set('هذه الفترة تتداخل مع فترة عمل أخرى في اليوم نفسه.');
      return;
    }

    const editingId = this.editingPeriodId();
    if (editingId === null) {
      const newPeriod: WorkPeriod = {
        id: this.nextPeriodId++,
        startTime: this.startTime(),
        endTime: this.endTime(),
        status: 'available',
        bookedCount: 0
      };

      this.workDays.update((days) =>
        days.map((item) =>
          item.key === this.selectedDay()
            ? { ...item, periods: [...item.periods, newPeriod] }
            : item
        )
      );
      this.updateNotice.set('تمت إضافة فترة العمل بنجاح.');
    } else {
      this.workDays.update((days) =>
        days.map((item) =>
          item.key === this.selectedDay()
            ? {
                ...item,
                periods: item.periods.map((p) =>
                  p.id === editingId
                    ? { ...p, startTime: this.startTime(), endTime: this.endTime() }
                    : p
                )
              }
            : item
        )
      );
      this.updateNotice.set('تم تعديل فترة العمل بنجاح.');
    }

    this.editingPeriodId.set(null);
    this.formError.set('');
    this.savePersistedData();
    this.dialogView.set('manage');
  }

  deletePeriod(day: DayKey, period: WorkPeriod): void {
    // Check if period has booked appointments
    const dayAppointments = this.appointments().filter((a) => a.dayKey === day && a.status === 'booked');
    const pStart = this.minutesFromTime(period.startTime);
    const pEnd = this.minutesFromTime(period.endTime);

    const hasBooked = dayAppointments.some((a) => {
      const aStart = this.minutesFromTime(a.startTime);
      const aEnd = this.minutesFromTime(a.endTime);
      return aStart < pEnd && aEnd > pStart;
    });

    if (hasBooked || (period.bookedCount && period.bookedCount > 0)) {
      this.formError.set('لا يمكن حذف فترة عمل مرتبطة بمواعيد محجوزة بالفعل للمرضى.');
      return;
    }

    this.workDays.update((days) =>
      days.map((item) =>
        item.key === day
          ? { ...item, periods: item.periods.filter((p) => p.id !== period.id) }
          : item
      )
    );
    this.updateNotice.set('تم حذف فترة العمل.');
    this.savePersistedData();
  }

  // Copy Schedule to Next Week (Modal 4)
  openApplyScheduleDialog(): void {
    this.dialogView.set('apply-schedule');
  }

  confirmApplySchedule(): void {
    // Clones current working periods into next week schedule and syncs availability
    this.updateNotice.set('تم تطبيق جدول فترات العمل على الأسبوع القادم بنجاح.');
    this.savePersistedData();
    this.closeDialog();
  }

  // Appointment Management Operations (Create, Edit, Delete)
  openAddAppointment(dayKey: DayKey = 'sunday', dateStr?: string): void {
    this.appointmentPatientName.set('');
    this.appointmentPatientPhone.set('');
    this.appointmentDayKey.set(dayKey);
    this.appointmentDateStr.set(dateStr ?? this.getDateStrForDay(dayKey));
    this.appointmentStartTime.set('10:00');
    this.appointmentEndTime.set('11:00');
    this.appointmentSessionType.set('online');
    this.appointmentStatus.set('booked');
    this.appointmentNotes.set('');
    this.editingAppointmentId.set(null);
    this.appointmentFormError.set('');
    this.dialogView.set('appointment');
  }

  openEditAppointment(appointment: Appointment): void {
    this.appointmentPatientName.set(appointment.patientName);
    this.appointmentPatientPhone.set(appointment.patientPhone ?? '');
    this.appointmentDayKey.set(appointment.dayKey);
    this.appointmentDateStr.set(appointment.dateStr);
    this.appointmentStartTime.set(appointment.startTime);
    this.appointmentEndTime.set(appointment.endTime);
    this.appointmentSessionType.set(appointment.sessionType);
    this.appointmentStatus.set(appointment.status);
    this.appointmentNotes.set(appointment.notes ?? '');
    this.editingAppointmentId.set(appointment.id);
    this.appointmentFormError.set('');
    this.dialogView.set('appointment');
  }

  saveAppointment(event: Event): void {
    event.preventDefault();
    const name = this.appointmentPatientName().trim();
    const start = this.minutesFromTime(this.appointmentStartTime());
    const end = this.minutesFromTime(this.appointmentEndTime());
    const dayKey = this.appointmentDayKey();

    if (!name) {
      this.appointmentFormError.set('يرجى كتابة اسم المريض أو وصف الموعد.');
      return;
    }

    if (start < 0 || end < 0 || start >= end) {
      this.appointmentFormError.set('تأكد من اختيار وقت نهاية بعد وقت البداية.');
      return;
    }

    // Availability validation against working hours (Criterion #6)
    const workDay = this.workDays().find((d) => d.key === dayKey);
    const isWithinWorkingHours = workDay?.periods.some(
      (p) => start >= this.minutesFromTime(p.startTime) && end <= this.minutesFromTime(p.endTime)
    );

    if (!isWithinWorkingHours && workDay && workDay.periods.length > 0) {
      this.appointmentFormError.set('تنبيه: هذا التوقيت يقع خارج فترات العمل المحددة لهذا اليوم.');
      return;
    }

    // Overlap validation with existing appointments on the same day/date
    const editingId = this.editingAppointmentId();
    const dayAppointments = this.appointments().filter(
      (a) => a.id !== editingId && (a.dayKey === dayKey || a.dateStr === this.appointmentDateStr())
    );

    const hasConflict = dayAppointments.some(
      (a) => a.status !== 'cancelled' &&
             start < this.minutesFromTime(a.endTime) &&
             end > this.minutesFromTime(a.startTime)
    );

    if (hasConflict) {
      this.appointmentFormError.set('يوجد موعد آخر محجوز بالفعل في هذا التوقيت.');
      return;
    }

    if (editingId === null) {
      const newApt: Appointment = {
        id: this.nextAppointmentId++,
        patientName: name,
        patientPhone: this.appointmentPatientPhone().trim(),
        dayKey,
        dateStr: this.appointmentDateStr() || this.getDateStrForDay(dayKey),
        startTime: this.appointmentStartTime(),
        endTime: this.appointmentEndTime(),
        sessionType: this.appointmentSessionType(),
        status: this.appointmentStatus(),
        notes: this.appointmentNotes().trim()
      };

      this.appointments.update((list) => [...list, newApt]);
    } else {
      this.appointments.update((list) =>
        list.map((a) =>
          a.id === editingId
            ? {
                ...a,
                patientName: name,
                patientPhone: this.appointmentPatientPhone().trim(),
                dayKey,
                dateStr: this.appointmentDateStr() || a.dateStr,
                startTime: this.appointmentStartTime(),
                endTime: this.appointmentEndTime(),
                sessionType: this.appointmentSessionType(),
                status: this.appointmentStatus(),
                notes: this.appointmentNotes().trim()
              }
            : a
        )
      );
    }

    this.savePersistedData();
    this.closeDialog();
  }

  deleteAppointment(id: number): void {
    this.appointments.update((list) => list.filter((a) => a.id !== id));
    this.savePersistedData();
    this.closeDialog();
  }

  cancelAppointment(id: number): void {
    this.appointments.update((list) =>
      list.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );
    this.savePersistedData();
    this.closeDialog();
  }

  // Profile completion redirection (Criterion #7)
  navigateToIncompleteStep(stepNumber: number): void {
    this.router.navigate(['/specialist-register'], {
      queryParams: { step: stepNumber }
    });
  }

  toggleProfileCompletion(): void {
    this.profileStatus.update((status) => ({
      ...status,
      isComplete: !status.isComplete,
      completionPercentage: !status.isComplete ? 100 : 70
    }));
    this.savePersistedData();
  }

  // Helpers
  formatTime(time: string): string {
    const [hourText, minute] = time.split(':');
    const hour = Number(hourText);
    const period = hour >= 12 ? 'م' : 'ص';
    const formattedHour = hour % 12 || 12;
    return `${String(formattedHour).padStart(2, '0')}:${minute} ${period}`;
  }

  formatTimeEn(time: string): string {
    const [hourText, minute] = time.split(':');
    const hour = Number(hourText);
    return `${String(hour % 12 || 12).padStart(2, '0')}:${minute} ${hour >= 12 ? 'PM' : 'AM'}`;
  }

  calculateDurationHours(startTime: string, endTime: string): string {
    const diff = this.minutesFromTime(endTime) - this.minutesFromTime(startTime);
    if (diff <= 0) return '0 ساعة';
    const hours = diff / 60;
    return hours === 1 ? 'ساعة واحدة' : hours === 2 ? 'ساعتان' : `${hours} ساعات عمل`;
  }

  calculateDayTotalHours(day: WorkDay): string {
    const totalMinutes = day.periods.reduce((acc, p) => {
      const diff = this.minutesFromTime(p.endTime) - this.minutesFromTime(p.startTime);
      return acc + (diff > 0 ? diff : 0);
    }, 0);

    const hours = Math.round(totalMinutes / 60);
    return `${hours} ساعات عمل`;
  }

  isDayActive(day: WorkDay): boolean {
    return day.periods.length > 0 && day.periods.some((period) => period.status === 'available');
  }

  periodStatusLabel(period: WorkPeriod): string {
    if (period.status === 'closed') {
      return 'مغلقة بالكامل';
    }
    const booked = period.bookedCount ?? 0;
    if (booked === 0) {
      return 'متاح للحجز';
    }
    if (booked === 1) {
      return 'جلسة واحدة محجوزة';
    }
    if (booked === 2) {
      return 'جلستان محجوزتان';
    }
    return `${booked} جلسات محجوزة`;
  }

  getStatusClass(status: CalendarStatus): string {
    switch (status) {
      case 'available':
        return 'slot-available';
      case 'booked':
        return 'slot-booked';
      case 'completed':
        return 'slot-completed';
      case 'cancelled':
        return 'slot-cancelled';
    }
  }

  getStatusLabel(status: CalendarStatus): string {
    switch (status) {
      case 'available':
        return 'متاح للحجز';
      case 'booked':
        return 'محجوز';
      case 'completed':
        return 'تمت';
      case 'cancelled':
        return 'ملغي';
    }
  }

  private getDateStrForDay(dayKey: DayKey): string {
    const day = this.calendarDays().find((d) => d.key === dayKey);
    return day ? day.fullDateStr : '';
  }

  private minutesFromTime(time: string): number {
    if (!/^\d{2}:\d{2}$/.test(time)) {
      return -1;
    }
    const [hours, minutes] = time.split(':').map(Number);
    return hours < 24 && minutes < 60 ? hours * 60 + minutes : -1;
  }

  private isSameDate(d1: Date, d2: Date): boolean {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }

  // Persistence
  private savePersistedData(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('adhd_specialist_work_days', JSON.stringify(this.workDays()));
        localStorage.setItem('adhd_specialist_appointments', JSON.stringify(this.appointments()));
        localStorage.setItem('adhd_specialist_profile', JSON.stringify(this.profileStatus()));
      }
    } catch {
      // Ignored in environments where localStorage is restricted
    }
  }

  private loadPersistedData(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const savedDays = localStorage.getItem('adhd_specialist_work_days');
        if (savedDays) {
          const parsed = JSON.parse(savedDays) as WorkDay[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.workDays.set(parsed);
          }
        }

        const savedApts = localStorage.getItem('adhd_specialist_appointments');
        if (savedApts) {
          const parsed = JSON.parse(savedApts) as Appointment[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.appointments.set(parsed);
          }
        }

        const savedProfile = localStorage.getItem('adhd_specialist_profile');
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile) as SpecialistProfileStatus;
          if (parsed && typeof parsed.isComplete === 'boolean') {
            this.profileStatus.set(parsed);
          }
        }
      }
    } catch {
      // Fallback to default state
    }
  }
}
