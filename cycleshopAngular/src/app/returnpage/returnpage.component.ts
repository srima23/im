import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-returnpage',
  templateUrl: './returnpage.component.html',
  styleUrls: ['./returnpage.component.css']
})
export class ReturnpageComponent {

  newdata: any;

  constructor(private _http: HttpClient) { }

  private getCartData(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this._http.get('http://localhost:8080/api/cycles/cart', { headers });
  }

  ngOnInit(): void {
    this.getCartData()
      .pipe(
        tap(res => {
          this.newdata = res;
          console.log('Success: Response from API:', this.newdata);
        })
      )
      .subscribe();
  }

  returnCycle(id: number): void {
    const requestBody = { cartId: id };
    const url = `http://localhost:8080/api/cycles/return`;
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    this._http.post(url, requestBody, { headers, responseType: 'text' })
      .pipe(
        tap(() => {
          this.ngOnInit(); // Consider updating the list after returning
          console.log(`Cycle with ID ${id} returned successfully.`);
        })
      )
      .subscribe();
  }
}