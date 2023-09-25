import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registerpage',
  templateUrl: './registerpage.component.html',
  styleUrls: ['./registerpage.component.css']
})
export class RegisterpageComponent {

  constructor(private _http: HttpClient,private router:Router) { } // Inject HttpClient
  username: string = '';
  userpassword: string = ''
  confirmPassword: string = '';

  onSubmit() {

    const userData = {
      username: this.username,
      password: this.userpassword,
      repeatPassword : this.confirmPassword,
      role : ''
    };

    const url = `http://localhost:8080/api/cycles/register`;

    if (this.userpassword !== this.confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    this._http.post(url, userData, { responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('User registered successfully:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error registering user:', error);
      }
    });

  }

}
