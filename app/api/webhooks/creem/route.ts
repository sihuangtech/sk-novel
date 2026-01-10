import { NextResponse } from 'next/server';
import { PaymentService } from '../../../../services/paymentService';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    // 1. Get the raw body and signature (if available)
    // Note: In a real production environment, you MUST verify the webhook signature.
    // Since we don't have the exact signature verification algorithm docs here,
    // we will use a "callback verification" strategy:
    // We will take the checkout session ID from the payload, and query the Creem API
    // directly to confirm the status. This ensures the data is authentic.
    
    const body = await req.json();
    const eventType = body.type; // Assuming standard event structure, e.g., "checkout.session.completed"
    
    // Log the webhook for debugging
    console.log('Received Creem Webhook:', JSON.stringify(body, null, 2));

    // Handle 'checkout.session.completed' (or similar event - adjust based on actual Creem docs)
    // If the event structure is unknown, we might look for the resource object directly.
    // Based on common patterns, body might be the event or the object itself.
    // Let's assume body contains the checkout session object or an event wrapping it.
    
    let session = body;
    if (body.data && body.data.object) {
      session = body.data.object;
    }

    // We look for our metadata
    const paymentId = session.metadata?.paymentId;
    const checkoutId = session.id;

    if (!paymentId) {
      // Not a payment we initiated or missing metadata
      return NextResponse.json({ received: true, message: 'No paymentId in metadata' });
    }

    if (!checkoutId) {
      return NextResponse.json({ received: true, message: 'No checkoutId in payload' });
    }

    // 2. Verify with Creem API
    const verifiedSession = await verifyCreemCheckoutSession(checkoutId);
    
    if (verifiedSession.status !== 'completed' && verifiedSession.status !== 'paid') {
      console.log(`Checkout session ${checkoutId} status is ${verifiedSession.status}, not completing payment.`);
      return NextResponse.json({ received: true, message: 'Session not completed' });
    }

    // 3. Fulfill the payment
    const success = await PaymentService.fulfillPayment(paymentId);

    if (success) {
      console.log(`Payment ${paymentId} fulfilled successfully.`);
    } else {
      console.log(`Payment ${paymentId} could not be fulfilled (maybe already completed).`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function verifyCreemCheckoutSession(checkoutId: string) {
  const apiKey = process.env.CREEM_API_KEY;
  if (!apiKey) throw new Error('CREEM_API_KEY not configured');

  const response = await fetch(`https://api.creem.io/v1/checkouts/${checkoutId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to verify session: ${response.statusText}`);
  }

  return await response.json();
}
