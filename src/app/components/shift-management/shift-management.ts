import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
interface ShiftPattern {
  id: number;
  code: string;
  name: string;
  description: string;
  timing: string;
  hours: string;
  workingDays: string[];
  employees: number;
  status: 'Active' | 'Inactive';
}

interface Activity {
  id: number;
  type: 'add' | 'update' | 'delete';
  title: string;
  desc: string;
  createdAt: any;
}
@Component({
  selector: 'app-shift-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './shift-management.html',
  styleUrl: './shift-management.css',
})
export class ShiftManagement implements OnInit, AfterViewInit, OnDestroy {
  newPattern: ShiftPattern = {
    id: 0,
    code: '',
    name: '',
    description: '',
    timing: '',
    hours: '',
    workingDays: [],
    employees: 0,
    status: 'Active',
  };

  showAddModal = false;

  week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  onAddShiftPattern() {
    this.showAddModal = true;

    this.newPattern = {
      id: 0,
      code: '',
      name: '',
      description: '',
      timing: '',
      hours: '',
      workingDays: [],
      employees: 0,
      status: 'Active',
    };
  }
  showEditModal = false;

  editPattern: ShiftPattern = {
    id: 0,
    code: '',
    name: '',
    description: '',
    timing: '',
    hours: '',
    workingDays: [],
    employees: 0,
    status: 'Active',
  };
  @ViewChild('tableSection')
  tableSection!: ElementRef;

  onMetricClick(type: string) {
    switch (type) {
      case 'all':
        this.filteredPatterns = [...this.shiftPatterns];
        break;

      case 'active':
        this.filteredPatterns = this.shiftPatterns.filter((x) => x.status === 'Active');
        break;

      case 'inactive':
        this.filteredPatterns = this.shiftPatterns.filter((x) => x.status === 'Inactive');
        break;

      case 'employees':
        this.filteredPatterns = this.shiftPatterns.filter((x) => x.employees > 0);
        break;
    }

    this.updateCardCounts();
    this.initCharts();

    setTimeout(() => {
      this.tableSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }
  addActivity(type: 'add' | 'update' | 'delete', title: string, desc: string) {
    console.log('addActivity called');

    this.activities.unshift({
      id: Date.now(),
      type,
      title,
      desc,
      createdAt: new Date(),
    });

    console.log(this.activities);
  }

  onDayChange(event: any) {
    const day = event.target.value;

    if (event.target.checked) {
      this.newPattern.workingDays.push(day);
    } else {
      this.newPattern.workingDays = this.newPattern.workingDays.filter((x) => x !== day);
    }
  }

  savePattern() {
    const pattern = {
      ...this.newPattern,
      id: Date.now(),
    };

    this.shiftPatterns.push(pattern);
    this.addActivity('add', 'New Shift Pattern Added', `${pattern.name} (${pattern.code}) added`);
    this.applyFilter();
    this.updateCardCounts();
    this.initCharts();

    this.showAddModal = false;
  }
  @ViewChild('donutCanvas') donutCanvas!: ElementRef<HTMLCanvasElement>;

  totalPatterns = 0;
  activePatterns = 0;
  inactivePatterns = 0;
  totalEmployees = 0;

  searchText: string = '';
  entriesPerPage: number = 10;

  shiftPatterns: ShiftPattern[] = [
    {
      id: 1,
      code: 'SP001',
      name: 'General Shift (GS)',
      description: 'General day shift for all departments',
      timing: '09:00 AM - 06:00 PM',
      hours: '09:00 hrs',
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      employees: 120,
      status: 'Active',
    },
    {
      id: 2,
      code: 'SP002',
      name: 'Rotational Shift (RS)',
      description: 'Rotational shift for operations team',
      timing: '08:00 AM - 06:00 PM / 04:00 PM - 12:00 AM',
      hours: '',
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      employees: 60,
      status: 'Active',
    },
    {
      id: 3,
      code: 'SP003',
      name: 'Night Shift (NS)',
      description: 'Night shift for support team',
      timing: '10:00 PM - 07:00 AM',
      hours: '09:00 hrs',
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      employees: 20,
      status: 'Active',
    },
    {
      id: 4,
      code: 'SP004',
      name: 'Flexible Shift (FS)',
      description: 'Flexible shift for IT team',
      timing: '10:00 AM - 07:00 AM',
      hours: '09:00 hrs',
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      employees: 20,
      status: 'Active',
    },
    {
      id: 5,
      code: 'SP005',
      name: 'Half Day Shift (HD)',
      description: 'Half day shift pattern',
      timing: '09:00 AM - 01:00 PM',
      hours: '04:00 hrs',
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      employees: 10,
      status: 'Inactive',
    },
    {
      id: 6,
      code: 'SP006',
      name: 'Weekend Shift (WS)',
      description: 'Shift for weekend operations',
      timing: '09:00 AM - 06:00 PM',
      hours: '09:00 hrs',
      workingDays: ['Sat', 'Sun'],
      employees: 10,
      status: 'Active',
    },
    {
      id: 7,
      code: 'SP007',
      name: 'Custom Shift (CS)',
      description: 'Custom shift pattern',
      timing: '07:00 AM - 03:00 PM',
      hours: '08:00 hrs',
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      employees: 0,
      status: 'Inactive',
    },
  ];

  activities: Activity[] = [];

  filteredPatterns: ShiftPattern[] = [];
  selectedRows: number[] = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  statusFilter = '';
  selectedMonth = '2025-05';
  calendarDays: { name: string; key: string }[] = [];

  doughnutChart: Chart | null = null;
  barChart: Chart | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const savedActivities = localStorage.getItem('activities');

    if (savedActivities) {
      this.activities = JSON.parse(savedActivities).map((x: any) => ({
        ...x,
        createdAt: new Date(x.createdAt),
      }));
    } else {
      this.activities = [];

      localStorage.setItem('activities', JSON.stringify(this.activities));
    }
    this.filteredPatterns = [...this.shiftPatterns];
    this.onMonthChange();
    this.updateCardCounts();
  }
  getTimeAgo(date: any): string {
    const time = new Date(date).getTime();
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);

      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }

