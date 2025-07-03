import { NextResponse } from 'next/server';
import dbConnect from '../../../../db/connect';
import Appointment from '../../../../db/Appointment';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  let appointments = [];
  if (userId) {
    appointments = await Appointment.find({ $or: [ { createdBy: userId }, { participants: userId } ] });
  } else {
    appointments = await Appointment.find({});
  }
  return NextResponse.json({ appointments });
} 