import { supabase } from '@/integrations/supabase/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Query shift_settings table
    const { data: shiftSettings, error: shiftSettingsError } = await supabase
      .from('shift_settings')
      .select('*')
      .limit(1);

    if (shiftSettingsError) throw shiftSettingsError;

    // Query shift_plan table
    const { data: shiftPlan, error: shiftPlanError } = await supabase
      .from('shift_plan')
      .select('*')
      .limit(1);

    if (shiftPlanError) throw shiftPlanError;

    return NextResponse.json({
      shiftSettings,
      shiftPlan
    });
  } catch (error) {
    console.error('Error fetching table structure:', error);
    return NextResponse.json({ error: 'Failed to fetch table structure' }, { status: 500 });
  }
} 