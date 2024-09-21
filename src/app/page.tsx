import Image from "next/image";
import styles from './page.module.css';
import OpenAI from 'openai';

/**
 * this is a server component (for now)
 * - 
 */

export default async function Home() {

  const getBlurb = async () => {
    const openai = new OpenAI({
      apiKey: process.env.OPEN_AI_API_KEY,
    });

    const prompt = 'write a motivational quote for a nurse before her shift';
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'you are a motivational application'},
        { role: 'user', content: prompt }
      ]
    });
    return completion.choices[0].message.content;
  }

  const blurb = await getBlurb();


  return (
    <div className="min-h-screen w-screen flex items-start justify-center">
      <section className={`min-w-40 max-w-xl p-10 mt-32 bg-white rounded-lg shadow-sm ${styles.blurb}`}>
        {blurb}
      </section>
    </div>
  );
}
