import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
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
import { XGetRandomNumberReq } from '../../../api/models/x/x-get-random-number.models';
import { BaseAPIResModel } from '../../../api/models/base-api.models';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { SnackType } from '../../../shared/enums/snack-type.enum';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
})
export class ServiceComponent implements OnDestroy {
  private destroy$ = new Subject<null>();

  APIKey?: string = '';
  n?: number;

  getting = false;

  constructor(
    private xService: AbstractXService,
    private snackBarService: SnackBarService
  ) {}

  onXGetRandomNumber(): void {
    if ((this.APIKey?.length ?? 0) === 0 || this.getting) {
      return;
    }
    this.getting = true;

    const req: XGetRandomNumberReq = {
      APIKey: this.APIKey as string,
    };

    this.xService
      .XGetRandomNumber(req)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.getting = false)),
        tap((res) => {
          this.snackBarService.add({
            message: res.message,
            type: SnackType.Success,
          });

          this.n = res.content;
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

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
