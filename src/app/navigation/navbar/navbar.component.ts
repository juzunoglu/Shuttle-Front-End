import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {TokenStorageService} from "../../_services/token-storage.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isComing: boolean = false;
  visible: boolean = true
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  @Output() public sidenavToggle = new EventEmitter();

  constructor(
    private tokenStorageService: TokenStorageService,
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

  public onToggleSideNav = () => {
    this.sidenavToggle.emit();
  };

  logOut(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

}