    return 'Just now';
  }
  ngAfterViewInit(): void {
    this.initCharts();
  }

  ngOnDestroy(): void {
    if (this.doughnutChart) this.doughnutChart.destroy();
    if (this.barChart) this.barChart.destroy();
  }

  updateCardCounts() {
    this.totalPatterns = this.filteredPatterns.length;

    this.activePatterns = this.filteredPatterns.filter((p) => p.status === 'Active').length;

    this.inactivePatterns = this.filteredPatterns.filter((p) => p.status === 'Inactive').length;

    this.totalEmployees = this.filteredPatterns.reduce((sum, p) => sum + p.employees, 0);
  }

  initCharts() {
    setTimeout(() => {
      let hrs4 = 0,
        hrs8 = 0,
        hrs9 = 0,
        hrs10Plus = 0;
      this.filteredPatterns.forEach((p) => {
        if (!p.hours) return;
        const numHrs = parseInt(p.hours);
        if (numHrs <= 4) hrs4++;
        else if (numHrs === 8) hrs8++;
        else if (numHrs === 9) hrs9++;
        else if (numHrs >= 10) hrs10Plus++;
      });

      const maxVal = Math.max(hrs4, hrs8, hrs9, hrs10Plus);
      if (this.doughnutChart) {
        this.doughnutChart.destroy();
      }

      if (this.donutCanvas && this.donutCanvas.nativeElement) {
        this.doughnutChart = new Chart(this.donutCanvas.nativeElement, {
          type: 'doughnut',
          data: {
            labels: ['Active', 'Inactive'],
            datasets: [
              {
                data: [this.activePatterns, this.inactivePatterns],
                backgroundColor: ['#22c55e', '#ef4444'],
                borderWidth: 0,
                borderColor: '#ffffff',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: { display: false },
            },
          },
        });
      }
      // --- Bar Chart Initialization ---
      if (this.barChart) {
        this.barChart.destroy();
      }

      const barEl = document.getElementById('workingHoursChart') as HTMLCanvasElement;
      if (barEl) {
        this.barChart = new Chart(barEl, {
          type: 'bar',
          data: {
            labels: ['4 Hrs', '8 Hrs', '9 Hrs', '10+ Hrs'],
            datasets: [
              {
                data: [hrs4, hrs8, hrs9, hrs10Plus],
                backgroundColor: '#0B48FE',
                barPercentage: 0.5,
                categoryPercentage: 0.8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            layout: {
              padding: { top: 20 },
            },
            scales: {
              y: {
                beginAtZero: true,
                suggestedMax: maxVal + 1,
                ticks: { stepSize: 1, color: '#08275c' },
                grid: { color: '#e5e7eb' },
              },
              x: { ticks: { color: '#08275c' }, grid: { display: false } },
            },
          },
          plugins: [
            {
              id: 'valueLabels',
              afterDatasetsDraw(chart) {
                const { ctx } = chart;
                chart.data.datasets.forEach((dataset, i) => {
                  const meta = chart.getDatasetMeta(i);
                  meta.data.forEach((bar, index) => {
                    ctx.fillStyle = '#08275c';
                    ctx.font = '600 13px Segoe UI';
                    ctx.textAlign = 'center';
                    ctx.fillText(String(dataset.data[index]), bar.x, bar.y - 8);
                  });
                });
              },
            },
          ],
        });
      }
      this.cdr.detectChanges();
    }, 0);
  }

  applyFilter() {
    let data = [...this.shiftPatterns];

    if (this.searchText) {
      const value = this.searchText.toLowerCase();
      data = data.filter(
        (item) =>
          item.code.toLowerCase().includes(value) ||
          item.name.toLowerCase().includes(value) ||
          item.description.toLowerCase().includes(value),
      );
    }

    if (this.statusFilter) {
      data = data.filter((x) => x.status === this.statusFilter);
    }

    this.filteredPatterns = data;
    this.updateCardCounts();
    this.initCharts();
  }

  onSearch() {
    this.applyFilter();
  }

  onFilter(status: string) {
    this.statusFilter = this.statusFilter === status ? '' : status;
    this.applyFilter();
  }

  deleteSelected() {
    const deletedPatterns = this.shiftPatterns.filter((x) => this.selectedRows.includes(x.id));

    deletedPatterns.forEach((pattern) => {
      this.addActivity(
        'delete',
        'Shift Pattern Deleted',
        `${pattern.name} (${pattern.code}) deleted`,
      );
    });

    this.shiftPatterns = this.shiftPatterns.filter((x) => !this.selectedRows.includes(x.id));

    this.selectedRows = [];

    this.applyFilter();
  }

  onDelete(pattern: ShiftPattern) {
    console.log('Delete clicked');

    this.shiftPatterns = this.shiftPatterns.filter((x) => x.id !== pattern.id);

    this.addActivity(
      'delete',
      'Shift Pattern Deleted',
      `${pattern.name} (${pattern.code}) deleted`,
    );

    this.applyFilter();
  }
  sort(column: keyof ShiftPattern) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filteredPatterns.sort((a: any, b: any) => {
      const valueA = a[column];
      const valueB = b[column];
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  toggleSelection(id: number) {
    const index = this.selectedRows.indexOf(id);
    if (index > -1) this.selectedRows.splice(index, 1);
    else this.selectedRows.push(id);
  }

  toggleAll(event: any) {
    if (event.target.checked) {
      this.selectedRows = this.filteredPatterns.map((x) => x.id);
    } else {
      this.selectedRows = [];
    }
  }

  isSelected(id: number): boolean {
    return this.selectedRows.includes(id);
  }
  onView(pattern: ShiftPattern) {
    console.log('Viewing:', pattern.code);
  }
  onEdit(pattern: ShiftPattern) {
    this.editPattern = {
      ...pattern,
      workingDays: [...pattern.workingDays],
    };

    this.showEditModal = true;
  }
  onEditDayChange(event: any) {
    const day = event.target.value;

    if (event.target.checked) {
      if (!this.editPattern.workingDays.includes(day)) {
        this.editPattern.workingDays.push(day);
      }
    } else {
      this.editPattern.workingDays = this.editPattern.workingDays.filter((x) => x !== day);
    }
  }
  saveEditedPattern() {
    const index = this.shiftPatterns.findIndex((x) => x.id === this.editPattern.id);

    if (index !== -1) {
      this.shiftPatterns[index] = {
        ...this.editPattern,
      };
      this.addActivity(
        'update',
        'Shift Pattern Updated',
        `${this.editPattern.name} (${this.editPattern.code}) updated`,
      );
    }

    this.showEditModal = false;

    this.applyFilter();
    this.updateCardCounts();
    this.initCharts();
  }
  onMonthChange() {
    const [year, month] = this.selectedMonth.split('-').map(Number);
    this.calendarDays = [];
    const date = new Date(year, month - 1, 1);
    while (date.getMonth() === month - 1) {
      this.calendarDays.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' + date.getDate(),
        key: date.toISOString(),
      });
      date.setDate(date.getDate() + 1);
    }
  }

  getPercentage(count: number): string {
    if (!this.filteredPatterns || this.filteredPatterns.length === 0) {
      return '0.00';
    }
    const percentage = (count / this.filteredPatterns.length) * 100;
    return percentage.toFixed(2);
  }
}
