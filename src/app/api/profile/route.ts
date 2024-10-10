import { connectMongoDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth';
import User from '@/models/User';

// create
export async function POST(request: NextRequest) {
  const profileData = await request.json();
  const session = await auth();
  const email = session?.user?.email;
  await connectMongoDB();
  try {
    const user = await User.findOne({ email });
    const profile = await Profile.create({
      ...profileData,
      belongsTo:user._id
    });
    await User.findOneAndUpdate(
      { email },
      {profile: profile._id },
      {new: true})
    return NextResponse.json({ message: 'profile created' }, { status: 201 })
  } catch {
    return NextResponse.json( {message: "OOOPS"}, { status: 500 })
  }
}

//update
export async function PUT(request: NextRequest) {
  const profileData = await request.json();
  const session = await auth();
  const email = session?.user?.email;
  await connectMongoDB();
  try {
    const user = await User.findOne({ email });
    await Profile.findOneAndUpdate({
      belongsTo: user._id
    }, {
      ...profileData
    });
    return NextResponse.json({ message: 'profile updated' }, { status: 201 })
  } catch (e){
    console.log(e)
    return NextResponse.json( {message: "Could not update"}, { status: 500 })
  }
}

// read
export async function GET() {
  const session = await auth();
  const email = session?.user?.email;
  await connectMongoDB();
  try {
    const user = await User.findOne({ email }).populate('profile');
    const profile = user.profile;
    if (profile) {
      return NextResponse.json({ data: profile}, {status: 200})
    } else {
      return NextResponse.json(null, {status: 404 })
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({message: 'oops'}, {status: 500})
  }
}