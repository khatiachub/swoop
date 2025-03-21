import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { DataserviceService } from '../../core/dataservice.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit  {
  constructor(private cdRef: ChangeDetectorRef,private dataService: DataserviceService, private route: ActivatedRoute, private router: Router) {
    
   }

  categories:any[]=[];
  childCategories:any[]=[];
  categoryText:string='';
  isBlur:boolean=false;
  userid=0;
  total_quantity=0;
  added_quantity=0;
  products:any[]=[];
  url = "http://localhost:5257/";
  user:any={};
  showCategories:boolean=true;
  currentUrl='';
  currentCategoryId!: number;
  isCartClicked:boolean=false;

  ngOnInit(): void {
    const id=localStorage.getItem("id");
    this.userid=Number(id);
    console.log(this.user);
    
    this.dataService.getUser(this.userid).subscribe({
      next: (response) => {
        console.log(response);
        this.user=response.message;
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.dataService.getBasket(this.userid).subscribe({
      next: (response) => {
       console.log(response);
       response.forEach((item: { total_quantity: number; })=>(this.total_quantity=item.total_quantity))
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.dataService.cartQuantity$.subscribe((quantity) => {
      this.total_quantity= quantity;   
    });
   
    this.dataService.getCategories().subscribe({
      next: (response) => {
        this.categories=response; 
        console.log(response);
               
      },
      error: (error) => {
        console.log(error);
      },
    });
    
    this.router.events
    .pipe(
      filter(
        (event: any): event is NavigationEnd => event instanceof NavigationEnd
      )
    )
    .subscribe((event: NavigationEnd) => { 
      this.checkRoute(this.router.url,event.url);
      
    });                
  }
  private checkRoute(url: string,eventurl:string) {
    if (url.includes(`/userdetails/`) || url === "/cart"||eventurl.includes(`/userdetails/`) || url === "/cart") {
      this.showCategories = false;
    }
    else {
      this.showCategories = true;
    }
  }
  isTooltipVisible: boolean = false;

  showTooltip(id:number) {
    this.isTooltipVisible = true;
    this.dataService.getChildCategories(id).subscribe({
      next: (response) => {
       this.childCategories=response;
       response.forEach((cat: { categoryName: string; })=>(this.categoryText=cat.categoryName));
      },
      
      error: (error) => {
        console.log(error);
      },
    });
  }
 hideTooltip(){
  this.isTooltipVisible=false;
  this.isOpen=false;
  this.isBlur=false;
 }

  isOpen:boolean=false;

  getCategory(name:string,id:any):void{    
   this.router.navigateByUrl('/', { skipLocationChange: true }).then(()=> { 
    this.router.navigate([`category/${id}/${name}`]); 
  });
  }
  openAccordeon():void{
    this.isOpen=!this.isOpen;
    this.isBlur=!this.isBlur;
    this.dataService.getCategories().subscribe({
      next: (response) => {
        this.categories=response; 
        console.log(response);
               
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  navigateToChild(categoryName:string,cat_id:number,childname: string, id: number): void {
    this.router.navigate(
      [`category/${cat_id}/${categoryName}/${childname}`],
      { state: { id: id } }
    );
    this.isTooltipVisible=false;
    this.isOpen=false;
    this.isBlur=false;
  }
 
  
  value:string='';
  onSearchInput(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.value=value;
    this.dataService.getSearchedProducts(value).subscribe({
      next: (response) => {
        this.products=response;
       console.log(response);
       
      },
      
      error: (error) => {
        console.log(error);
      },
    });
  }
  
  isContainerVisible = false;
  overLay=false;

showContainer() {
  this.isContainerVisible = true;
  this.overLay=true;
  document.body.style.overflow = 'hidden'; 
}

hideContainer() {
 this.overLay=false;
 this.isCartClicked=false;
 setTimeout(() => {
  this.isContainerVisible=false;
}, 300);
 document.body.style.overflow = 'auto';
}

clickSearch():void{
  if (this.value.trim()) {
    this.router.navigate(['/search'], {
      queryParams: { query: this.value }
    });
  }  
}
@ViewChild('searchInput') searchInput!: ElementRef;

navigateToProduct(event:Event,categoryname: string, firstchild: string, id: number, secchild: string): void {
  event.stopPropagation();
  this.router.navigate(
    [`productdetails/${categoryname}/${firstchild}/${id}/${secchild}`],
    { state: { id: id } }
  );
  this.searchInput.nativeElement.value = '';
  this.products=[];
}
navigateToUser(): void {
  this.router.navigate(
    [`userdetails/${this.userid}`],
  );
}
clickCart(){
  if(this.userid){
    this.router.navigate(
      [`cart/${this.userid}`],
    );
  }else{
    this.isCartClicked=true;
    this.overLay=true;
  }
}

}
