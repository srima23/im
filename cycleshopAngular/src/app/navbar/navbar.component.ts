import { Component } from '@angular/core';

import { AuthService } from '../AuthService';

@Component({

  selector: 'app-navbar',

  templateUrl: './navbar.component.html',

  styleUrls: ['./navbar.component.css']

})

export class NavbarComponent {

 

  constructor(private authService: AuthService) {}

 

  logout(): void {

    this.authService.logout(); // Call the logout method from AuthService

  }

  isAuthenticated(): boolean {

    return this.authService.getToken() !== null;

  }

 

}