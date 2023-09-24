import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {CycleData } from '../cycle.interface';

@Component({
  selector: 'app-cartpage',
  templateUrl: './cartpage.component.html',
  styleUrls: ['./cartpage.component.css']
})
export class CartpageComponent implements OnInit {

  newdata: CycleData[] = [];
  subtotal: number = 0;
  grandTotal: number = 0;

  constructor(private _http: HttpClient) { }

  getallcycle(): Observable<CycleData[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this._http.get<CycleData[]>('http://localhost:8080/api/cycles/cart', { headers });
  }

  ngOnInit() {
    this.getallcycle().subscribe((res: CycleData[]) => {
      this.newdata = res.filter(item => !item.booked && !item.returned);
      console.log('Success: Filtered Response from API:', this.newdata);
    });
  }

  calculateTotalPrice(item: CycleData): number {
    return item.cycle.price * item.quantity;
  }

  calculateSubtotal(cartItems: CycleData[]): number {
    return cartItems
      .filter(item => !item.booked && !item.returned)
      .reduce((subtotal, item) => subtotal + this.calculateTotalPrice(item), 0);
  }


  checkout() {
    const grandTotal = this.calculateSubtotal(this.newdata);

    const postData = {
      totalAmount: grandTotal,
    };

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    this._http.post('http://localhost:8080/api/cycles/checkOut', postData, { headers }).subscribe(
      (response) => {
        this.subtotal = 0;
        this.grandTotal = 0;
        this.ngOnInit();
        console.log("Done with Checkout!");
      },
      (error) => {
        console.log("Checkout disrupted!");
      }
    );
  }

  // removeFromCartserve(cartId: number, action: 'remove' | 'reduce') {
  //   const requestData = {
  //     cartId: cartId.toString(),
  //     action: action
  //   };
  //   const headers = new HttpHeaders({
  //     'Authorization': 'Bearer ' + localStorage.getItem('token')
  //   });

  //   console.log(requestData);
  //   return this._http.post<string>(`http://localhost:8080/api/cycles/cart/remove`, requestData, { headers: headers });
  // }

  // removeFromCart(cartId: number, action: 'remove' | 'reduce') {
  //   this.removeFromCartserve(cartId, action).subscribe(
  //     response => {
  //       if (action === 'remove') {
  //         console.log('Cycle removed from cart successfully', response);
  //       } else if (action === 'reduce') {
  //         console.log('Cycle quantity reduced in cart successfully', response);
  //       }
  //     },
  //     error => {
  //       console.error('Error removing/reducing cycle from cart', error);
  //     }
  //   );
  }




