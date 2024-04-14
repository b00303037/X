import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  finalize,
  takeUntil,
  tap,
} from 'rxjs';
import { AbstractXService } from '../../api/abstract/abstract-x.service';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { XGetSubListReq } from '../../api/models/x/x-get-sub-list.models';
import { Subscription } from '../../api/models/x/x-get-sub.models';
import { BaseAPIResModel } from '../../api/models/base-api.models';
import { SnackType } from '../../shared/enums/snack-type.enum';
import { XCancelSubReq } from '../../api/models/x/x-cancel-sub.models';
import { isBefore } from 'date-fns';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgIf, NgForOf, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<null>();

  subList: Array<{
    username: string;
    subscription: Subscription;
  }> = [];

  collapsed?: string;

  getting = false;
  cancelling = false;

  constructor(
    private xService: AbstractXService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.onXGetSubList();
  }

  toggleCollapse(username: string): void {
    this.collapsed = this.collapsed === username ? undefined : username;
  }

  onXGetSubList(): void {
    if (this.getting) {
      return;
    }
    this.getting = true;

    const req: XGetSubListReq = {};

    this.xService
      .XGetSubList(req)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.getting = false)),
        tap((res) => {
          this.subList = res.content;
        }),
        catchError((err) => this.onError(err))
      )
      .subscribe();
  }

  canCancelSub(subscription: Subscription): boolean {
    return isBefore(new Date(), new Date(subscription.expDatetime));
  }

  onXCancelSub(sub: Subscription): void {
    if (sub === undefined || !this.canCancelSub(sub) || this.cancelling) {
      return;
    }
    this.cancelling = true;

    const req: XCancelSubReq = {
      subscriptionSeq: sub.seq,
    };

    this.xService
      .XCancelSub(req)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.cancelling = false)),
        tap((res) => {
          this.snackBarService.add({
            message: res.message,
            type: SnackType.Success,
          });

          this.onXGetSubList();
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
