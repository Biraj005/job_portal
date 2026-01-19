-- CreateEnum
CREATE TYPE "job_type" AS ENUM ('Fulltime', 'Parttime', 'Contract', 'Internship');

-- CreateEnum
CREATE TYPE "job_location" AS ENUM ('Onsite', 'Remote', 'Hybrid');

-- CreateEnum
CREATE TYPE "application_status" AS ENUM ('Hired', 'Submitted', 'Rejected');

-- CreateTable
CREATE TABLE "Companies" (
    "company_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "logo_public_id" TEXT NOT NULL,
    "recurter_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Companies_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "Jobs" (
    "job_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "salary" DECIMAL(10,2) NOT NULL,
    "location" TEXT NOT NULL,
    "jobType" "job_type" NOT NULL,
    "openings" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "work_location" "job_location" NOT NULL,
    "company_id" INTEGER NOT NULL,
    "recuiter_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Jobs_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "applicant_id" INTEGER NOT NULL,
    "applicant_email" TEXT NOT NULL,
    "status" "application_status" NOT NULL DEFAULT 'Submitted',
    "resume" TEXT NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subsribed" BOOLEAN NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Companies_name_key" ON "Companies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "applications_job_id_applicant_id_key" ON "applications"("job_id", "applicant_id");

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Companies"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Jobs"("job_id") ON DELETE CASCADE ON UPDATE CASCADE;
