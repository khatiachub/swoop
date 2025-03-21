import { Component } from '@angular/core';
import { DataserviceService } from '../../core/dataservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private fb: FormBuilder,private dataService: DataserviceService, private route: ActivatedRoute, private router: Router) { }

  loginForm = new FormGroup({
      password: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required]),
    });
  ngOnInit(): void {
    
  }


  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }else{
      this.dataService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log(response);
          localStorage.setItem("token",response.token);
          localStorage.setItem("id",response.id);
          localStorage.setItem("role",response.role);
          this.router.navigate([`/`],);
        },
        error: (error) => {
          console.log(error);
        },
      });
    }

    
    
  }
}
