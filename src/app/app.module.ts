import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { provideClientHydration  } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthInterceptor } from './core/interceptor';
import { FilteredItemsComponent } from './pages/filtered-items/filtered-items.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { CheckboxModule } from 'primeng/checkbox';
import { ChildcategoryComponent } from './pages/childcategory/childcategory.component';
import { CartComponent } from './pages/cart/cart.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CategoryComponent,
    ProductDetailsComponent,
    HeaderComponent,
    FooterComponent,
    FilteredItemsComponent,
    ChildcategoryComponent,
    CartComponent,
    SearchResultsComponent,
    RegisterComponent,
    LoginComponent,
    UserDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CheckboxModule,
    ReactiveFormsModule
  ],

  providers: [provideClientHydration(),provideHttpClient(),
  provideHttpClient(withInterceptors([AuthInterceptor])) ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
