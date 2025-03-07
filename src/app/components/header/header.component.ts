import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../core/dataservice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit  {
  constructor(private dataService: DataserviceService, private route: ActivatedRoute, private router: Router) { }

  categories:any[]=[];
  childCategories:any[]=[];
  categoryText:string='';
  isBlur:boolean=false;
  userid=1;
  total_quantity=0;
  added_quantity=0;
  ngOnInit(): void {
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
   
  }
  isTooltipVisible: boolean = false;

  showTooltip(id:number) {
    this.isTooltipVisible = true;
    this.dataService.getChildCategories(id).subscribe({
      next: (response) => {
       this.childCategories=response;
       response.forEach((cat: { categoryName: string; })=>(this.categoryText=cat.categoryName));
       console.log(response);
       
      },
      
      error: (error) => {
        console.log(error);
      },
    });
  }


  isOpen:boolean=false;

  openAccordeon():void{
    this.isOpen=!this.isOpen;
    this.isBlur=!this.isBlur;
    this.dataService.getCategories().subscribe({
      next: (response) => {
        this.categories=response;
        console.log(this.categories);
        
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
 
  clickBlur():void{
    this.isBlur=false;
    this.isOpen=false;
    this.isTooltipVisible=false;
  }
}
