import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { RestockpageComponent } from './restockpage/restockpage.component';
import { ReturnpageComponent } from './returnpage/returnpage.component';
import { RentpageComponent } from './rentpage/rentpage.component';
import { RegisterpageComponent } from './registerpage/registerpage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { CartpageComponent } from './cartpage/cartpage.component';

const routes: Routes = [
  { path: 'home', component: HomepageComponent },
  { path: 'restock', component: RestockpageComponent },
  { path: 'return', component: ReturnpageComponent },
  { path: 'rent', component: RentpageComponent },
  { path: 'register', component: RegisterpageComponent },
  { path: 'login', component: LoginpageComponent },
  { path: 'cart', component: CartpageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
