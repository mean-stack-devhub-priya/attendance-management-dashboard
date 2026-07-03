import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  time: string;
}
@Component({
  selector: 'app-shift-management',
  imports: [CommonModule,FormsModule],
  templateUrl: './shift-management.html',
  styleUrl: './shift-management.css',
})
export class ShiftManagement implements OnInit , AfterViewInit{
totalPatterns = 25;
  activePatterns = 20;
  inactivePatterns = 5;
  totalEmployees = 250;

  // Search and Filter logic
  searchText: string = '';
  entriesPerPage: number = 10;

  // Table Data
  shiftPatterns: ShiftPattern[] = [
    { id: 1, code: 'SP001', name: 'General Shift (GS)', description: 'General day shift for all departments', timing: '09:00 AM - 06:00 PM', hours: '09:00 hrs', workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], employees: 120, status: 'Active' },
    { id: 2, code: 'SP002', name: 'Rotational Shift (RS)', description: 'Rotational shift for operations team', timing: '08:00 AM - 06:00 PM / 04:00 PM - 12:00 AM', hours: '', workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], employees: 60, status: 'Active' },
    { id: 3, code: 'SP003', name: 'Night Shift (NS)', description: 'Night shift for support team', timing: '10:00 PM - 07:00 AM', hours: '09:00 hrs', workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], employees: 20, status: 'Active' },
    { id: 4, code: 'SP004', name: 'Flexible Shift (FS)', description: 'Flexible shift for IT team', timing: '10:00 AM - 07:00 AM', hours: '09:00 hrs', workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], employees: 20, status: 'Active' },
    { id: 5, code: 'SP005', name: 'Half Day Shift (HD)', description: 'Half day shift pattern', timing: '09:00 AM - 01:00 PM', hours: '04:00 hrs', workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], employees: 10, status: 'Inactive' },
    { id: 6, code: 'SP006', name: 'Weekend Shift (WS)', description: 'Shift for weekend operations', timing: '09:00 AM - 06:00 PM', hours: '09:00 hrs', workingDays: ['Sat', 'Sun'], employees: 10, status: 'Active' },
    { id: 7, code: 'SP007', name: 'Custom Shift (CS)', description: 'Custom shift pattern', timing: '07:00 AM - 03:00 PM', hours: '08:00 hrs', workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], employees: 0, status: 'Inactive' }
  ];

  // Recent Activities
  activities: Activity[] = [
    { id: 1, type: 'add', title: 'New Shift Pattern Added', desc: 'Weekend Shift (WS) added', time: '2 hours ago' },
    { id: 2, type: 'update', title: 'Shift Pattern Updated', desc: 'Rotational Shift (RS) updated', time: '5 hours ago' },
    { id: 3, type: 'delete', title: 'Shift Pattern Deleted', desc: 'Flexible Shift (FS) deleted', time: '1 day ago' }
  ];

  // Calendar Days
  calendarDays = [
    { name: 'Mon 12', key: 'mon' },
    { name: 'Tue 13', key: 'tue' },
    { name: 'Wed 14', key: 'wed' },
    { name: 'Thu 15', key: 'thu' },
    { name: 'Fri 16', key: 'fri' },
    { name: 'Sat 17', key: 'sat' },
    { name: 'Sun 18', key: 'sun' }
  ];

  constructor() { }

 
  // Action methods
  onAddShiftPattern() {
    console.log('Add Shift Pattern Clicked');
  }

  onView(pattern: ShiftPattern) {
    console.log('Viewing:', pattern.code);
  }

  onEdit(pattern: ShiftPattern) {
    console.log('Editing:', pattern.code);
  }

  onDelete(pattern: ShiftPattern) {
    console.log('Deleting:', pattern.code);
  }
    chart!: Chart;

  ngAfterViewInit(): void {
  // Doughnut Chart
  this.chart = new Chart('myChart', {
    type: 'doughnut',
    data: {
      labels: ['Active', 'Inactive'],
      datasets: [{
        data: [20, 5],
        backgroundColor: ['#4CAF50', '#EF4444']
      }]
    }
  });

  // Working Hours Chart
  // new Chart('workingHoursChart', {
  //   type: 'bar',
  //   data: {
  //     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  //     datasets: [{
  //       label: 'Working Hours',
  //       data: [8, 8, 9, 8, 7, 4, 0],
  //       backgroundColor: '#024BFE'
  //     }]
  //   }
  // });
new Chart('workingHoursChart', {
  type: 'bar',
  data: {
    labels: ['4 Hrs', '8 Hrs', '9 Hrs', '10+ Hrs'],
    datasets: [{
      data: [1, 12, 8, 4],
      backgroundColor: '#0B48FE',
      borderRadius: 0,
      barPercentage: 0.65,
      categoryPercentage: 0.8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display:false,
        position: 'top',
        labels: {
          boxWidth: 35,
          color: '#6b7280',
          font: {
            size: 12
          }
        }
      }
    },

    scales: {
      y: {
        beginAtZero: true,
        max: 15,
        ticks: {
          stepSize: 5,
          color: '#08275c'
        },
        grid: {
          color: '#e5e7eb'
        },
        border: {
          display: false
        }
      },

      x: {
        ticks: {
           color: '#08275c'
        },
        grid: {
          display: false
        },
        border: {
          color: '#e5e7eb'
        }
      }
    }
  },

  plugins: [{
    id: 'valueLabels',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;

      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);

        meta.data.forEach((bar, index) => {
          ctx.fillStyle = '#08275c';
          ctx.font = '600 13px Segoe UI';
          ctx.textAlign = 'center';

          ctx.fillText(
            String(dataset.data[index]),
            bar.x,
            bar.y - 8
          );
        });
      });
    }
  }]
});
  }


  // new data 
  filteredPatterns: ShiftPattern[] = [];
