import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../core/dataservice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  constructor(private dataService: DataserviceService, private route: ActivatedRoute, private router: Router) { }
  cart:any[]=[];
  url = "http://localhost:5257/";
  userid=1;
  quantity:number=0;
  total_quantity:number=0;
  total_price:number=0;
  ngOnInit(): void {
    this.dataService.getBasket(this.userid).subscribe({
      next: (response) => {
       console.log(response);
       this.cart=response;
       this.cart.forEach((item)=>(this.total_quantity=item.total_quantity,this.total_price=item.total_price))
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  changeQuantity(button:string):void{
    if(button==='+'){
      this.quantity+=1
    }
    else if(button==='-'){
      if(this.quantity===1){
        return
      }else{
        this.quantity-=1
      }
    }
  }

 
}
