import { BaseAPIResModel } from '../base-api.models';

export interface XGetSubReq {}

export type XGetSubRes = BaseAPIResModel<Subscription>;

export interface Subscription {
  seq: number;
  subDatetime: string;
  expDatetime: string;
  apiKey: string;
  usageList: Array<{
    seq: number;
    datetime: string;
  }>;
}
