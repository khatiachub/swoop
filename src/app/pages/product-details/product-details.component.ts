import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  userid=1;
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

  isVisible:boolean=false;
  isHiding = false;

  addToCart():void{
    const newQuantity = this.dataService.getCartQuantity() + this.quantity;
    this.dataService.updateCartQuantity(newQuantity);

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
    this.quantity=1;
    this.isVisible = true; 

    setTimeout(() => {
      this.isHiding = false; // Now trigger slide-in
    }, 10);
    setTimeout(() => {
      this.isHiding = true; // Start sliding out
      setTimeout(() => {
        this.isVisible = false; // Remove from DOM after sliding out
      }, 500); // Wait for slide-out animation to finish
    }, 3000); // Slide out after 3 seconds
  
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
  keywords:string[]=["შეთავაზებაში შედის:","მენიუ:"];
  matchedKeyword='';
  getDescriptionParts(): { before: string, after: string } {
    const fullText = this.item.full_Description;

    let keywordIndex = -1;

    for (const keyword of this.keywords) {
      keywordIndex = fullText.indexOf(` ${keyword} `); 
      if (keywordIndex === -1) {
          if (fullText.startsWith(`${keyword} `)) {
              keywordIndex = 0;
          } else if (fullText.endsWith(` ${keyword}`)) {
              keywordIndex = fullText.length - keyword.length;
          }
      }

      if (keywordIndex !== -1) {
          this.matchedKeyword = keyword;
          break;
      }
  }

    if (keywordIndex === -1) {
      return { before: fullText.trim(), after: '' };
  }

  // Split the text based on the matched keyword
  const before = fullText.substring(0, keywordIndex).trim();
  const after = fullText.substring(keywordIndex + this.matchedKeyword.length).trim();
  return { before, after };
}
}
