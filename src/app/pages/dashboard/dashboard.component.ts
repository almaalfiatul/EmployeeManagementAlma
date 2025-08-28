import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { LucideAngularModule } from 'lucide-angular';
import { EmployeeFormComponent } from "./employee-form/employee-form.component";

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LucideAngularModule,
    LucideAngularModule,
], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  searchQuery = '';
  employee: any[] = [];
  pagedEmployees: any[] = [];
  filteredEmployees: any[] = [];
  isModalOpen = false;
  selectedUser: any = null;
  itemsPerPageOptions = [5, 10, 20, 50];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';  

  constructor(
    private userService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getListEmployee();

  }

  getListEmployee() {
    this.userService.getUsers().subscribe(data => {
      this.employee = data;
      this.totalPages = Math.ceil(this.employee.length / this.itemsPerPage);
      this.setPage(1);
      this.filteredEmployees = data;
      this.applyFilter();
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    this.setPage(1);
  }
  
  applyFilter() {
    const terms = this.searchQuery.toLowerCase().split(' ').filter(t => t);
    if (terms.length === 0) {
      this.filteredEmployees = [...this.employee];
    } else {
      this.filteredEmployees = this.employee.filter(item => {
        return terms.every(term =>
          item.firstName.toLowerCase().includes(term) ||
          item.lastName.toLowerCase().includes(term)
        );
      });
    }

    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);

    if (this.totalPages > 0) {
      this.setPage(1);
    } else {
      this.pagedEmployees = []; 
    }
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredEmployees.sort((a: any, b: any) => {
      let valA = a[column]?.toString().toLowerCase() || '';
      let valB = b[column]?.toString().toLowerCase() || '';

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.setPage(1);
  }

  onDelete(employee: any) {
    if (confirm(`Are you sure you want to delete Alma?" ${employee.firstName} ${employee.lastName}?`)) {
      this.userService.deleteUser(employee.id).then(() => {
        this.getListEmployee(); 
      });
    }
  }

  openAddModal() {
    this.router.navigate(['employee-create']);
  }

  openEditModal(user: any) {
    this.router.navigate(
      ['employee-update'],
      { queryParams: { data: JSON.stringify(user) } }
    );
  }

  openDetailModal(user: any) {
    this.router.navigate(
      ['employee-detail'],
      { queryParams: { data: JSON.stringify(user) } }
    );
  }

  handleSave(user: any) {
    if (user.id) {
      this.userService.updateUser(user.id, user).then(() => {
        this.getListEmployee();
        this.isModalOpen = false;
      });
    } else {
      this.userService.addUser(user).then(() => {
        this.getListEmployee();
        this.isModalOpen = false;
      });
    }
  }

  handleClose() {
    this.isModalOpen = false;
  }
}
