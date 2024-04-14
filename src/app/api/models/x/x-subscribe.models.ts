import { BaseAPIResModel } from '../base-api.models';

export interface XSubscribeReq {
  months: number;
}

export type XSubscribeRes = BaseAPIResModel<null>;
