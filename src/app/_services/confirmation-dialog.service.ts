import {Injectable} from '@angular/core';

import {ConfirmationDialogComponent} from "../_helpers/confirmation-dialog/confirmation-dialog.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
@Injectable({
  providedIn: 'root'
})
@Injectable()
export class ConfirmationDialogService {

  constructor(
    private modalService: NgbModal,
  ) { }

  public confirm(
    title: string,
    message: string | null,
    btnOkText: string = 'YES',
    btnCancelText: string = 'NO',
    dialogSize: 'sm'|'lg' = 'lg'): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }
}
