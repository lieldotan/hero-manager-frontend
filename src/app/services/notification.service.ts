import { Injectable } from '@angular/core';
import { ToastrService, ActiveToast, IndividualConfig } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  success(
    message: string,
    title?: string,
    config?: Partial<IndividualConfig>
  ): ActiveToast<any> {
    return this.toastr.success(message, title, config);
  }

  error(
    message: string,
    title?: string,
    config?: Partial<IndividualConfig>
  ): ActiveToast<any> {
    return this.toastr.error(message, title, config);
  }

  info(
    message: string,
    title?: string,
    config?: Partial<IndividualConfig>
  ): ActiveToast<any> {
    return this.toastr.info(message, title, config);
  }

  warning(
    message: string,
    title?: string,
    config?: Partial<IndividualConfig>
  ): ActiveToast<any> {
    return this.toastr.warning(message, title, config);
  }
}
