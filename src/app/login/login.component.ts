import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {TokenStorageService} from '../_services/token-storage.service';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage: string | undefined;
  roles: string[] = [];

  public showPassword: boolean = false;


  // @ts-ignore
  loginForm: FormGroup;

  constructor(private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private fb: FormBuilder,
              private router: Router
  ) {

  }

  ngOnInit(): void {
    this.initializeLoginForm();
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.navigateWhenLoggedIn();
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  navigateWhenLoggedIn() {
    this.router.navigate(['/home'])
  }

  private initializeLoginForm(): void {
    this.loginForm = this.fb.group({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(25)
      ])
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    this.authService.login(this.username?.value, this.password?.value).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}
