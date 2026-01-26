
export enum job_type {
  Fulltime="Fulltime",
  Parttime="Parttime",
  Contract=" Contract",
  Internship="Internship",
}

export enum job_location {
  Onsite,
  Remote,
  Hybrid
}

export enum application_status {
  Hired,
  Submitted,
  Rejected
}
export interface Company {
  company_id: number;
  name: string;
  logo: string;
  website: string;
}
export interface Job {
  job_id: number;
  title: string;
  description: string;
  salary: string;
  location: string;
  openings: number;
  role: string;
  jobType: string;
  work_location:string;
  is_active: boolean;
  company_id: number;
  recuiter_id: number;
  createdAt: string;
  updateAt: string;
  companis:Company;
}


export interface JobApplication {
  id: number;
  job_id: number;
  applicant_id: number;
  job:Job,
  applicant_email: string;
  resume: string;
  status:string;
  subsribed: boolean;
  applied_at: string;
}



export interface Company {
  company_id: number;
  name: string;
  logo: string;
}
export interface Job {
  job_id: number;
  title: string;
  description: string;
  
    companis:Company,
  salary: string; 
  location: string;
  jobType: string;
  openings: number;
  role: string;
  work_location: string,
  company_id: number;
  recuiter_id: number;
  is_active: boolean;
  createdAt: string;
  updateAt: string;
}
