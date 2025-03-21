import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../core/dataservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Password } from 'primeng/password';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  constructor(private fb: FormBuilder, private dataService: DataserviceService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {

  }

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    role_id: new FormControl(2, [Validators.required]),
    email: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required])
  });

  onSubmit(): void {
    const password = this.registrationForm.value.password;
    const confirmpassword = this.registrationForm.value.confirmPassword;
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    } else if (password !== confirmpassword) {
      console.log('mismatch');
      return
    } else {
      this.dataService.register(this.registrationForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(
            [`login/`]
          );
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
}