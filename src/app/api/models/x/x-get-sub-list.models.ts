import { BaseAPIResModel } from '../base-api.models';
import { Subscription } from './x-get-sub.models';

export interface XGetSubListReq {}

export type XGetSubListRes = BaseAPIResModel<
  Array<{
    username: string;
    subscription: Subscription;
  }>
>;
