import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataserviceService } from '../../core/dataservice.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  searchQuery: string = '';
  
  constructor(private dataService: DataserviceService, private route: ActivatedRoute, private router: Router) { }
  id!: number | null;
  category!: string | null;
  items: any[] = [];
  url = "http://localhost:5257/";

  categories: any[] = [];
  locations: any[] = [];
  guestNumber: any[] = [];
  filteredProducts: any[] = [];
  products: any[] = [];
  selectedLocations: any = [];
  selectedGuest: any[] = [];
  selectedPrice!: any;
  price_array:string[]=["0 - 100","100 - 200","200 - 300","300 - 500"," 500 - 1000", "1000 - დან"];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'] || '';
    });
    this.dataService.getSearchedProducts(this.searchQuery).subscribe({
      next: (response) => {
        this.products = response;
        this.filteredProducts = [...this.products];
        response.forEach((item: { main_category_id: number | null; })=>(this.id=item.main_category_id))
        console.log(this.id);
        
        this.dataService.getLocations(this.id).subscribe({
          next: (response) => {            
            response.map((loc: { isSelected: any; }) => (loc.isSelected = false))
            const seenLocations = new Set<string>();
            const data = response.map((item: { location: string }) => {
              if (seenLocations.has(item.location)) {
                return { ...item, location: "" };
              } else {
                seenLocations.add(item.location);
                return item;
              }
            });
            const filtereddata = data.filter((item: { location: string; }) => (item.location !== ''))
            this.locations = filtereddata;
    
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      
      error: (error) => {
        console.log(error);
      },
    });
  }

  navigateToProduct(categoryname: string, firstchild: string, id: number, secchild: string): void {
    this.router.navigate(
      [`productdetails/${categoryname}/${firstchild}/${id}/${secchild}`],
      { state: { id: id } }
    );
  }

  selectedGuests: any[] = [];
  LocId: any[] = [];

  onPriceChange(): void {
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
        this.selectedLocations.some((loc: {
          location: any; id: any;
        }) => product.location === (loc.location));

      const matchesGuest =
        this.selectedGuest.length === 0 ||
        this.selectedGuest.some(g => product.guest_id === (g.id));

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


