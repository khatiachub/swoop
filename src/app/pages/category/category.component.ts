import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../core/dataservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  constructor(private dataService: DataserviceService, private route: ActivatedRoute, private router: Router) { }

  id!: number | null;
  category!: string | null;
  items: any[] = [];
  url = "http://localhost:5257/";
  
  categories: any[] = [];
  locations: any[] = [];
  guestNumber: any[] = [];
  filteredProducts:any[]=[];
  products:any[]=[];
  selectedLocations: any = [];
  selectedGuest: any[] = [];
  selectedPrice!:any;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      this.category = params.get('category');
    });
    
    
    this.dataService.getFilteredItems(this.id,this.category).subscribe({
      next: (response) => {
      this.products=response;
       this.filteredProducts=[...this.products]
        console.log(this.filteredProducts);
        
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.dataService.getChildCategories(this.id).subscribe({
      next: (response) => {
        this.categories = response;

      },
      error: (error) => {
        console.log(error);
      },
    });

    this.dataService.getLocations(this.id).subscribe({
      next: (response) => {
        response.map((loc: { isSelected: any; }) => (loc.isSelected = false))
         const seenLocations = new Set<string>();
         const data=response.map((item: { location:string }) => {
          if (seenLocations.has(item.location)) {
            return { ...item, location: "" };
          } else {
            seenLocations.add(item.location);
            return item;
          }
        });
        const filtereddata=data.filter((item: { location: string; })=>(item.location!==''))
        this.locations =filtereddata;

      },
      error: (error) => {
        console.log(error);
      },
    });
    this.dataService.getGuestNumber(this.id).subscribe({
      next: (response) => {
        response.map((guest: { isSelected: any; }) => (guest.isSelected = false))
        this.guestNumber = response;

      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  navigateToProduct(categoryname:string,firstchild:string, id: number,secchild:string): void {
    this.router.navigate(
      [`productdetails/${categoryname}/${firstchild}/${id}/${secchild}`],
      { state: { id: id } }
    );    
    console.log(categoryname,firstchild,id,secchild);
    console.log(categoryname);
    
    
  }

  navigateToChild(childname: string, id: number): void {
    this.router.navigate(
      [`category/${this.id}/${this.category}/${childname}`],
      { state: { id: id } }
    );
  }
  selectedGuests: any[] = [];
  LocId: any[] = [];
 
  onPriceChange(event: Event): void {
    this.filterProducts();

  }
  onLocationChange() {
    this.filterProducts();
  }
  clickGuestNumber(): void {
    this.filterProducts();
  }
  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesLocation =
        this.selectedLocations.length === 0 ||
        this.selectedLocations.some((loc: { id: any; }) => product.location_id===(loc.id));

      const matchesGuest =
        this.selectedGuest.length === 0 ||
        this.selectedGuest.some(g => product.guest_id===(g.id));

      let matchesPrice = true;
      if (this.selectedPrice) {
        const [minPrice, maxPrice] = this.selectedPrice.split('-').map(Number);
        matchesPrice = maxPrice
          ? product.price >= minPrice && product.price <= maxPrice
          : product.price >= minPrice;
      }

      return matchesLocation && matchesGuest && matchesPrice;
    });
  }

  getDisplayedItems() {
    return this.filteredProducts;
  }
}


