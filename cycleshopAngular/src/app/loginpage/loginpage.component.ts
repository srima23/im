import { Component } from '@angular/core';
import { AuthService } from '../AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent {

  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        const token = response.token; // Assuming the token is returned as part of the response
        this.authService.setToken(token);

        // Redirect to the "/home" page
        this.router.navigate(['/home']);
        alert('You have successfully logged in!');
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }
}
