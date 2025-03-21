import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../core/dataservice.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  constructor(private dataService: DataserviceService, private route: ActivatedRoute, private router: Router) { }
  userid: null | number = null;
  role: string | null = '';
  user: any;
  categories: any[] = [];
  childCategories: any[] = [];
  categoryName: string = '';
  childCategoryName: string = '';
  category_id: number = 0;
  childCategory: boolean = false;
  selectCategories:any[]=[];
  selectedChildCategories:any[]=[];
  selectedChildCategory='';
  updateProfile = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required])
  });
  ngOnInit(): void {
    const id = localStorage.getItem("id");
    this.role = localStorage.getItem("role");
    this.userid = Number(id);
    console.log(this.userid);
console.log(this.role);

    this.dataService.getUser(this.userid).subscribe({
      next: (response) => {
        console.log(response);
        this.user = response.message;
        this.updateProfile.patchValue({
          name: this.user.name,
          lastname: this.user.lastName,
          email: this.user.email,
          mobile: this.user.mobile
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
    
    this.dataService.getCategories().subscribe({
      next: (response) => {
        console.log(response);
        this.selectCategories=response
        this.categories = response;
        this.categories.forEach((item) => (
          this.dataService.getChildCategories(item.id).subscribe({
            next: (childResponse) => {
            childResponse.forEach((child: { category_ID: any; firstChildName: any; })=>(
              child.category_ID===item.id?item.firstChildName=childResponse:null
            ))            
            },
            error: (error) => {
              console.log(error);
            },
          })
        ))

      },
      error: (error) => {
        console.log(error);
      },
    });
    console.log(this.categories);

  }
  expandedCategories: Set<number> = new Set();

  selectedLocations:any[]=[];
  selectedGuests:any[]=[];
  selectedLocation='';
  selectedGuest='';
  selectedCategory='';
  productName='';
  description='';
  price=null;
  contact=null;
  vaucher=null;
  sale=null;
  title='';
  offerin='';
  pricein='';
  menu='';
  womenzone='';
  menzone='';
  clinicconcept='';
  addinfo='';
  athotel='';

  onLocationChange(event:Event){

  }
  onGuestChange(event:Event){

  }
  onCategoryChange(event:Event){
   const id= Number(this.selectedCategory)
   this.dataService.getLocations(id).subscribe({
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
      this.selectedLocations = filtereddata;

    },
    error: (error) => {
      console.log(error);
    },
  });
    this.dataService.getGuestNumber(id).subscribe({
      next: (response) => {
        this.selectedGuests=response
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.dataService.getChildCategories(Number(this.selectedCategory)).subscribe({
      next: (response) => {
        console.log(response);
        this.selectedChildCategories=response;
      },
      error: (error) => {
        console.log(error);
      },
    });
    
  }
 files: number[] = [0]; 
selectedFiles: any[] = [];

addFile() {
  this.files.push(this.files.length); 
}

onFileSelect(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFiles[index] = input.files[0]; 
  }
  console.log("Selected Files:", this.selectedFiles);
}
images:any[]=[];
showWindow=false;

addProduct(){  
  const formData = new FormData();
    
  formData.append("product_name", this.productName);
  formData.append("contact", String(this.contact));
  formData.append("price", String(this.price));
  formData.append("location", this.selectedLocation);
  formData.append("guests", this.selectedGuest);
  formData.append("vaucher",String(this.vaucher));
  formData.append("sale", String(this.sale));
  formData.append("title", this.title);
  formData.append("offerin", this.offerin)
  formData.append("description", this.description)
  formData.append("menzone", this.menzone);
  formData.append("womenzone", this.womenzone);
  formData.append("addinfo", this.addinfo);
  formData.append("athotel", this.athotel);
  formData.append("pricein", this.pricein);
  formData.append("clinicconcept", this.clinicconcept);
  formData.append("menu", this.menu);
  this.selectedFiles.forEach((file: File) => {
    formData.append("Image_path", file);
  });
    
  this.dataService.addProduct(formData,Number(this.selectedChildCategory)).subscribe({
    next: (response) => {
      console.log(response);
      this.productName='';
      this.contact=null;
      this.price=null;
      this.selectedLocation='';
      this.selectedGuest='';
      this.vaucher=null;
      this.sale=null;
      this.title='';
      this.offerin='';
      this.pricein='';
      this.description='';
      this.womenzone='';
      this.menzone='';
      this.menu='';
      this.addinfo='';
      this.athotel='';
      this.selectedFiles=[];
      this.showWindow=true;
      setTimeout(() => {
        this.showWindow = false;
      }, 3000);      
    },
    error: (error) => {
      console.log(error);
    },
  });

  
}
 
  toggleChildren(categoryId: number) {
    if (this.expandedCategories.has(categoryId)) {
      this.expandedCategories.delete(categoryId);
    } else {
      this.expandedCategories.add(categoryId);
    }
  }
  
  isExpanded(categoryId: number): boolean {
    return this.expandedCategories.has(categoryId);
  }

  LogOut() {
    localStorage.clear();
    this.router.navigate(['/']).then(() => {
      window.location.reload(); 
    });  }
  onSubmit(): void {
    console.log(this.updateProfile.value);

    this.dataService.updateUser(this.userid, this.updateProfile.value).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  childName='';
  addChilds(category:string,id:number){
    const data={
      categoryName:category,
      firstChildName:this.childName,
      category_ID:id
    }
    this.categories.forEach(element => {
      if (!element.firstChildName) {
        element.firstChildName = []; 
      }
      element.firstChildName.push(data);
    });
    
    this.dataService.addCategoryChild(data).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
    
  }
  addCategories() {
    const data = {
      categoryName: this.categoryName
    }
    this.categories.push({ categoryName: data.categoryName });

    this.dataService.addCategories(data).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
