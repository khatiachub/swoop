import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../core/dataservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'})
export class CategoryComponent implements OnInit {
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
  isCategory:boolean=false;
  isPrice:boolean=false;
  isLocation=false;
  isNumber=false;
  ngOnInit(): void {    
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      this.category = params.get('category');
    });
    //this.dataService.getFilteredItems(this.category,this.id,this.childCategoryName,this.locationId,this.guestId,this.minPrice,this.maxPrice).subscribe({
      this.dataService.getCategory(this.category,this.id).subscribe({
    next: (response) => {
        const seenCategories = new Set<string>();
        const updatedData = response.map((item: { category_name: string;image:string }) => {
          if (seenCategories.has(item.category_name)) {
            return { ...item, category_name: ""}; 
          } else {
            seenCategories.add(item.category_name);
            return item; 
          }
        });
        this.items=updatedData               
      },
      error: (error) => {
        console.log(error);   
      },
    });
    this.dataService.getChildCategories(this.id).subscribe({
      next: (response) => {
        this.categories=response;

      },
      error: (error) => {
        console.log(error);   
      },
    });

    this.dataService.getLocations().subscribe({
      next: (response) => {
        response.map((loc: { isSelected: any; })=>(loc.isSelected=false))
        this.locations=response;
      },
      error: (error) => {
        console.log(error);   
      },
    });
    this.dataService.getGuestNumber().subscribe({
      next: (response) => {
        response.map((guest: { isSelected: any; })=>(guest.isSelected=false))
       this.guestNumber=response;
       console.log(this.guestNumber);
       
      },
      error: (error) => {
        console.log(error);   
      },
    });
  }

  getDisplayedItems() {
    // console.log(this.isLocationSelected);
    
    return this.isLocation || this.isNumber    
      ? this.selectedItems
      : this.items;
  }
  
  navigateToChild(childname:string,id:number):void{    
    this.router.navigate(
      [`category/${this.id}/${this.category}/${childname}`],
      { state: { id: id } } 
    );
  }
 
  LocId:any[]=[];
  clickGuestNumber(guest:any,selectedGuest:any[]):void{    
    this.isGuestSelected = selectedGuest.some((item: { id: any; }) => item.id === guest.id);
    console.log(this.isGuestSelected);
    
    selectedGuest.forEach((item: {
      isSelected: boolean; id: any; 
  }) =>item.id === guest.id?item.isSelected=true:false);
  
  this.isNumber = !selectedGuest.every((item: { 
    isSelected: boolean; id: any; 
  }) => item.id === guest.id && item.isSelected === false);
  console.log(this.isGuestSelected);
  
    if (this.isGuestSelected) {
      const params: { [key: string]: string | number | boolean } = {
        guestId: guest.id,
      };
  
      const filteredParams = Object.keys(params)
        .filter((key) => params[key] !== '')
        .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {});
  
      this.dataService.getFilteredItems(this.id, this.category, filteredParams).subscribe({
        next: (response) => {
          if(this.isLocationSelected||this.isLocationSelected&&this.isPrice){
            const uniqueItems:any[] = [];
            const seenSecChildNames = new Set<string>();
            this.selectedLocations.forEach((loc: { id: number; })=>(this.LocId.push(loc.id)
            ))
           console.log(this.selectedLocations);
           
            response.forEach((item: {
              guest_id(guest_id: any, id: any, location_id: (guest_id: any, id: any, location_id: any, LocId: number) => any, LocId: number): any;
              location_id(guest_id: any, id: any, location_id: any, LocId: number): any; sec_child_name: string; }) => {
                const isValid = this.selectedItems.some((item) => {
                  console.log('Checking item:', item);
                  console.log('guest_id matches:', item.guest_id === guest.id);
                  console.log(item.guest_id,guest.id);
                  console.log(this.LocId);
                  
                  return item.guest_id === guest.id &&this.LocId.includes(item.location_id);
              });
              
              
              
              if (isValid) {
                // if (!seenSecChildNames.has(item.sec_child_name)) {
                //   uniqueItems.push(item); 
                //   seenSecChildNames.add(item.sec_child_name); 
                //  }
                //  this.selectedItems = [ ...uniqueItems];   
                //  console.log(this.selectedItems);
                response.forEach((items: { locationId: any; }) => {
                  if (!this.selectedItems.some((item) => item.guestId === guest.id)) {
                    this.selectedItems.push(items);  
                  }
                });  

              }else{
                console.log('dpdpdpdpdpdpdpdp');
                this.selectedItems=[];
                console.log(this.selectedItems);

              }
          });
    
          
          }else if( this.isLocationSelected&&!this.isGuestSelected){
            return
          }
        //   else if(this.isGuestSelected) {
        //     const index = this.selectedItems.findIndex(item => item.guest_id === guest.id);
        // console.log('dgdgdgdgdg');
        
        //       this.selectedItems = [
        //         ...this.selectedItems.slice(0, index),
        //         ...this.selectedItems.slice(index + 1),
        //       ];      
            
        //   }
          else{
            console.log('dddddddddddddddddd');
            
            response.forEach((items: { locationId: any; }) => {
              if (!this.selectedItems.some((item) => item.guestId === guest.id)) {
                this.selectedItems.push(items);  
              }
            });   
          }         
        },
        error: (error) => {
          console.log(error);
        },
      });
      
    } else{
      const index = this.selectedItems.findIndex(item => item.guest_id === guest.id);
        console.log('dgdgdgdgdg');
        
              this.selectedItems = [
                ...this.selectedItems.slice(0, index),
                ...this.selectedItems.slice(index + 1),
              ];      
    }
 
  }


 
