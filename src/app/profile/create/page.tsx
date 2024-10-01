'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRouter } from "next/navigation";

// can only create a profile on an existing user...
// so if not authenticated, redirect to login
import { useSession } from 'next-auth/react';

const blurbTypes = [
  {
    id: "prayer",
    label: "Prayer"
  },
  {
    id: "joke",
    label: "Joke"
  },
  {
    id: "motivation",
    label: "Words to motivate"
  },
  {
    id: "anecdote",
    label: "Anecdote"
  },
];
const FormSchema = z.object({
  blurbTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  // other stuff here like tags and bio
  bio: z
    .string()
    .min(10, { message: "Bio must be at least 10 characters"})
    .max(160, { message: "Bio must not be longer than 30 characters."}),
  tags: z.array(z.string()).max(50, { message: "Please limit tags to at most 20"})
})


export default function CreateProfile() {
  const router = useRouter();
  const url = 'http://localhost:3000/api/profile';

  // testing out shadcn forms
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      blurbTypes: [],
      bio: "",
      tags: [],
    },
  });


  
  async function onSubmit (data: z.infer<typeof FormSchema>) {
    try {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify(data)
      });
      router.push('/profile')
    } catch (e) {
      // something went wrong... display an error i suppose

    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen w-screen">
        <Card className="w-fit min-w-[500px] max-w-xl">
          <CardHeader>
            <CardTitle className="text-3xl">Create Profile</CardTitle>
            <CardDescription>Fill out the form below to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-8">
                <FormField 
                  control={form.control}
                  name="blurbTypes"
                  render={()=> (
                    <FormItem>
                      <div className="mb-1">
                        <FormLabel>Content Types</FormLabel>
                        <FormDescription>Select what you want generated</FormDescription>
                      </div>
                      {blurbTypes.map(blurb => (
                        <FormField
                          key={blurb.id}
                          control={form.control}
                          name="blurbTypes"
                          render={({field}) => {
                            return (
                              <FormItem
                                key={blurb.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(blurb.id)}
                                    onCheckedChange={(checked) => {
                                      return checked 
                                        ? field.onChange([...field.value, blurb.id])
                                        : field.onChange(field.value?.filter((value) => value !== blurb.id))
                                    }}
                                  ></Checkbox>
                                </FormControl>
                                <FormLabel className="font-normal">
                                    {blurb.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                          ></FormField>
                        ))}
                      <FormMessage />
                    </FormItem>
                  )}
                >
                </FormField>
                <FormField
                  control={form.control}
                  name="tags"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormDescription>What are you interested in?</FormDescription>
                      <FormControl>
                        <Input onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>)=> {
                          if (e.key === 'Enter') {
                            e.preventDefault(); // so we don't submit form
                            const target = e.target as HTMLInputElement;
                            let val = target.value;
                            field.onChange([...field.value, val]);
                            target.value = '';
                          }
                        }}></Input>
                      </FormControl>
                      <div className="flex gap-1 flex-wrap">
                        {field.value.map((item, idx) => (
                          <Badge key={idx} onClick={() => { 
                            field.onChange(field.value.filter(x => item !== x))
                          }}>{item}</Badge>
                        ))}
                      </div>
                    </FormItem>
                  )}
                >

                </FormField>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormDescription>This will help us better tailor your content.</FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
                          className="resize-none"
                          {...field}
                        ></Textarea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                >
                </FormField>
                <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button>
              </form>
              
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}