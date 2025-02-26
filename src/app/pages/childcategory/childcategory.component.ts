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
  childCategoryName:string|null='';
  locationId:number|null|string='';
  guestId:number|null|string='';
  minPrice:number|null|string='';
  maxPrice:number|null|string='';
  categories:any[]=[];
  locations:any[]=[];
  guestNumber:any[]=[];
  fileteredItems:any[]=[];
  isLocation:boolean=false;
  isCategory:boolean=false;
  isGuestNumber:boolean=false;
  isPrice:boolean=false;
  childname!:string|null;
  location_Id:number|null=0;
  selectedItems:any[]=[];
  selectedLocations:any[]=[];
  history_id!:number;

  navigateToChild(categoryname: string,firstchild:string, id: number,secchild:string): void {
    this.router.navigate(
      [`productdetails/${categoryname}/${firstchild}/${id}/${secchild}`],
      { state: { id: id } }
    );
    console.log('dhddhdh');
    console.log(id);
    
    
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      this.category = params.get('category');
      this.childname= params.get('childcategory');
    });
    this.history_id=history.state.id;


console.log(this.id);


    const params :{ [key: string]: string | number | boolean }= {
      child_name: this.childname || '', 
    };
    const filteredParams = Object.keys(params)
    .filter((key) => params[key] !== '') // Remove undefined or empty values
    .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {});
    
    this.dataService.getFilteredItems(this.id,this.category,filteredParams).subscribe({
      next: (response) => {
        // if((this.isLocation&&this.isGuestNumber)||(this.isCategory&&this.isGuestNumber)||(this.isLocation&&this.isCategory)||(this.isLocation&&this.isGuestNumber&&this.isCategory)){
          // const uniqueItems:any[] = [];
          //   const seenSecChildNames = new Set<string>();
          //   response.forEach((item: { sec_child_name: string }) => {
          //     if (!seenSecChildNames.has(item.sec_child_name)) {
          //       uniqueItems.push(item); 
          //       seenSecChildNames.add(item.sec_child_name); 
          //       this.selectedItems=[...uniqueItems]
          //     }
          //   });
          console.log(response);
          
            this.items=response;
            
        // }  else{
          // this.selectedItems=response;
        // }    
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
  
  isValid!: boolean;
  selectedGuest: any[] = [];
  isGuestSelected: boolean = false;
  isLocationSelected: boolean = false;
  GuestId: number[] = [];
  locArray: any[] = [];
  filteredValue: { location_id?: number; guest_id?: number } = {};
  params: any={};
  unSelected!: boolean;
  uniqueItems: any[] = [];
  LocId: any[] = [];
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
      this.params.locationId =loc.id;
      this.applyFilters()

    } else {
      delete this.filteredValue.location_id;
      selectedLocations.forEach((item) => (this.params.locationId = item.id))
      delete this.params.locationId;
      const index = this.selectedItems.findIndex(item => item.location_id === loc.id);
      const locindex = this.LocId.findIndex(item => item === loc.id);

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

      console.log(filteredParams);
      console.log(this.params);
      
      
    // Fetch filtered data
    this.dataService.getFilteredItems(this.id, this.category, filteredParams).subscribe({
      next: (response) => {
        this.selectedLocations.forEach((loc: { id: number; }) => (this.LocId.push(loc.id)))
        console.log(response);
        this.isValid = this.selectedItems.some((item) => {
          return item.price>=this.min_Price&&item.price<=this.max_Price&& this.LocId.includes(item.location_id) && this.isLocation;
        });


        if (this.isLocation && this.isPrice && this.isValid) {
          Array.isArray(response)&& response.filter((item: {price: number;  location_id: any; }) => (item.price>=this.min_Price&&item.price<=this.max_Price) && this.LocId.includes(item.location_id))
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
          console.log(uniqueItems);
          
        }
       
        
        else if (this.isLocation && this.isPrice && !this.isValid&&response.message) {
          console.log('prrrrr');
          this.selectedItems = [];
          this.uniqueItems=[];
          console.log(this.selectedItems);
          
        } else if (!this.isPrice && !this.isLocation) {
          this.selectedItems = this.items
        }
        else if (this.isPrice || this.isLocation) {
          if(Array.isArray(response)&&this.isLocation){
            response.forEach((item: any) => (this.selectedItems.push(item))) ;
            console.log('ssssssssssggggggggggg');
                       
          }
          if(this.isPrice&&!this.isLocation){
           if(response.message==='No categories found matching the criteria.'){
            this.selectedItems=[];
            console.log('ddddd');
            
           }else{
            this.selectedItems=response;
            console.log('rrrrrrrrr');
            console.log(this.selectedItems);
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
     (this.isLocation || this.isPrice)
      ? this.selectedItems
      : 
       this.items  
  }
  
}
