import { Component, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  auth = inject(Auth);

  async login() {
    try {
      const user = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      Swal.fire({
          icon: 'success',
          title: 'Login Berhasil!',
          text: 'Selamat datang kembali 👋',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: err.message,
        });
    }
  }
}
