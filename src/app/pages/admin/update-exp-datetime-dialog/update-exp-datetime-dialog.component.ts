import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  finalize,
  takeUntil,
  tap,
} from 'rxjs';
import { AbstractXService } from '../../../api/abstract/abstract-x.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import {
  UpdateExpDatetimeDialogData,
  UpdateExpDatetimeFCs,
} from './update-exp-datetime-dialog.models';
import { Subscription } from '../../../api/models/x/x-get-sub.models';
import { XUpdateExpDatetimeReq } from '../../../api/models/x/x-update-exp-datetime.models';
import { parse } from 'date-fns';
import { SnackType } from '../../../shared/enums/snack-type.enum';
import { BaseAPIResModel } from '../../../api/models/base-api.models';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-update-exp-datetime-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgIf,
  ],
  templateUrl: './update-exp-datetime-dialog.component.html',
  styleUrls: ['./update-exp-datetime-dialog.component.scss'],
})
export class UpdateExpDatetimeDialogComponent implements OnInit, OnDestroy {
  private _SMQueryListener = () => this.changeDetectorRef.detectChanges();
  private destroy$ = new Subject<null>();

  SMQuery: MediaQueryList = this.media.matchMedia('(min-width: 600px)');

  fg = new FormGroup<UpdateExpDatetimeFCs>({
    date: new FormControl(null, {
      validators: [Validators.required],
    }),
    hours: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.min(0),
        Validators.max(23),
        Validators.pattern(/^[0-9]*$/),
      ],
    }),
    minutes: new FormControl(null, {
      validators: [
        Validators.required,
        Validators.min(0),
        Validators.max(59),
        Validators.pattern(/^[0-9]*$/),
      ],
    }),
  });
  fcs: UpdateExpDatetimeFCs = {
    date: this.fg.controls['date'],
    hours: this.fg.controls['hours'],
    minutes: this.fg.controls['minutes'],
  };
  get fv() {
    return this.fg.getRawValue();
  }

  updating = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UpdateExpDatetimeDialogData,
    private dialogRef: MatDialogRef<UpdateExpDatetimeDialogComponent>,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private xService: AbstractXService,
    private snackBarService: SnackBarService
  ) {
    this.dialogRef.updateSize('600px');

    this.SMQuery.addEventListener('change', this._SMQueryListener);

    this.patchFV(this.data.subscription);
  }

  ngOnInit(): void {}

  patchFV(sub: Subscription): void {
    const expDate = new Date(sub.expDatetime);

    this.fg.patchValue({
      date: expDate,
      hours: expDate.getHours(),
      minutes: expDate.getMinutes(),
    });
  }

  clearDateAndTime(): void {
    this.fcs['date'].reset();
    this.fcs['hours'].reset();
    this.fcs['minutes'].reset();
  }

  onXUpdateExpDatetime(): void {
    this.fg.markAllAsTouched();
    this.fg.updateValueAndValidity();

    if (this.fg.invalid || this.updating) {
      return;
    }
    this.updating = true;

    const { username } = this.data;
    const { date, hours, minutes } = this.fv;
    const expDatetime = this.getISOString(date, hours, minutes);
    const req: XUpdateExpDatetimeReq = {
      username,
      expDatetime,
    };

    this.xService
      .XUpdateExpDatetime(req)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.updating = false)),
        tap((res) => {
          this.snackBarService.add({
            message: res.message,
            type: SnackType.Success,
          });

          this.dialogRef.close(true);
        }),
        catchError((err) => this.onError(err))
      )
      .subscribe();
  }

  onError(err: BaseAPIResModel<null>): Observable<never> {
    console.error(err);

    this.snackBarService.add({ message: err.message, type: SnackType.Error });

    return EMPTY;
  }

  getISOString(
    date: Date | null | undefined,
    hours: number | null | undefined,
    minutes: number | null | undefined
  ): string {
    if (date && typeof hours === 'number' && typeof minutes === 'number') {
      return parse(`${hours}:${minutes}:0 0`, 'H:m:s S', date).toISOString();
    }

    return '';
  }

  ngOnDestroy(): void {
    this.SMQuery.removeEventListener('change', this._SMQueryListener);

    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
