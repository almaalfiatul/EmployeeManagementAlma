import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import localeId from '@angular/common/locales/id';
registerLocaleData(localeId);

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.css'
})
export class EmployeeDetailComponent implements OnInit {

  employee: any = null;

    constructor(
      private route: ActivatedRoute,
      private router: Router
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
  }

  goBack() {
    this.router.navigate(['dashboard']);
  }
}