selectedLocations:any=[];
selectedGuest:any[]=[];
  selectedItems: any[] = [];
  isGuestSelected:boolean=false;
  isLocationSelected:boolean=false;
GuestId:number[]=[];
onLocationChange(loc: any, selectedLocations:any[]) {
  selectedLocations.forEach((item: {
    isSelected: boolean; id: any; 
}) =>item.id === loc.id?item.isSelected=true:false);

this.isLocation = !selectedLocations.every((item: { 
  isSelected: boolean; id: any; 
}) => item.id === loc.id && item.isSelected === false);


this.isLocationSelected = selectedLocations.some((item: { 
  isSelected: boolean; id: any; 
}) => item.id === loc.id);



  console.log(this.isLocationSelected);
  console.log(this.isGuestSelected);
  
  console.log(selectedLocations);
  
  if (this.isLocationSelected) {
    const params: { [key: string]: string | number | boolean } = {
      locationId: loc.id,
    };

    const filteredParams = Object.keys(params)
      .filter((key) => params[key] !== '')
      .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {});

    this.dataService.getFilteredItems(this.id, this.category, filteredParams).subscribe({
      next: (response) => {
console.log('yesssssssss');

        if((this.isGuestSelected||this.isGuestSelected&&this.isPrice)){
          console.log('eeeeeeeeee');
          
          const uniqueItems:any[] = [];
          const seenSecChildNames = new Set<string>();
          this.selectedGuest.forEach((guest)=>(this.GuestId.push(guest.id)))
          console.log(this.GuestId);
          const isValid = this.selectedItems.some((item) => {
            console.log('Checking item:', item);
            console.log('guest_id matches:', item.guest_id === this.GuestId);
            console.log('location_Id matches:', item.location_id === this.LocId,this.LocId);
            return this.GuestId.includes(item.guest_id)&& item.location_id === loc.id;
        });
        
          response.forEach((item: { sec_child_name: string; }) => {
            if (isValid) {
              // console.log(item);
              // if (!seenSecChildNames.has(item.sec_child_name)) {
              //   uniqueItems.push(item); 
              //   seenSecChildNames.add(item.sec_child_name); 
              //  }
              //  this.selectedItems = [ ...uniqueItems];   
              // response.forEach((item: { sec_child_name: string; }) => {
                if (!this.selectedItems.some((item) => item.locationId === loc.id)) {
                  this.selectedItems.push(item);
                }
            // });
            }else{
              this.selectedItems=[];
              console.log('ffffffffffffff');
              
            }
        });
  
 console.log(this.selectedItems);
 
        
        
        }else if(!this.isLocationSelected&&this.isGuestSelected){
          console.log('sssssss');
          
             return
          
        
        }else{
          response.forEach((item: { sec_child_name: string; }) => {
            if (!this.selectedItems.some((item) => item.locationId === loc.id)) {
              this.selectedItems.push(item);
            }
        });
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  } else{
    const index = this.selectedItems.findIndex(item => item.location_id === loc.id);

            this.selectedItems = [
              ...this.selectedItems.slice(0, index),
              ...this.selectedItems.slice(index + 1),
            ];    
  }
}
}


