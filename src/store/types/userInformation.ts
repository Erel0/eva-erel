export interface PackageInfo {
    pricingStatus: number;
    packageName: string;
    monthlyFee: number;
    lowerLimit: number;
    upperLimit: number;
    reimbursementCredit: number;
}

export interface SkuPackageInfo {
    pricingStatus: number;
    packageName: string;
    packageDefinition: string;
    lowerSkuCount: number;
    upperSkuCount: number;
}

export interface PackageInformation {
    subscriptionType: number;
    pricingStatus: number;
    packageName: string;
    packageRank: number;
    monthlyFee: number;
    annualFee: number | null;
    lowerLimit: number;
    upperLimit: number;
    lowerSkuLimit: number;
    upperSkuLimit: number;
}

export interface StoreEva {
    storeName: string;
    accountType: number;
    storeId: string;
    evaStoreId: string;
    storeType: number;
    region: string;
    paidStatus: number;
    pricingStatus: number;
    linkedDate: string;
    paidDate: string;
    reimbursementPackageTrialEndDate: string | null;
    unlimitedReimbursementStatus: number;
    showSellerCentralExternalLink: boolean;
    remainingReimbursementCredit: number;
    monthlyReimbursementPackageCredit: number;
    marketplaceName: string;
    marketplaceCode: string;
    enableRepricing: boolean;
    currency: string;
    screenPermissionList: any | null;
    reimbursementStatus: boolean;
    loanOfferAmount: number;
    subscriptionCancelationStatus: number;
    subscriptionCancelationDate: string | null;
    subscriptionPackageType: any | null;
    subscriptionStatus: any | null;
    subscriptionVersion: number;
    hasReimbursementService: boolean;
    hasVendorRecoveryService: boolean;
    hasVendorStore: boolean;
    isSubscriptionAnnual: boolean;
    is3plStore: boolean;
    selectedForPPC: boolean;
    isAdvertisingConnected: boolean;
    sellerApiTokenStatus: number;
    sellerApiAuthCodeCreatedAt: string;
    advertisingAuditState: {
        advertisingAuditDisplayEndDate: string;
        advertisingAuditDisplayStartDate: string;
        displayAdvertisingAudit: boolean;
    };
}

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    isWarehouseAdmin: boolean;
    isStoreAdmin: boolean;
    countryCode: string | null;
    callingCode: string | null;
    telephoneNumber: string | null;
    accountStatus: number;
    accountType: number;
    accountSubscriptionList: any | null;
    userId: string;
    store: StoreEva[];
    vendor: any[];
    walmartStore: any[];
    packageInformation: {
        turnoverPackageInformation: PackageInfo[];
        skuPackageInformation: SkuPackageInfo[];
        packageInformation: PackageInformation[];
    };
    packages: any[];
    allPackages: {
        AllPackages: any[];
        UserAccountPackages: any[];
    };
    userPermissionList: any[];
}

export interface UserInformationResponse {
    ApiStatus: boolean;
    ApiStatusCode: number;
    ApiStatusMessage: string;
    Data: {
        isLinkAccount: boolean;
        linkAccountParameters: string;
        user: User;
    };
}

export interface UserInformationPayload {
    email: string;
} 