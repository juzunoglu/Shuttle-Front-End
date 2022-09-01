import {Component, OnInit} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  // @ts-ignore
  registerForm: FormGroup;
  public showPassword: boolean = false;


  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private readonly router: Router,
  ) {
  }

  ngOnInit(): void {
    this.initializeRegisterForm();
  }

  private initializeRegisterForm(): void {
    this.registerForm = this.fb.group({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(25)
      ])
    });
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public onAlreadyRegistered() {
    this.router.navigate(['/login'])
  }

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  onSubmit(): void {
    this.authService.register(this.username?.value, this.email?.value, this.password?.value).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}
