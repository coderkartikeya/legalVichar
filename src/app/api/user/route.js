import { NextResponse } from 'next/server';
import dbConnect from '../../../../db/connect';
import User from '../../../../db/User';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  const user = await User.findOne({ email });
  return NextResponse.json({ user });
}

export async function POST(req) {
  await dbConnect();
  try {
    const { email, name, role, avatar, clerkId } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ user });
    }
    user = await User.create({
      email,
      name,
      role: role || 'Client',
      avatar,
      clerkId,
    });
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
} 