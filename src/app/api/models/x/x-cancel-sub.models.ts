import { BaseAPIResModel } from '../base-api.models';

export interface XCancelSubReq {
  subscriptionSeq: number;
}

export type XCancelSubRes = BaseAPIResModel<null>;
