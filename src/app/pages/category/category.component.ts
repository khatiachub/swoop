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
  childCategoryName: string | null = '';
  locationId: number | null | string = '';
  guestId: number | null | string = '';
  minPrice: number | null | string = '';
  maxPrice: number | null | string = '';
  categories: any[] = [];
  locations: any[] = [];
  guestNumber: any[] = [];
  fileteredItems: any[] = [];
  isCategory: boolean = false;
  isPrice: boolean = false;
  isLocation = false;
  isNumber = false;
  guestArray: any[] = [];
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      this.category = params.get('category');
    });
    
    //this.dataService.getFilteredItems(this.category,this.id,this.childCategoryName,this.locationId,this.guestId,this.minPrice,this.maxPrice).subscribe({
    this.dataService.getCategory(this.category, this.id).subscribe({
      next: (response) => {
        // const seenCategories = new Set<string>();
        // const updatedData = response.map((item: { category_name: string; image: string }) => {
        //   if (seenCategories.has(item.category_name)) {
        //     return { ...item, category_name: "" };
        //   } else {
        //     seenCategories.add(item.category_name);
        //     return item;
        //   }
        // });
        this.items =response
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
        this.locations = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.dataService.getGuestNumber().subscribe({
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
  clickGuestNumber(guest: any, selectedGuest: any[]): void {
    const isSelected = selectedGuest.some((item: { id: number }) => item.id === guest.id);
    if (isSelected) {
      this.filteredValue.guest_id = guest.id;
      this.params = {
        ...this.params,
        guestId: guest.id
      }
      this.applyFilters()
    } else {
      delete this.filteredValue.guest_id; // Remove filter if unchecked
      selectedGuest.forEach((item) => (this.params.guest_id = item.id))
      const index = this.selectedItems.findIndex(item => item.guest_id === guest.id);
      const numindex = this.GuestId.findIndex(item => item === guest.id);

      if (index === -1) {
        return
      } else {
        this.selectedItems = [
          ...this.selectedItems.slice(0, index),
          ...this.selectedItems.slice(index + 1),
        ];
        this.GuestId = [
          ...this.GuestId.slice(0, numindex),
          ...this.GuestId.slice(numindex + 1),
        ];
      }
    // this.applyFilters();
    }


    guest.isSelected = isSelected;
    this.isNumber = !selectedGuest.every((item: {
      isSelected: boolean; id: any;
    }) => item.id === guest.id && item.isSelected === false);

    this.uniqueItems=[];

  }


  isValid!: boolean;
  selectedLocations: any = [];
  selectedGuest: any[] = [];
  selectedItems: any[] = [];
  isGuestSelected: boolean = false;
  isLocationSelected: boolean = false;
  GuestId: number[] = [];
  locArray: any[] = [];
  filteredValue: { location_id?: number; guest_id?: number } = {};
  params:any={};
  unSelected!: boolean;
  uniqueItems: any[] = [];
  selectedPrice!:any;
  min_Price!:number;
  max_Price!:number;

  onPriceChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedPrice = inputElement.value;
    console.log(this.selectedPrice);
    const [minPrice, maxPrice] = this.selectedPrice.split('-');
    this.min_Price = parseInt(minPrice, 10);
    this.max_Price = parseInt(maxPrice, 10);
    this.params.priceMin=this.min_Price;
    this.params.priceMax=this.max_Price;
    if(this.selectedPrice){
      this.isPrice=true;
    }
    this.applyFilters();

  }
  onLocationChange(loc: any, selectedLocations: any[]) {
    this.selectedLocations.forEach((loc: { id: number; }) => (this.LocId.push(loc.id)))
    this.selectedGuest.forEach((guest) => (this.GuestId.push(guest.id)))

    const isSelected = selectedLocations.some((item: { id: number }) => item.id === loc.id);
    if (isSelected) {
      this.filteredValue.location_id = loc.id;
      this.params.locationId=loc.id;

      this.applyFilters()

    } else {
      delete this.filteredValue.location_id;
      selectedLocations.forEach((item) => (this.params.locationId = item.id))
      delete this.params.locationId;
      const index = this.selectedItems.findIndex(item => item.location_id === loc.id);
      const locindex = this.LocId.findIndex(item => item === loc.id);
      console.log('dgdgdgdgdg');

      if (index === -1) {
        return
      } else {
        this.selectedItems = [
          ...this.selectedItems.slice(0, index),
          ...this.selectedItems.slice(index + 1),
        ];
        this.LocId = [
          ...this.LocId.slice(0, locindex),
          ...this.LocId.slice(locindex + 1),
        ];
      }
      this.applyFilters();

    }
    loc.isSelected = isSelected;
    this.isLocation = !selectedLocations.every((item: {
      isSelected: boolean; id: any;
    }) => item.id === loc.id && item.isSelected === false);
    this.uniqueItems=[]
    console.log(this.selectedItems);


  }

  private applyFilters(): void {
    const filteredParams = Object.keys(this.params)
      .filter((key) => this.params[key] != null)
      .reduce((acc, key) => ({ ...acc, [key]: this.params[key] }), {});

    // Fetch filtered data
    this.dataService.getFilteredItems(this.id, this.category, filteredParams).subscribe({
      next: (response) => {
        this.selectedLocations.forEach((loc: { id: number; }) => (this.LocId.push(loc.id)))
        this.selectedGuest.forEach((guest) => (this.GuestId.push(guest.id)))
        console.log(response);
        this.isValid = this.selectedItems.some((item) => {
          let isValid = true;
        
          // Check if price filter is selected
          if (this.min_Price !== undefined && this.max_Price !== undefined) {
            isValid = isValid && item.price >= this.min_Price && item.price <= this.max_Price;
          }
        
          // Check if guest number filter is selected
          if (this.GuestId.length > 0) {
            isValid = isValid && this.GuestId.includes(item.guest_id);
          }
        
          // Check if location filter is selected
          if (this.LocId.length > 0) {
            isValid = isValid && this.LocId.includes(item.location_id);
          }
        
          // Check additional conditions (e.g., isNumber and isLocation)
          if (this.isNumber !== false) {
            isValid = isValid && this.isNumber;
          }
          if (this.isLocation !== false) {
            isValid = isValid && this.isLocation;
          }
        
          return isValid;
        });
        


        if (((this.isLocation && this.isNumber)||(this.isLocation&&this.isPrice)||(this.isNumber&&this.isPrice) ||(this.isLocation&&this.isNumber&&this.isPrice))&& this.isValid) {
          Array.isArray(response)&& response.filter((item: { guest_id: number; location_id: any; }) => (this.GuestId.includes(item.guest_id) && this.LocId.includes(item.location_id)))
          console.log('sssssssss');
          const uniqueItems: any[] = [];
          const seenSecChildNames = new Set<string>();
          Array.isArray(response)&&response.forEach((item: any) => {
            if (!seenSecChildNames.has(item.sec_child_name)) {
              uniqueItems.push(item);
              seenSecChildNames.add(item.sec_child_name);
            }
            this.uniqueItems.push(item);
            // this.selectedItems.push(item);
            this.uniqueItems = [...this.uniqueItems];
          });
          console.log(this.selectedItems);

console.log(this.isValid);

        }
       
        
        else if ((this.isLocation && this.isNumber)||(this.isLocation&&this.isPrice)||(this.isNumber&&this.isPrice) ||(this.isLocation&&this.isNumber&&this.isPrice) && !this.isValid&&response.message) {
          console.log('prrrrr');
          this.selectedItems = [];
          console.log(this.params);
          
        } else if (!this.isNumber && !this.isLocation&&!this.isPrice) {
          this.selectedItems = this.items
        }
        else if (this.isNumber || this.isLocation||this.isPrice) {
          if(Array.isArray(response)&&(this.isLocation||this.isNumber)){
            response.forEach((item: any) => (this.selectedItems.push(item))) ;
            console.log('ssssssssssggggggggggg');
                       
          }
          if(this.isPrice&&!this.isLocation&&!this.isNumber){
           if(response.message==='No categories found matching the criteria.'){
            this.selectedItems=[];
            console.log('ddddd');
            
           }else{
            this.selectedItems=response;
            console.log(this.selectedItems);
            
            console.log('rrrrrrrrr');
           }
          }

        }

      },
      error: (err) => {
        console.error('Error fetching filtered items:', err);
      },
    });
  }
  getDisplayedItems() {
    
    return this.uniqueItems.length>0
    ?
    this.uniqueItems:
     (this.isLocation || this.isNumber||this.isPrice)
      ? this.selectedItems
      : 
       this.items  
  }


}


