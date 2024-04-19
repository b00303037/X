import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { BaseApiService } from './base-api.service';
import { AbstractXService } from './abstract/abstract-x.service';

import { BaseAPICode } from '../shared/enums/base-api-code.enum';
import { XCancelSubReq, XCancelSubRes } from './models/x/x-cancel-sub.models';
import {
  XGetRandomNumberReq,
  XGetRandomNumberRes,
} from './models/x/x-get-random-number.models';
import {
  XGetSubListReq,
  XGetSubListRes,
} from './models/x/x-get-sub-list.models';
import { XGetSubReq, XGetSubRes } from './models/x/x-get-sub.models';
import { XLoginReq, XLoginRes } from './models/x/x-login.models';
import { XSubscribeReq, XSubscribeRes } from './models/x/x-subscribe.models';
import {
  XUpdateExpDatetimeReq,
  XUpdateExpDatetimeRes,
} from './models/x/x-update-exp-datetime.models';

@Injectable({
  providedIn: 'root',
})
export class XService extends BaseApiService implements AbstractXService {
  private baseRoute = '/X';

  XLogin(req: XLoginReq): Observable<XLoginRes> {
    const apiUri = this.baseRoute + '/XLogin';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.SUCCESS];

    return super
      .post<XLoginReq, XLoginRes>(apiUri, req)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }
  XSubscribe(req: XSubscribeReq): Observable<XSubscribeRes> {
    const apiUri = this.baseRoute + '/XSubscribe';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.SUCCESS];

    return super
      .post<XSubscribeReq, XSubscribeRes>(apiUri, req)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }
  XGetSub(req: XGetSubReq): Observable<XGetSubRes> {
    const apiUri = this.baseRoute + '/XGetSub';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.SUCCESS];

    return super
      .post<XGetSubReq, XGetSubRes>(apiUri, req)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }
  XGetRandomNumber(req: XGetRandomNumberReq): Observable<XGetRandomNumberRes> {
    const apiUri = this.baseRoute + '/XGetRandomNumber';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.SUCCESS];

    return super
      .post<XGetRandomNumberReq, XGetRandomNumberRes>(apiUri, req)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }
  XCancelSub(req: XCancelSubReq): Observable<XCancelSubRes> {
    const apiUri = this.baseRoute + '/XCancelSub';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.SUCCESS];

    return super
      .post<XCancelSubReq, XCancelSubRes>(apiUri, req)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }
  XGetSubList(req: XGetSubListReq): Observable<XGetSubListRes> {
    const apiUri = this.baseRoute + '/XGetSubList';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.SUCCESS];

    return super
      .post<XGetSubListReq, XGetSubListRes>(apiUri, req)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }
  XUpdateExpDatetime(
    req: XUpdateExpDatetimeReq
  ): Observable<XUpdateExpDatetimeRes> {
    const apiUri = this.baseRoute + '/XUpdateExpDatetime';
    const acceptedCodes: Array<BaseAPICode> = [BaseAPICode.SUCCESS];

    return super
      .post<XUpdateExpDatetimeReq, XUpdateExpDatetimeRes>(apiUri, req)
      .pipe(switchMap((res) => super.throwNotIn(acceptedCodes, res)));
  }
}
