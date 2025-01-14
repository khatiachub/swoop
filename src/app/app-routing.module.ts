import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { FilteredItemsComponent } from './pages/filtered-items/filtered-items.component';
import { ChildcategoryComponent } from './pages/childcategory/childcategory.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'category/:id/:category',component:CategoryComponent},
  {path:'category/:id/:category/:childcategory',component:ChildcategoryComponent},
  {path:'product-details/:id',component:ProductDetailsComponent}
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
