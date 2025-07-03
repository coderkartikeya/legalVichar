import { NextResponse } from 'next/server';
import dbConnect from '../../../../db/connect';
import Document from '../../../../db/Document';
import Case from '../../../../db/Case';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  let documents = [];
  if (userId) {
    // Find cases where user is a participant or creator
    const userCases = await Case.find({ $or: [ { createdBy: userId }, { participants: userId } ] }).select('_id');
    const caseIds = userCases.map(c => c._id);
    documents = await Document.find({ $or: [ { uploadedBy: userId }, { case: { $in: caseIds } } ] });
  } else {
    documents = await Document.find({});
  }
  return NextResponse.json({ documents });
} 