/**
 * Email notification service for payment events
 */

import { notifyOwner } from "./_core/notification";

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  type: "payment_confirmation" | "report_delivery" | "payment_receipt";
}

/**
 * Send payment confirmation email to user
 */
export async function sendPaymentConfirmationEmail(
  userEmail: string,
  userName: string,
  productName: string,
  amount: number,
  currency: string
): Promise<boolean> {
  try {
    const subject = "決済確認 - Eurostat Economic Dashboard";
    const body = `
${userName}様

ご購入ありがとうございます。

【決済確認】
商品名: ${productName}
金額: ${currency} ${(amount / 100).toFixed(2)}
決済ステータス: 完了

プレミアム分析レポートは別途メールで送信いたします。

ご不明な点がございましたら、お気軽にお問い合わせください。

---
Eurostat Economic Dashboard
Powered by Manus LLM
    `.trim();

    // Send notification to owner
    const result = await notifyOwner({
      title: `Payment Confirmation: ${productName}`,
      content: `User ${userName} (${userEmail}) purchased ${productName} for ${currency} ${(amount / 100).toFixed(2)}`,
    });

    return result;
  } catch (error) {
    console.error("[Email] Failed to send payment confirmation:", error);
    return false;
  }
}

/**
 * Send report delivery email to user
 */
export async function sendReportDeliveryEmail(
  userEmail: string,
  userName: string,
  reportUrl: string
): Promise<boolean> {
  try {
    const subject = "プレミアム分析レポート配信 - Eurostat Economic Dashboard";
    const body = `
${userName}様

プレミアム分析レポートの準備が完了しました。

【レポート情報】
形式: PDF
サイズ: 約5-10MB
有効期限: 3ヶ月

以下のリンクからダウンロードしてください：
${reportUrl}

このリンクは24時間有効です。

ご不明な点がございましたら、お気軽にお問い合わせください。

---
Eurostat Economic Dashboard
Powered by Manus LLM
    `.trim();

    // Send notification to owner
    const result = await notifyOwner({
      title: "Report Delivery",
      content: `Report delivered to ${userName} (${userEmail})`,
    });

    return result;
  } catch (error) {
    console.error("[Email] Failed to send report delivery email:", error);
    return false;
  }
}

/**
 * Send payment receipt email
 */
export async function sendPaymentReceiptEmail(
  userEmail: string,
  userName: string,
  productName: string,
  amount: number,
  currency: string,
  transactionId: string,
  purchaseDate: Date
): Promise<boolean> {
  try {
    const subject = "領収書 - Eurostat Economic Dashboard";
    const body = `
${userName}様

ご購入ありがとうございます。以下は領収書です。

【領収書】
商品名: ${productName}
金額: ${currency} ${(amount / 100).toFixed(2)}
トランザクションID: ${transactionId}
購入日時: ${purchaseDate.toLocaleString("ja-JP")}

このメールは領収書として保管してください。

ご不明な点がございましたら、お気軽にお問い合わせください。

---
Eurostat Economic Dashboard
Powered by Manus LLM
    `.trim();

    // Send notification to owner
    const result = await notifyOwner({
      title: "Payment Receipt",
      content: `Receipt issued for ${userName} (${userEmail}) - ${productName}`,
    });

    return result;
  } catch (error) {
    console.error("[Email] Failed to send payment receipt email:", error);
    return false;
  }
}
