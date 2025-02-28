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
  vaucher_quantity=0;
  ngOnInit(): void {
    this.dataService.getBasket(this.userid).subscribe({
      next: (response) => {
       console.log(response);
       this.cart=response;
       this.cart.forEach((item)=>(this.vaucher_quantity=item.vaucher_quantity,this.total_quantity=item.total_quantity,this.total_price=item.total_price))
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  data:any={};
  updateBasket(button:string,id:number):void{
    this.data={
      product_id:id,
      user_id:1,
      quantity:0
    };
    const item = this.cart.find(p => p.id === id);
    if (!item) return;
    if(button==='+'){      
    this.dataService.updateCartQuantity(this.total_quantity+=1);    
    this.data.quantity =item.vaucher_quantity+=1
    }
    else if(button==='-'){
      if(this.vaucher_quantity===1){
        return
      }else{
        this.dataService.updateCartQuantity(this.total_quantity-=1);
        this.data.quantity =item.vaucher_quantity-=1
      }
    }
    this.cart = [...this.cart]; 

    
    this.dataService.updateBasket(this.data).subscribe({      
      next: (response) => {
       console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  deleteFromCart(id:number):void{
    this.dataService.deletefrombasket(this.userid,id).subscribe({
      next: (response) => {
       console.log(response);
       this.cart = this.cart.filter(item => item.id !== id);
       this.cart = [...this.cart]; 
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
 
}
