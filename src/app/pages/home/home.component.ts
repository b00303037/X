import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import {
  IsActiveMatchOptions,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { NgClass, NgFor } from '@angular/common';
import { LayoutModule, MediaMatcher } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../shared/services/auth.service';

interface NavListItem {
  icon: string;
  label: string;
  routerLink: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgFor,
    NgClass,
    LayoutModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy {
  private _SMQueryListener = () => this.changeDetectorRef.detectChanges();
  private _MDQueryListener = () => this.changeDetectorRef.detectChanges();

  SMQuery: MediaQueryList = this.media.matchMedia('(min-width: 600px)');
  MDQuery: MediaQueryList = this.media.matchMedia('(min-width: 960px)');

  navListItems: Array<NavListItem> = [
    {
      icon: 'subscriptions',
      label: '訂閱',
      routerLink: '/subscription',
    },
    {
      icon: 'support',
      label: '服務',
      routerLink: '/service',
    },
  ];

  routerLinkActiveOptions: IsActiveMatchOptions = {
    queryParams: 'subset',
    matrixParams: 'exact',
    paths: 'exact',
    fragment: 'exact',
  };

  loggedIn = false;

  constructor(
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ) {
    this.SMQuery.addEventListener('change', this._SMQueryListener);
    this.MDQuery.addEventListener('change', this._MDQueryListener);

    this.authService.loggedIn$.subscribe(
      (loggedIn) => (this.loggedIn = loggedIn)
    );
  }

  onAuth(): void {
    const loggedIn = this.authService.loggedIn$.getValue();

    if (loggedIn) {
      this.authService.logout();
    }

    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.SMQuery.removeEventListener('change', this._SMQueryListener);
    this.MDQuery.removeEventListener('change', this._MDQueryListener);
  }
}
