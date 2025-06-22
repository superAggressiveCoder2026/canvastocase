"use client";
import z from "zod";
import{Form, FormControl,FormField,FormItem,
    FormLabel,FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQueryClient} from "@tanstack/react-query";

import { loginSchema } from "../../schemas";
import { useForm } from "react-hook-form";
import { Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { useTRPC } from "@/trpc/client";
import {toast} from "sonner"
import { useRouter } from "next/navigation";

const poppins=Poppins({
    subsets:["latin"], 
    weight:["700"],
})

export const SignInView = (values:z.infer<typeof loginSchema>) =>{
     const router =useRouter();

     const trpc = useTRPC();
     const queryClient =useQueryClient();

    const login =useMutation(trpc.auth.login.mutationOptions({
        onError:(error)=>{
            toast.error(error.message);   
   },
        onSuccess:async()=>{
            
            router.push("/");
},
}));


    const form= useForm<z.infer<typeof loginSchema>>({
        mode:"all",
        resolver:zodResolver(loginSchema),
        defaultValues:{
        email:"",
        password:"",
    },
    });
    const onSubmit=(values:z.infer<typeof loginSchema>) =>{
        login.mutate(values);
    }

return(
    <div className="grid grid-cols-1 lg:grid-cols-5">
        <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
          <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 p-4 lg:p-16 "
            >
                <div className="flex items-center justify-between mb-8">
                    <Link href="/">
                      <span className={cn("text-2xl font-semibold",poppins.className)}>
                          canvas_to_case
                      </span>
                    </Link>
                    <Button 
                      asChild
                      variant="ghost"
                      size="sm"
                       className="text-base border-none underline">
                        <Link  href="/sign-up">
                            Sign up
                        </Link>
                    </Button>
                </div>
                <h1 className="text-4xl font-medium">
                    Welcome back to canvas_to_case
                </h1>
                
                <FormField 
                name="email"
                render={({field})=>(
                    <FormItem>
                        <FormLabel className="text-base">Email</FormLabel>
                        <FormControl>
                            <Input {...field}/>
                        </FormControl>
                        
                        <FormMessage/>
                    </FormItem>
                )}
                
                />
                <FormField 
                name="password"
                render={({field})=>(
                    <FormItem>
                        <FormLabel className="text-base">Password</FormLabel>
                        <FormControl>
                            <Input {...field} type="password"/>
                        </FormControl>
                        
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <Button 
                disabled={login.isPending}
                type="submit"
                size="lg"
                variant="elevated"
                className="bg-black text-white hover:bg-pink-400 hover:text-primary"
                >
                    log in
                </Button>
            </form>
          </Form>
          </div>
        <div  
         className="h-screen w-full lg:col-span-2 hidden lg:block" 
            style={{
                backgroundImage:"url('auth.png')",
                backgroundSize:"cover",
                backgroundPosition:"left",
            }}
        />
        
    </div>
);
};



