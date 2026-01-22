import z from 'zod'

 export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  phone_number: z.string().optional(),
  role: z.enum(['ADMIN', 'RECRUITER', 'CANDIDATE']), 
  bio: z.string().optional(),
  resume: z.file().nullable() 
});
export interface Errors{
   name?:string,
   email?:string,
   password?:string,
   phone_number?:string,
   role?:string,
   bio?:string,
   resume?:string
}

export type SignupFormValues = z.infer<typeof signupSchema>;

