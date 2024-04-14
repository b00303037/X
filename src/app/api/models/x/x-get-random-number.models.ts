import { BaseAPIResModel } from '../base-api.models';

export interface XGetRandomNumberReq {
  APIKey: string;
}

export type XGetRandomNumberRes = BaseAPIResModel<number>;
