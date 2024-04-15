import { Component, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  finalize,
  takeUntil,
  tap,
} from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AbstractXService } from '../../../api/abstract/abstract-x.service';
import { AuthService } from '../../../shared/services/auth.service';

import { LoginFCs } from './login.models';
import { XLoginReq } from '../../../api/models/x/x-login.models';
import { BaseAPIResModel } from '../../../api/models/base-api.models';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { SnackType } from '../../../shared/enums/snack-type.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  private destroy$ = new Subject<null>();

  fg = new FormGroup<LoginFCs>({
    username: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(64),
      ],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(64),
      ],
    }),
  });
  fcs: LoginFCs = {
    username: this.fg.controls['username'],
    password: this.fg.controls['password'],
  };
  get fv() {
    return this.fg.getRawValue();
  }

  showPassword = false;
  loggingIn = false;

  constructor(
    private router: Router,
    private xService: AbstractXService,
    private authService: AuthService,
    private snackBarService: SnackBarService
  ) {}

  onLogin(): void {
    this.fg.markAllAsTouched();
    this.fg.updateValueAndValidity();

    if (this.fg.invalid || this.loggingIn) {
      return;
    }
    this.loggingIn = true;

    const { username, password } = this.fv;
    const req: XLoginReq = {
      username,
      password,
    };

    this.xService
      .XLogin(req)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loggingIn = false)),
        tap((res) => {
          const { accessToken } = res.content;

          this.authService.token = accessToken;

          if (this.authService.validateToken()) {
            this.authService.loggedIn$.next(true);

            this.snackBarService.add({
              message: res.message,
              type: SnackType.Success,
            });

            this.router.navigate(['/subscription']);
          } else {
            // TODO ?
          }
        }),
        catchError((err) => this.onError(err))
      )
      .subscribe();
  }

  onError(err: BaseAPIResModel<null>): Observable<never> {
    console.error(err);

    this.snackBarService.add({ message: err.message, type: SnackType.Error });

    this.fcs['password'].reset();

    return EMPTY;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
