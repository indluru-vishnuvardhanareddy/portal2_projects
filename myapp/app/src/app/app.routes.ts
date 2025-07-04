import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RequestForQuotationComponent } from './request-for-quotation/request-for-quotation.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
import { FinanceSummaryComponent } from './finance-summary/finance-summary.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { PaymentsAndAgingComponent } from './payments-and-aging/payments-and-aging.component';
import { CreditDebitMemoComponent } from './credit-debit-memo/credit-debit-memo.component';
import { ProcurementProcessComponent } from './procurement-process/procurement-process.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent},
    { path: 'profile', component: ProfileComponent},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'request-for-quotation', component: RequestForQuotationComponent},
    { path: 'purchase-order', component: PurchaseOrderComponent },
    { path: 'goods-receipt', component: GoodsReceiptComponent},
    { path: 'finance-summary', component: FinanceSummaryComponent},
    { path: 'invoice-details', component: InvoiceDetailsComponent},
    { path: 'payments-and-aging', component: PaymentsAndAgingComponent},
    { path: 'credit-debit-memo', component: CreditDebitMemoComponent},
    { path: 'procurement-process', component: ProcurementProcessComponent}
];
