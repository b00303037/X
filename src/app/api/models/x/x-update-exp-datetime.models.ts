import { BaseAPIResModel } from '../base-api.models';

export interface XUpdateExpDatetimeReq {
  username: string;
  expDatetime: string;
}

export type XUpdateExpDatetimeRes = BaseAPIResModel<null>;