selectedRows: number[] = [];

sortColumn: string = '';
sortDirection: 'asc' | 'desc' = 'asc';

statusFilter = '';
ngOnInit(): void {
  this.filteredPatterns = [...this.shiftPatterns];
}
onSearch() {
  const value = this.searchText.toLowerCase();

  this.filteredPatterns = this.shiftPatterns.filter(item =>
    item.code.toLowerCase().includes(value) ||
    item.name.toLowerCase().includes(value) ||
    item.description.toLowerCase().includes(value)
  );

  this.applyFilter();
}
applyFilter() {
  let data = [...this.shiftPatterns];

  if (this.searchText) {
    data = data.filter(item =>
      item.code.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  if (this.statusFilter) {
    data = data.filter(
      x => x.status === this.statusFilter
    );
  }

  this.filteredPatterns = data;
}
onFilter(status: string) {
  this.statusFilter = status;
  this.applyFilter();
}
sort(column: keyof ShiftPattern) {

  if (this.sortColumn === column) {
    this.sortDirection =
      this.sortDirection === 'asc'
        ? 'desc'
        : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  this.filteredPatterns.sort((a: any, b: any) => {

    const valueA = a[column];
    const valueB = b[column];

    if (valueA < valueB) {
      return this.sortDirection === 'asc'
        ? -1
        : 1;
    }

    if (valueA > valueB) {
      return this.sortDirection === 'asc'
        ? 1
        : -1;
    }

    return 0;
  });
}
toggleSelection(id: number) {

  const index =
    this.selectedRows.indexOf(id);

  if (index > -1) {
    this.selectedRows.splice(index, 1);
  } else {
    this.selectedRows.push(id);
  }
}
toggleAll(event: any) {

  if (event.target.checked) {
    this.selectedRows =
      this.filteredPatterns.map(
        x => x.id
      );
  } else {
    this.selectedRows = [];
  }
}
isSelected(id: number): boolean {
  return this.selectedRows.includes(id);
}
deleteSelected() {

  this.shiftPatterns =
    this.shiftPatterns.filter(
      x => !this.selectedRows.includes(x.id)
    );

  this.filteredPatterns =
    this.filteredPatterns.filter(
      x => !this.selectedRows.includes(x.id)
    );

  this.selectedRows = [];
}
}