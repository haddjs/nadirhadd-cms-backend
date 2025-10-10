-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "logged_in" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."About" (
    "user_id" INTEGER NOT NULL,
    "profile_picture" TEXT,
    "summary_profile" TEXT,

    CONSTRAINT "About_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."Projects" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "project_title" TEXT NOT NULL,
    "project_description" TEXT,
    "live_url" TEXT,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project_Tech" (
    "project_id" INTEGER NOT NULL,
    "tech_id" INTEGER NOT NULL,

    CONSTRAINT "Project_Tech_pkey" PRIMARY KEY ("project_id","tech_id")
);

-- CreateTable
CREATE TABLE "public"."Experiences" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "company_name" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "job_description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),

    CONSTRAINT "Experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Experiences_Tech" (
    "experience_id" INTEGER NOT NULL,
    "tech_id" INTEGER NOT NULL,

    CONSTRAINT "Experiences_Tech_pkey" PRIMARY KEY ("experience_id","tech_id")
);

-- CreateTable
CREATE TABLE "public"."Technologies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Technologies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- AddForeignKey
ALTER TABLE "public"."About" ADD CONSTRAINT "About_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Projects" ADD CONSTRAINT "Projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project_Tech" ADD CONSTRAINT "Project_Tech_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project_Tech" ADD CONSTRAINT "Project_Tech_tech_id_fkey" FOREIGN KEY ("tech_id") REFERENCES "public"."Technologies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Experiences" ADD CONSTRAINT "Experiences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Experiences_Tech" ADD CONSTRAINT "Experiences_Tech_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "public"."Experiences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Experiences_Tech" ADD CONSTRAINT "Experiences_Tech_tech_id_fkey" FOREIGN KEY ("tech_id") REFERENCES "public"."Technologies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
