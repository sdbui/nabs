import { connectMongoDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth';
import User from '@/models/User';

// create
export async function POST(request: NextRequest) {
  console.log('IN POST')
  const profileData = await request.json();
  let session = await auth();
  let email = session?.user?.email;
  await connectMongoDB();
  try {
    let user = await User.findOne({ email });
    let profile = await Profile.create({
      ...profileData,
      belongsTo:user._id
    });
    let updatedUser = await User.findOneAndUpdate(
      { email },
      {profile: profile._id },
      {new: true})
    return NextResponse.json({ message: 'profile created' }, { status: 201 })
  } catch {
    console.log('oops')
    return NextResponse.json( {message: "OOOPS"}, { status: 500 })
  }
}

//update
export async function PUT(request: NextRequest) {
  console.log('IN PUT')
  const profileData = await request.json();
  console.log(profileData)
  let session = await auth();
  let email = session?.user?.email;
  await connectMongoDB();
  try {
    let user = await User.findOne({ email });
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
export async function GET(request: NextRequest) {
  console.log('IN GET')
  let session = await auth();
  let email = session?.user?.email;
  console.log('email: ', email)
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
// export async function GET(request: NextRequest) {
//   // get user from token??
//   console.log('okay... getting profile')
//   let session = await auth();
//   let email = session?.user?.email;

//   if (email) {
//     // fetch from mongo
//     await connectMongoDB();
//     let user = await User.findOne({ email });
//     let profile = Profile.findOne({  })

//   } else {
//     return NextResponse.json({ error: 'Could not find User'}, { status: 401 });
//   }

//   return NextResponse.json({message: 'lol'});
//   // const { email } = await request.json();
//   // await connectMongoDB();
// }

// update
// export async function PUT(request: NextRequest) {

// }