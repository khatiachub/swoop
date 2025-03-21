import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../core/dataservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private dataService: DataserviceService,private route:Router) {}

  categories:any[]=[];
  products:any[]=[];
  url="http://localhost:5257/";
  i:number=0;
  urls:any[]=[
    {
      url:"https://cdn.swoop.ge/ImagesStorage/77b83e98-b337-453f-ac3e-ca88c560073b.png",
      route:"/category/41/დასვენება/კახეთი"
    },
    {
      url:"https://cdn.swoop.ge/ImagesStorage/7a938109-33bc-4e78-803e-b4174db50bab.png",
      route:"/category/41/დასვენება/კახეთი"
    },
    {
      url:"https://cdn.swoop.ge/ImagesStorage/1612cf66-d880-4ca7-944d-036a86bb1926.png",
      route:"/category/41/დასვენება/მთის კურორტები"
    },
    {
      url:"https://cdn.swoop.ge/ImagesStorage/4f502cb9-47d6-4e9e-9158-8f6fb98416cf.png",
      route:"category/61/კინო"
    }
  ]
  index:number=0;
  interval:any;
  ngOnInit(): void {  
    this.dataService.getProducts().subscribe({
      next: (response) => {            
       // this.products = response.slice(0, 5); 
        this.products=[...response].sort(() => Math.random() - 0.5).slice(0,5);     
        console.log(this.products);
        
      },
      error: (error) => {
        console.log(error);   
      },      
    });
    this.startAutoSlide();

  }
  navigateToPage(index:number):void{
    this.route.navigate([this.urls[index].route])
  }

  startAutoSlide() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }
  nextSlide() {
    if (this.index < this.urls.length - 1) {
      this.index++;
    } else {
      this.index = 0; 
    }
  }

  prevSlide() {
    if (this.index > 0) {
      this.index--;
    } else {
      this.index = this.urls.length - 1; 
    }
  }
  prev(){
    if (this.i > 0) {
      this.i--;
    } else {
      return; 
    }
  }
  next(){
    if (this.i < this.products.length - 4) {
      this.i++;
      console.log(this.i);
      
    } else {
      return; 
    }

  }

  ngOnDestroy() {
    clearInterval(this.interval); 
  }
  getCategory(name:string,id:number):void{
    this.route.navigate([`category/${id}/${name}`])
  }
  
  navigateToCategory(img:string):void{
    if(img==='img1'){
      this.route.navigate(
        [`category/41/დასვენება/მთის კურორტები`],
        { state: { id: 63 } }
      );
    }else{
      this.route.navigate(
        [`category/62/გართობა`],
       // { state: { id: id } }
      );
    }
    
  }
}
