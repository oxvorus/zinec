import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sellerId = searchParams.get('seller_id');

    let query = supabase
      .from('services')
      .select(`
        *,
        seller:sellers(
          *,
          user:users(id, name, email, avatar_url)
        )
      `)
      .eq('is_active', true);

    if (category && category !== 'Semua') {
      query = query.eq('category', category);
    }

    if (sellerId) {
      query = query.eq('seller_id', sellerId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter by search if provided
    let filteredData = data || [];
    if (search) {
      filteredData = filteredData.filter(
        (service: any) =>
          service.title.toLowerCase().includes(search.toLowerCase()) ||
          service.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json(filteredData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get seller profile
    const { data: seller } = await supabase
      .from('sellers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!seller) {
      return NextResponse.json(
        { error: 'You need to be a seller to create services' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('services')
      .insert({
        seller_id: seller.id,
        title: body.title,
        description: body.description,
        category: body.category,
        price: body.price,
        delivery_days: body.delivery_days,
        image_url: body.image_url,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
