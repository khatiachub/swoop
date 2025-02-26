import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataserviceService } from '../../core/dataservice.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})

export class ProductDetailsComponent implements OnInit {
  constructor(private dataService: DataserviceService, private route: ActivatedRoute, private router: Router) { }
 
  maincategory:string|null='';
  childcategory:string|null='';
  id:number|null=0;
  productdescription:string|null='';
  item:any={};
  images:any[]=[];
  url = "http://localhost:5257/";
  isBlur:boolean=false;
  currentIndex:number=0;
  quantity:number=1;

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

 
  addToCart():void{
    const data={
      Product_id:this.item.id,
      User_id:1,
      Quantity:this.quantity
    }
    this.dataService.addToBasket(data).subscribe({
      next: (response) => {
       console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  clickImage():void{
    this.isBlur=true;
  }
  removeSlider():void{
    this.isBlur=false;
  }
  clickArrow(side: string) {
    if (side === 'left') {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    } else if (side === 'right') {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }
  }

  clickSlide(index: number) {
    this.currentIndex = index;
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.maincategory = params.get('category');
      this.id = Number(params.get('id'));
      this.childcategory= params.get('childcategory');
      this.productdescription=params.get('description')
    });
    console.log(this.route.params);
    

    this.dataService.getProductDescription(this.id).subscribe({
      next: (response) => {
        this.item = response;
        console.log(this.item);
        console.log(response);
        this.images=response.image_path;

      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  beforetext:string='';
  aftertext:string='';
  getDescriptionParts(): { before: string, after: string } {
    const fullText = this.item.full_Description;
    const keyword = "შეთავაზებაში შედის";

    const keywordIndex = fullText.indexOf(keyword);

    if (keywordIndex === -1) {
      return { before: fullText, after: '' };
    }

    const before = fullText.substring(0, keywordIndex);
    const after = fullText.substring(keywordIndex + keyword.length);

    return { before, after };
  }
}
