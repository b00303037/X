export type Payload = {
  /**
   * 角色
   */
  role: string;
  /**
   * JWT 到期時間 (經 UNIX 紀元起經過的秒數)
   */
  exp: number;
};
