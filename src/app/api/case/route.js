import { NextResponse } from 'next/server';
import dbConnect from '../../../../db/connect';
import Case from '../../../../db/Case';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  let cases = [];
  if (userId) {
    cases = await Case.find({
      $or: [
        { createdBy: userId },
        { participants: userId }
      ]
    });
  } else {
    cases = await Case.find({});
  }
  return NextResponse.json({ cases });
}

export async function POST(req) {
  await dbConnect();
  try {
    const { title, description, hearingDate, document, aiInsight, createdBy } = await req.json();
    
    if (!title || !createdBy) {
      return NextResponse.json({ error: 'Title and creator are required' }, { status: 400 });
    }
    const newCase = await Case.create({
      title,
      description,
      hearingDate,
      documents: document ? [document] : [],
      aiInsight,
      createdBy,
    });
    return NextResponse.json({ case: [] });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
} 