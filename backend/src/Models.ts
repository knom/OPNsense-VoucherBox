export interface Voucher {
    username: string;
    password: string;
    vouchergroup: string;
    validity: number;
    expirytime: number;
    starttime: number | null;
}
