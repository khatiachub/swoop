import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../core/dataservice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-childcategory',
  templateUrl: './childcategory.component.html',
  styleUrl: './childcategory.component.css'
})
export class ChildcategoryComponent implements OnInit {
  constructor(private dataService: DataserviceService,private route:ActivatedRoute,private router:Router) {}
  id!:number|null;
  category!:string|null;
  items:any[]=[];
  url="http://localhost:5257/";
  
  categories:any[]=[];
  locations:any[]=[];
  guestNumber:any[]=[];
  childname!:string|null;
  selectedLocations:any[]=[];
  history_id!:number;
  selectedGuest: any[] = [];
  selectedPrice!:any;
  products:any[]=[];
  filteredProducts:any[]=[];

  navigateToChild(categoryname: string,firstchild:string, id: number,secchild:string): void {
    this.router.navigate(
      [`productdetails/${categoryname}/${firstchild}/${id}/${secchild}`],
      { state: { id: id } }
    ); 
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      this.category = params.get('category');
      this.childname= params.get('childcategory');
    });
    this.history_id=history.state.id;

    
    this.dataService.getFilteredItems(this.id,this.category).subscribe({
      next: (response) => {            
         this.products=response;
         this.filteredProducts=[...this.products]
      },
      error: (error) => {
        console.log(error);   
      },      
    });

    const idParams :{ [key: string]: string | number | boolean }= {
      Id: this.history_id|| '',
    };
    const filteredIdParams = Object.keys(idParams)
    .filter((key) => idParams[key] !== '')
    .reduce((acc, key) => ({ ...acc, [key]: idParams[key] }), {});
    this.dataService.getFilteredLocations(this.id,filteredIdParams).subscribe({
      next: (response) => {
        console.log(response);
        
        this.locations=response ;    
        console.log(this.locations);
              
      },
      error: (error) => {
        console.log(error);   
      },
    });
  }
  
  onPriceChange(event: Event): void {
    this.filterProducts();

  }
  onLocationChange() {
    this.filterProducts();
  }
   
  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesLocation =
        this.selectedLocations.length === 0 ||
        this.selectedLocations.some((loc: { id: any; }) => product.location_id===(loc.id));
      let matchesPrice = true;
      if (this.selectedPrice) {
        const [minPrice, maxPrice] = this.selectedPrice.split('-').map(Number);
        matchesPrice = maxPrice
          ? product.price >= minPrice && product.price <= maxPrice
          : product.price >= minPrice;
      }

      return matchesLocation && matchesPrice;
    });
  }
  getDisplayedItems() {
    return this.filteredProducts;
  }
  
}
