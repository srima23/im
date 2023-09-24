import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../AuthService';
import { tap } from 'rxjs';



@Component({
  selector: 'app-rentpage',
  templateUrl: './rentpage.component.html',
  styleUrls: ['./rentpage.component.css']
})
export class RentpageComponent implements OnInit {

  newdata: any;

  constructor(private _http: HttpClient, private head: AuthService) { }

  private getListDataRequest() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this._http.get('http://localhost:8080/api/cycles/list-data', { headers: headers });
  }


  // getallcycle() {
  //   const headers = new HttpHeaders({
  //     'Authorization': 'Bearer ' + localStorage.getItem('token')
  //   });

  //   return this._http.get('http://localhost:8080/api/cycles/list-data', { headers: headers });
  // }


  ngOnInit(): void {
    this.getListDataRequest()
      .pipe(
        tap(res => {
          this.newdata = res;
          console.log('Success: Response from API:', this.newdata);
        })
      )
      .subscribe();
  }

  borrowCycle(id: number, quantityToBorrow: number) {

    const requestBody = { id, count: quantityToBorrow };

    const url = `http://localhost:8080/api/cycles/${id}/cart`;

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });


   
    this._http.post(url, requestBody, { headers: headers, responseType: 'text' })
      .pipe(
        tap(() => {
          this.ngOnInit(); // Consider updating the list after borrowing
          console.log(`Cycle with ID ${id} rented successfully.`);
        })
      )
      .subscribe();
  }
}