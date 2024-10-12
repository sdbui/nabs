import OpenAI from 'openai';
import { auth } from "../auth"
import User from "@/models/User";
import Paper from "@/components/ui/paper/paper";
import { connectMongoDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";


export default async function Home() {
  await connectMongoDB();
  const session = await auth();
  const email = session?.user?.email;
  
  /**
   * HACK... Sometimes would get MissingSchemaError from mongoose
   * saying schema hasnt been regiesterd for model "Profile"
   * Only really happens on restarting the dev server
   * line below ensures it gets registered.
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const prof = Profile;
  const user = await User.findOne({email}).populate('profile');

  const defaultProfile = {
    blurbTypes: ['words of motivation', 'words of inspiration', 'words of encouragement'],
    tags: [],
    bio: '',
  }
  const profile = user?.profile || defaultProfile;

  const jsond = `'''${JSON.stringify(profile)}'''`
  const getBlurb = async () => {
    const openai = new OpenAI({
      apiKey: process.env.OPEN_AI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      // model: 'gpt-4o-mini',
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'you are an application that provides various unique text content catered to user profiles'},
        { role: 'system', content: 'you will be given a user profile in json'},
        // { role: 'system', content: 'learn about the user using the "bio" property'},
        { role: 'system', content: 'choose one type of message at random from "blurbTypes" property and write a message catered to this user using at most one tag from "tags" if there are any'},
        { role: 'system', content: 'your response should be in json format with properties: type, tag and content'},
        { role: 'user', content: jsond}
      ],
      response_format:  {"type": "json_object" }
    });
    return completion.choices[0].message.content;
  }
  let json = { content: ''};

  try {
    const blurb = await getBlurb();
    json = JSON.parse(blurb as string);
  } catch (e) {
    console.log(e);
  }


  return (
    <div className="min-h-screen w-screen flex items-start justify-center">
      <Paper>
        {json.content}
      </Paper>
    </div>
  );
}
