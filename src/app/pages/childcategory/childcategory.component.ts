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
  selectedLocations:any[]=[]
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      this.category = params.get('category');
      this.childname= params.get('childcategory');
      console.log(params);
      
    });
console.log(this.childname);



    const params :{ [key: string]: string | number | boolean }= {
      child_name: this.childname || '', 
    };
    const filteredParams = Object.keys(params)
    .filter((key) => params[key] !== '') // Remove undefined or empty values
    .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {});
    console.log(params);
    
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
            this.items=response;
console.log(response);
            
        // }  else{
          // this.selectedItems=response;
        // }    
      },
      error: (error) => {
        console.log(error);   
      },      
    });






    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.location_Id = navigation.extras.state['id']; 
    }

    const idParams :{ [key: string]: string | number | boolean }= {
      Id: this.location_Id || '',
    };
    const filteredIdParams = Object.keys(idParams)
    .filter((key) => idParams[key] !== '')
    .reduce((acc, key) => ({ ...acc, [key]: idParams[key] }), {});
    this.dataService.getFilteredLocations(filteredIdParams).subscribe({
      next: (response) => {
        this.locations=response   
      },
      error: (error) => {
        console.log(error);   
      },
    });
  }
  getDisplayedItems() {
    return this.isLocation || this.isPrice|| this.isGuestNumber
      ? this.selectedItems
      : this.items;
  }
  


  onLocationChange(loc: any, selectedLocations:any[]) {
    this.isLocation=true;
      const isSelected = selectedLocations.some((item: { id: any; }) => item.id === loc.id);
      
      if (isSelected) {
        const params: { [key: string]: string | number | boolean } = {
          locationId: loc.id,
        };
    
        const filteredParams = Object.keys(params)
          .filter((key) => params[key] !== '')
          .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {});
    
        this.dataService.getFilteredItems(this.id, this.category, filteredParams).subscribe({
          next: (response) => {
           
            response.forEach((item: { sec_child_name: string; }) => {
              if (!this.selectedItems.some((item) => item.locationId === loc.id)) {
                this.selectedItems.push(item);
              }
          });
    console.log(this.selectedItems);
    
          },
          error: (error) => {
            console.log(error);
          },
        });
      } else {
        const index = this.selectedItems.findIndex(item => item.location_id === loc.id);
    
        if (!isSelected) {
          this.selectedItems = [
            ...this.selectedItems.slice(0, index),
            ...this.selectedItems.slice(index + 1),
          ];      
        }
      }
      
      
    }
}
