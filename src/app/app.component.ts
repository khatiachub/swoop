import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { filter } from 'rxjs';
NavigationEnd
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'swoop';
  constructor( private route: ActivatedRoute, private router: Router) { }
  currentRoute: string='';
 showHeder:boolean=false;
  ngOnInit(): void {
   
    this.router.events
    .pipe(
      filter(
        (event: any): event is NavigationEnd => event instanceof NavigationEnd
      )
    )
    .subscribe((event: NavigationEnd) => {
      if(event.url==='/login'||event.url==='/register'){
      this.showHeder=false;
    }else{
      this.showHeder=true;
    }
    });

  
  
  }
  
}
