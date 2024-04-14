import { environment } from '../../../environments/environment';

export const tokenGetter: () => string | null = () =>
  localStorage.getItem(environment.tokenKey);
