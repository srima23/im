import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../AuthService';

@Component({
  selector: 'app-restockpage',
  templateUrl: './restockpage.component.html',
  styleUrls: ['./restockpage.component.css']
})
export class RestockpageComponent {
  cycleid: string = '';
  cyclecount: string = '';
  cyclestock: number = 0;
  cyclebrand: string = '';
  cycleprice: number = 0;
  isAdmin: boolean = false;


  newdata: any;

  
  constructor(private authService: AuthService, private _http: HttpClient) {
    this.isAdmin = this.authService.getUserScope() === 'ROLE_ADMIN';
  }

  submitForm() {
    if (this.authService.getUserScope()==='ROLE_ADMIN') {
    
    const cycleData = {
      id: this.cycleid,
      count: this.cyclecount,
    };

    const id = this.cycleid;
    const url = `http://localhost:8080/api/cycles/${id}/restock`;

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    this._http.post(url, cycleData, { headers, responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('Cycle restocked successfully:', response);
      },
      error: (error) => {
        console.error('Error restocking cycle:', error);
      }
    });
    
  } else {
    alert('You do not have permission to restock cycles.');
  }
}

  submitAddCycleForm() {
    if (this.authService.getUserScope()==='ROLE_ADMIN') {
    const newcycleData = {
      brand: this.cyclebrand,
      stock: this.cyclestock,
      price: this.cycleprice
    }

    const url = `http://localhost:8080/api/cycles/addcycle`;


    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });


    this._http.post(url, newcycleData, { headers, responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('Cycle restocked successfully:', response);
      },
      error: (error) => {
        console.error('Error restocking cycle:', error);
      }
    });
  } else {
  alert('You do not have permission to add new cycles.');
}
  function submitAddCycleForm() {
  throw new Error('Function not implemented.');
}
 }
}
