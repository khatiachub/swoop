import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { FilteredItemsComponent } from './pages/filtered-items/filtered-items.component';
import { ChildcategoryComponent } from './pages/childcategory/childcategory.component';
import { CartComponent } from './pages/cart/cart.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';

const routes: Routes = [
  {path:'',component:HomeComponent,runGuardsAndResolvers: 'always'},
  {path:'category/:id/:category',component:CategoryComponent,runGuardsAndResolvers: 'always'},
  {path:'category/:id/:category/:childcategory',component:ChildcategoryComponent,runGuardsAndResolvers: 'always'},
  {path:'productdetails/:category/:childcategory/:id/:description',component:ProductDetailsComponent},
  {path:'cart/:id',component:CartComponent},
  {path:'search',component:SearchResultsComponent},
  {path:'register',component:RegisterComponent},
  {path:'login',component:LoginComponent},
  {path:'userdetails/:id',component:UserDetailsComponent}
]
@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
