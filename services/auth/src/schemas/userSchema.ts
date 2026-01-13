import z from 'zod';


export const IUser = z.object({
    name: z.string('Must be a string').min(1, 'Name is required'),
    email: z.email('Invalid email address'),
    password: z.string('Password must be a string').min(6, 'Password must be at least 6 characters long'),
    phone_number: z.string().optional(),
    role: z.enum(['ADMIN', 'RECRUITER', 'CANDIDATE'], 'Must be user or admin').default('CANDIDATE'),
    bio: z.string().optional(),
    resume: z.string().optional()
})


export type User = z.infer<typeof IUser>;