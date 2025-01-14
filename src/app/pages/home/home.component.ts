import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../core/dataservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private dataService: DataserviceService,private route:Router) {}

  categories:any[]=[];
  ngOnInit(): void {
    this.dataService.getCategories().subscribe({
      next: (response) => {
        console.log(response);
        this.categories=response
        
      },
      error: (error) => {
        console.log(error);   
      },
    });
  }

  getCategory(name:string,id:number):void{
    this.route.navigate([`category/${id}/${name}`])
  }
}
