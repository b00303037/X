import { FormControl } from '@angular/forms';
import { Subscription } from '../../../api/models/x/x-get-sub.models';

export interface UpdateExpDatetimeDialogData {
  username: string;
  subscription: Subscription;
}

export interface UpdateExpDatetimeFCs {
  /**
   * 日期
   */
  date: FormControl<Date | null>;
  /**
   * 時
   */
  hours: FormControl<number | null>;
  /**
   * 分
   */
  minutes: FormControl<number | null>;
}

export type UpdateExpDatetimeDialogResult = boolean | undefined;
