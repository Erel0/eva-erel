export interface DailySalesSkuListPayload {
    marketplace: string;
    sellerId: string;
    salesDate: string;
    salesDate2: string;
    pageSize: number;
    pageNumber: number;
    isDaysCompare: number;
}

export interface SkuListItem {
    sku: string;
    asin: string;
    productName: string;
    qty: number;
    shippingAmount: number;
    amount: number;
    refundPercantage: number | null;
    qty2: number;
    amount2: number;
    shippingAmount2: number;
    sortingAmount: number;
    imageUrl: string;
}

interface DailySalesSkuListData {
    Currency: string;
    item: {
        selectedDate: string;
        totalSale: number;
        totalShippingAmount: number;
        skuList: SkuListItem[];
        total: number;
    }
}

export interface DailySalesSkuListResponse {
    ApiStatus: boolean;
    ApiStatusCode: string | number;
    ApiStatusMessage: string;
    Data: DailySalesSkuListData;
} 