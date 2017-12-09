import { ToastOptions } from 'ng2-toastr';

export class CustomOption extends ToastOptions {
    toastLife = 3000;
    positionClass = 'toast-top-right';
    maxShown = 10;
}
