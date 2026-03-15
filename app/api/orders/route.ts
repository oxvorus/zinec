import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('orders')
      .select(`
        *,
        buyer:users!buyer_id(id, name, email, avatar_url),
        service:services(*),
        seller:sellers(id)
      `);

    // Filter by buyer or seller
    const { data: sellerData } = await supabase
      .from('sellers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (sellerData) {
      // User is a seller
      query = query.eq('seller_id', sellerData.id);
    } else {
      // User is a buyer
      query = query.eq('buyer_id', user.id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Get service details for seller_id and price
    const { data: service } = await supabase
      .from('services')
      .select('seller_id, price')
      .eq('id', body.service_id)
      .single();

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        buyer_id: user.id,
        seller_id: service.seller_id,
        service_id: body.service_id,
        price: service.price,
        deadline: body.deadline,
        notes: body.notes,
        status: 'pending',
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
