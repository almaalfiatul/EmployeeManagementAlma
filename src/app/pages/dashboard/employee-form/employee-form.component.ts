import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import Swal from 'sweetalert2';
import { DateValidatorDirective } from '../../../shared/directives/date-validator.directive';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DateValidatorDirective],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit{
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  @Output() onSaved = new EventEmitter<void>();
  title = '';
  employee: any = null;

  formData: any = {
    username: '',
    firstName: '',
    lastName: '',
    brithDate: '',
    email: '',
    status: '',
    basicSalary: '',
    group: '',
    description: ''
  };

  constructor(
    private userService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        try {
          this.employee = JSON.parse(params['data']);
        } catch (err) {
          console.error('Gagal parsing data:', err);
        }
      }
    });
    if (this.employee?.id !== undefined) {
      this.title = 'Edit data pegawai';
      this.formData = { ...this.employee }; 
    } else {
      this.title = 'Tambah data pegawai';
      this.resetForm();
    }
  }

  submitForm() {
    if (!this.formData.username || !this.formData.firstName || !this.formData.lastName || 
      !this.formData.email || !this.formData.birthDate || !this.formData.status) {
      Swal.fire({
        icon: 'warning',
        title: 'Form Tidak Lengkap',
        text: 'Harap isi semua field',
        confirmButtonColor: '#facc15'
      });
      return;
    }
    if (this.formData.id) {
      // EDIT
      this.userService.updateUser(this.formData.id, this.formData)
        .then(() => {
          Swal.fire({ icon: 'warning', title: 'Updated!', text: 'Employee successfully updated', timer: 2000, showConfirmButton: false });
          this.onSaved.emit();
          this.router.navigate(['dashboard']);
        })
        .catch(err => {
          Swal.fire({ icon: 'error', title: 'Update failed', text: err.message });
        });
    } else {
      // ADD
      this.userService.addUser(this.formData)
        .then(() => {
          Swal.fire({ icon: 'success', title: 'Added!', text: 'Employee successfully added', timer: 2000, showConfirmButton: false });
          this.onSaved.emit();
          this.router.navigate(['dashboard']);
        })
        .catch(err => {
          Swal.fire({ icon: 'error', title: 'Added failed', text: err.message });
        });
    }
  }

  // reset form ke nilai awal
  resetForm() {
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      birthDate: '',
      status: ''
    };
  }

  handleClose() {
    this.router.navigate(['dashboard']);
  }
}
