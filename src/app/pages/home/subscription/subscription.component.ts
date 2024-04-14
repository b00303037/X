import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
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
import {
  Subscription,
  XGetSubReq,
} from '../../../api/models/x/x-get-sub.models';
import { BaseAPIResModel } from '../../../api/models/base-api.models';
import { XSubscribeReq } from '../../../api/models/x/x-subscribe.models';
import { format, isBefore } from 'date-fns';
import { SnackType } from '../../../shared/enums/snack-type.enum';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatRadioModule,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss',
})
export class SubscriptionComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<null>();

  months?: number;

  subscription?: Subscription;
  monthlyUsageList: Array<{
    yyyyMM: string;
    count: number;
  }> = [];

  getting = false;
  subscribing = false;

  constructor(
    private xService: AbstractXService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.onXGetSub();
  }

  onXGetSub(): void {
    if (this.getting) {
      return;
    }
    this.getting = true;

    const req: XGetSubReq = {};

    this.xService
      .XGetSub(req)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.getting = false)),
        tap((res) => {
          const now = new Date();

          if (res.content) {
            if (isBefore(now, new Date(res.content.expDatetime))) {
              this.subscription = res.content;
              this.monthlyUsageList = this.getMonthlyUsageList(
                res.content.usageList
              );
            }

            return;
          }

          this.subscription = undefined;
          this.monthlyUsageList = [];
        }),
        catchError((err) => this.onError(err))
      )
      .subscribe();
  }

  onXSubscribe(): void {
    if (this.months === undefined || this.subscribing) {
      return;
    }
    this.subscribing = true;

    const req: XSubscribeReq = {
      months: this.months,
    };

    this.xService
      .XSubscribe(req)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.subscribing = false)),
        tap((res) => {
          this.snackBarService.add({
            message: res.message,
            type: SnackType.Success,
          });

          this.onXGetSub();
        }),
        catchError((err) => this.onError(err))
      )
      .subscribe();
  }

  getMonthlyUsageList(
    usageList: Array<{ seq: number; datetime: string }>
  ): Array<{
    yyyyMM: string;
    count: number;
  }> {
    const result = usageList.reduce<
      Array<{
        yyyyMM: string;
        count: number;
      }>
    >((list, usage) => {
      const yyyyMM = format(new Date(usage.datetime), 'yyyy-MM');
      const record = list.find((x) => x.yyyyMM === yyyyMM);

      if (record) {
        record.count++;
      } else {
        list.push({
          yyyyMM,
          count: 1,
        });
      }

      return list;
    }, []);

    if (result.length === 0) {
      result.push({
        yyyyMM: format(new Date(), 'yyyy-MM'),
        count: 0,
      });
    }

    return result;
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
