import { NextResponse } from 'next/server';
import { PaymentService } from '../../../../services/paymentService';

// Disable body parsing by Next.js because Alipay sends form-data or urlencoded
// and we need to handle signature verification. 
// However, Next.js App Router route handlers don't support `config = { api: { bodyParser: false } }` like Pages router.
// We access the request body stream or formData directly.

export async function POST(req: Request) {
  try {
    // Alipay sends notifications as application/x-www-form-urlencoded
    const formData = await req.formData();
    const params: Record<string, string> = {};
    
    formData.forEach((value, key) => {
        if (typeof value === 'string') {
            params[key] = value;
        }
    });

    console.log('Received Alipay Webhook:', params);

    // 1. Verify Signature
    // @ts-ignore
    const AlipaySdk = (await import('alipay-sdk')).default;
    const alipaySdk = new AlipaySdk({
        appId: process.env.ALIPAY_APP_ID!,
        privateKey: process.env.ALIPAY_PRIVATE_KEY!,
        alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY!,
    });

    const isValid = alipaySdk.checkNotifySign(params);

    if (!isValid) {
        console.error('Alipay signature verification failed');
        return new NextResponse('fail', { status: 400 });
    }

    // 2. Check Status
    const tradeStatus = params.trade_status;
    // TRADE_SUCCESS: Payment finished
    // TRADE_FINISHED: Transaction finished (cannot refund)
    if (tradeStatus !== 'TRADE_SUCCESS' && tradeStatus !== 'TRADE_FINISHED') {
        return new NextResponse('success'); // Acknowledge receipt even if not success status to stop retries
    }

    // 3. Get Payment ID
    // We stored paymentId in out_trade_no
    const outTradeNo = params.out_trade_no;
    const paymentId = outTradeNo; // Direct mapping as per PaymentService

    if (!paymentId) {
        console.error('Missing out_trade_no in Alipay webhook');
        return new NextResponse('fail', { status: 400 });
    }

    // 4. Fulfill Payment
    await PaymentService.fulfillPayment(paymentId);

    // 5. Return 'success' string to Alipay
    return new NextResponse('success');

  } catch (error) {
    console.error('Alipay webhook error:', error);
    return new NextResponse('fail', { status: 500 });
  }
}
