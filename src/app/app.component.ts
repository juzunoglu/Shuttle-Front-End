//app.component.ts

import {Component, OnInit} from '@angular/core';
import {ConfirmationDialogService} from "./service/confirmation-dialog.service";
import {TokenStorageService} from "./_services/token-storage.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isComing: boolean = false;
  visible: boolean = true
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private tokenStorageService: TokenStorageService
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
      this.username = user.username;
    }
  }

  logOut(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  public openConfirmationDialog() {
    this.confirmationDialogService.confirm('Please respond', 'Will you be using the shuttle service tomorrow ?')
      .then((isComing) => {
        console.log('The User isComing:', isComing)
        this.isComing = isComing
      });
    this.visible = false;
  }
}
