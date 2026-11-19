import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { SpecialistDashboardComponent, WorkPeriod } from './specialist-dashboard';

describe('SpecialistDashboardComponent', () => {
  let component: SpecialistDashboardComponent;
  let fixture: ComponentFixture<SpecialistDashboardComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialistDashboardComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialistDashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create the specialist dashboard', () => {
    expect(component).toBeTruthy();
  });

  it('should render RTL layout with title and actions', () => {
    const root = fixture.nativeElement.querySelector('.screen-shell');
    expect(root.getAttribute('dir')).toBe('rtl');
    expect(fixture.nativeElement.textContent).toContain('التقويم والمواعيد');
    expect(fixture.nativeElement.textContent).toContain('إدارة فترات العمل');
    expect(fixture.nativeElement.textContent).toContain('إضافة موعد');
  });

  it('should calculate the 7 week days starting from Sunday', () => {
    const days = component.calendarDays();
    expect(days.length).toBe(7);
    expect(days[0].key).toBe('sunday');
    expect(days[0].label).toBe('الأحد');
    expect(days[6].key).toBe('saturday');
    expect(days[6].label).toBe('السبت');
  });

  it('should support weekly navigation (next, previous, and today)', () => {
    expect(component.weekOffset()).toBe(0);

    component.changeWeek(1);
    expect(component.weekOffset()).toBe(1);

    component.changeWeek(-2);
    expect(component.weekOffset()).toBe(-1);

    component.goToToday();
    expect(component.weekOffset()).toBe(0);
  });

  it('should switch between weekly and daily view', () => {
    expect(component.viewMode()).toBe('weekly');
    expect(component.visibleCalendarDays().length).toBe(7);

    component.viewMode.set('daily');
    component.selectedCalendarDay.set('sunday');
    expect(component.visibleCalendarDays().length).toBe(1);
    expect(component.visibleCalendarDays()[0].key).toBe('sunday');
  });

  it('should validate and add a new working period without overlaps', () => {
    component.openAddPeriod('sunday');
    component.startTime.set('14:00');
    component.endTime.set('16:00');

    const fakeEvent = { preventDefault: () => {} } as unknown as Event;
    component.savePeriod(fakeEvent);

    const sunday = component.workDays().find((d) => d.key === 'sunday');
    const addedPeriod = sunday?.periods.find((p) => p.startTime === '14:00');
    expect(addedPeriod).toBeTruthy();
    expect(addedPeriod?.endTime).toBe('16:00');
    expect(component.formError()).toBe('');
  });

  it('should reject overlapping working periods on the same day', () => {
    // Sunday already has 09:00 - 13:00
    component.openAddPeriod('sunday');
    component.startTime.set('10:00');
    component.endTime.set('12:00');

    const fakeEvent = { preventDefault: () => {} } as unknown as Event;
    component.savePeriod(fakeEvent);

    expect(component.formError()).toContain('تتداخل مع فترة عمل أخرى');
  });

  it('should reject invalid time range where end time is before start time', () => {
    component.openAddPeriod('monday');
    component.startTime.set('18:00');
    component.endTime.set('16:00');

    const fakeEvent = { preventDefault: () => {} } as unknown as Event;
    component.savePeriod(fakeEvent);

    expect(component.formError()).toContain('وقت نهاية بعد وقت البداية');
  });

  it('should delete a working period if no booked appointments are affected', () => {
    // Add a free period and delete it
    const testPeriod: WorkPeriod = {
      id: 999,
      startTime: '06:00',
      endTime: '08:00',
      status: 'available',
      bookedCount: 0
    };

    component.workDays.update((days) =>
      days.map((d) => (d.key === 'friday' ? { ...d, periods: [testPeriod] } : d))
    );

    component.deletePeriod('friday', testPeriod);

    const friday = component.workDays().find((d) => d.key === 'friday');
    expect(friday?.periods.some((p) => p.id === 999)).toBe(false);
  });

  it('should prevent deleting a working period that has booked appointments', () => {
    // Sunday has 09:00 - 13:00 which contains booked appointments
    const sunday = component.workDays().find((d) => d.key === 'sunday');
    const bookedPeriod = sunday?.periods[0];
    expect(bookedPeriod).toBeDefined();

    component.deletePeriod('sunday', bookedPeriod!);
    expect(component.formError()).toContain('لا يمكن حذف فترة عمل مرتبطة بمواعيد محجوزة');
  });

  it('should create a valid appointment within working hours', () => {
    component.openAddAppointment('sunday');
    component.appointmentPatientName.set('طارق سامي');
    component.appointmentStartTime.set('12:00');
    component.appointmentEndTime.set('13:00');
    component.appointmentStatus.set('booked');

    const fakeEvent = { preventDefault: () => {} } as unknown as Event;
    component.saveAppointment(fakeEvent);

    const apt = component.appointments().find((a) => a.patientName === 'طارق سامي');
    expect(apt).toBeTruthy();
    expect(apt?.startTime).toBe('12:00');
    expect(component.appointmentFormError()).toBe('');
  });

  it('should reject appointment outside specialist working hours', () => {
    // Friday has no working periods
    component.openAddAppointment('friday');
    component.appointmentPatientName.set('مريض تجريبي');
    component.appointmentStartTime.set('10:00');
    component.appointmentEndTime.set('11:00');

    // Or Thursday which has 17:00 - 21:00, pick 08:00 - 09:00
    component.appointmentDayKey.set('thursday');
    component.appointmentStartTime.set('08:00');
    component.appointmentEndTime.set('09:00');

    const fakeEvent = { preventDefault: () => {} } as unknown as Event;
    component.saveAppointment(fakeEvent);

    expect(component.appointmentFormError()).toContain('يقع خارج فترات العمل');
  });

  it('should reject appointment overlapping with an existing appointment', () => {
    // Sunday already has 09:00 - 10:00 booked for 'أحمد محمد'
    component.openAddAppointment('sunday');
    component.appointmentPatientName.set('مريض جديد');
    component.appointmentStartTime.set('09:30');
    component.appointmentEndTime.set('10:30');

    const fakeEvent = { preventDefault: () => {} } as unknown as Event;
    component.saveAppointment(fakeEvent);

    expect(component.appointmentFormError()).toContain('يوجد موعد آخر محجوز بالفعل');
  });

  it('should delete and cancel appointments', () => {
    const initialCount = component.appointments().length;
    const testApt = component.appointments()[0];

    component.cancelAppointment(testApt.id);
    const updated = component.appointments().find((a) => a.id === testApt.id);
    expect(updated?.status).toBe('cancelled');

    component.deleteAppointment(testApt.id);
    expect(component.appointments().length).toBe(initialCount - 1);
  });

  it('should redirect incomplete profiles to the missing registration step', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.navigateToIncompleteStep(7);

    expect(navigateSpy).toHaveBeenCalledWith(['/specialist-register'], {
      queryParams: { step: 7 }
    });
  });

  it('should copy schedule to next week via apply dialog', () => {
    component.openApplyScheduleDialog();
    expect(component.dialogView()).toBe('apply-schedule');

    component.confirmApplySchedule();
    expect(component.dialogView()).toBeNull();
    expect(component.updateNotice()).toContain('تم تطبيق جدول فترات العمل على الأسبوع القادم');
  });
});
