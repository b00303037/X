import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { XLoginReq, XLoginRes } from '../models/x/x-login.models';
import { XCancelSubReq, XCancelSubRes } from '../models/x/x-cancel-sub.models';
import {
  XGetRandomNumberReq,
  XGetRandomNumberRes,
} from '../models/x/x-get-random-number.models';
import {
  XGetSubListReq,
  XGetSubListRes,
} from '../models/x/x-get-sub-list.models';
import { XGetSubReq, XGetSubRes } from '../models/x/x-get-sub.models';
import { XSubscribeReq, XSubscribeRes } from '../models/x/x-subscribe.models';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractXService {
  abstract XLogin(req: XLoginReq): Observable<XLoginRes>;

  abstract XSubscribe(req: XSubscribeReq): Observable<XSubscribeRes>;

  abstract XGetSub(req: XGetSubReq): Observable<XGetSubRes>;

  abstract XGetRandomNumber(
    req: XGetRandomNumberReq
  ): Observable<XGetRandomNumberRes>;

  abstract XCancelSub(req: XCancelSubReq): Observable<XCancelSubRes>;

  abstract XGetSubList(req: XGetSubListReq): Observable<XGetSubListRes>;
}
