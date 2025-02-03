export interface SkuRefundRatePayload {
    marketplace: string;
    sellerId: string;
    skuList: string[];
    requestedDay: number;
}

interface SkuInfo {
    asin: string;
    sku: string;
    productName: string;
    qty: number;
    amount: number;
    shippingAmount: number;
    qty2: number;
    amount2: number;
    shippingAmount2: number;
    sortingAmount: number;
    imageUrl: string;
    refundPercantage: number | null;
}

interface RefundRateItem {
    sku: SkuInfo;
    refundAmount: number;
    refundQuantity: number;
    refundRate: number;
    totalOrderCount: number;
}

export interface SkuRefundRateResponse {
    ApiStatus: boolean;
    ApiStatusCode: number | string;
    ApiStatusMessage: string;
    Data: RefundRateItem[];
} 