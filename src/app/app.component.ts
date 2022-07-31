//app.component.ts

import {Component, OnInit} from '@angular/core';
import {ConfirmationDialogService} from "./service/confirmation-dialog.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isComing: boolean = false;
  visible: boolean = true

  constructor(
    private confirmationDialogService: ConfirmationDialogService
  ) { }
  ngOnInit() {
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
