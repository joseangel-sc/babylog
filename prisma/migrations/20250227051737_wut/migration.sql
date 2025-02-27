-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT 'Unknown',
    "lastName" TEXT NOT NULL DEFAULT 'User',
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Baby" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Baby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BabyCaregiver" (
    "id" SERIAL NOT NULL,
    "relationship" TEXT NOT NULL,
    "permissions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "babyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "BabyCaregiver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Elimination" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "weight" DOUBLE PRECISION,
    "success" BOOLEAN NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "babyId" INTEGER NOT NULL,

    CONSTRAINT "Elimination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feeding" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "side" TEXT,
    "amount" DOUBLE PRECISION,
    "food" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "babyId" INTEGER NOT NULL,

    CONSTRAINT "Feeding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sleep" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "location" TEXT,
    "quality" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "babyId" INTEGER NOT NULL,

    CONSTRAINT "Sleep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "description" TEXT,
    "milestone" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "babyId" INTEGER NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "babyId" INTEGER NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthRecord" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "description" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "babyId" INTEGER NOT NULL,

    CONSTRAINT "HealthRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measurement" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "headCirc" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "babyId" INTEGER NOT NULL,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "babyId" INTEGER NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BabyPhoto" (
    "babyId" INTEGER NOT NULL,
    "photoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BabyPhoto_pkey" PRIMARY KEY ("babyId","photoId")
);

-- CreateTable
CREATE TABLE "AlbumPhoto" (
    "albumId" INTEGER NOT NULL,
    "photoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlbumPhoto_pkey" PRIMARY KEY ("albumId","photoId")
);

-- CreateTable
CREATE TABLE "ActivityPhoto" (
    "activityId" INTEGER NOT NULL,
    "photoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityPhoto_pkey" PRIMARY KEY ("activityId","photoId")
);

-- CreateTable
CREATE TABLE "MilestonePhoto" (
    "milestoneId" INTEGER NOT NULL,
    "photoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MilestonePhoto_pkey" PRIMARY KEY ("milestoneId","photoId")
);

-- CreateTable
CREATE TABLE "AlbumAccess" (
    "id" SERIAL NOT NULL,
    "permissions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "albumId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AlbumAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentInvite" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "babyId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Baby_dateOfBirth_idx" ON "Baby"("dateOfBirth");

-- CreateIndex
CREATE INDEX "BabyCaregiver_babyId_idx" ON "BabyCaregiver"("babyId");

-- CreateIndex
CREATE INDEX "BabyCaregiver_userId_idx" ON "BabyCaregiver"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BabyCaregiver_babyId_userId_key" ON "BabyCaregiver"("babyId", "userId");

-- CreateIndex
CREATE INDEX "Elimination_timestamp_idx" ON "Elimination"("timestamp");

-- CreateIndex
CREATE INDEX "Elimination_babyId_timestamp_idx" ON "Elimination"("babyId", "timestamp");

-- CreateIndex
CREATE INDEX "Feeding_startTime_idx" ON "Feeding"("startTime");

-- CreateIndex
CREATE INDEX "Feeding_babyId_startTime_idx" ON "Feeding"("babyId", "startTime");

-- CreateIndex
CREATE INDEX "Sleep_startTime_idx" ON "Sleep"("startTime");

-- CreateIndex
CREATE INDEX "Sleep_babyId_startTime_idx" ON "Sleep"("babyId", "startTime");

-- CreateIndex
CREATE INDEX "Activity_startTime_idx" ON "Activity"("startTime");

-- CreateIndex
CREATE INDEX "Activity_babyId_startTime_idx" ON "Activity"("babyId", "startTime");

-- CreateIndex
CREATE INDEX "Milestone_date_idx" ON "Milestone"("date");

-- CreateIndex
CREATE INDEX "Milestone_babyId_date_idx" ON "Milestone"("babyId", "date");

-- CreateIndex
CREATE INDEX "HealthRecord_timestamp_idx" ON "HealthRecord"("timestamp");

-- CreateIndex
CREATE INDEX "HealthRecord_babyId_timestamp_idx" ON "HealthRecord"("babyId", "timestamp");

-- CreateIndex
CREATE INDEX "Measurement_date_idx" ON "Measurement"("date");

-- CreateIndex
CREATE INDEX "Measurement_babyId_date_idx" ON "Measurement"("babyId", "date");

-- CreateIndex
CREATE INDEX "Album_babyId_idx" ON "Album"("babyId");

-- CreateIndex
CREATE INDEX "Photo_timestamp_idx" ON "Photo"("timestamp");

-- CreateIndex
CREATE INDEX "BabyPhoto_babyId_idx" ON "BabyPhoto"("babyId");

-- CreateIndex
CREATE INDEX "BabyPhoto_photoId_idx" ON "BabyPhoto"("photoId");

-- CreateIndex
CREATE INDEX "AlbumPhoto_albumId_idx" ON "AlbumPhoto"("albumId");

-- CreateIndex
CREATE INDEX "AlbumPhoto_photoId_idx" ON "AlbumPhoto"("photoId");

-- CreateIndex
CREATE INDEX "ActivityPhoto_activityId_idx" ON "ActivityPhoto"("activityId");

-- CreateIndex
CREATE INDEX "ActivityPhoto_photoId_idx" ON "ActivityPhoto"("photoId");

-- CreateIndex
CREATE INDEX "MilestonePhoto_milestoneId_idx" ON "MilestonePhoto"("milestoneId");

-- CreateIndex
CREATE INDEX "MilestonePhoto_photoId_idx" ON "MilestonePhoto"("photoId");

-- CreateIndex
CREATE INDEX "AlbumAccess_albumId_idx" ON "AlbumAccess"("albumId");

-- CreateIndex
CREATE INDEX "AlbumAccess_userId_idx" ON "AlbumAccess"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AlbumAccess_albumId_userId_key" ON "AlbumAccess"("albumId", "userId");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");

-- CreateIndex
CREATE INDEX "ParentInvite_senderId_idx" ON "ParentInvite"("senderId");

-- CreateIndex
CREATE UNIQUE INDEX "ParentInvite_email_babyId_key" ON "ParentInvite"("email", "babyId");

-- AddForeignKey
ALTER TABLE "Baby" ADD CONSTRAINT "Baby_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BabyCaregiver" ADD CONSTRAINT "BabyCaregiver_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BabyCaregiver" ADD CONSTRAINT "BabyCaregiver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Elimination" ADD CONSTRAINT "Elimination_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feeding" ADD CONSTRAINT "Feeding_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sleep" ADD CONSTRAINT "Sleep_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthRecord" ADD CONSTRAINT "HealthRecord_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BabyPhoto" ADD CONSTRAINT "BabyPhoto_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BabyPhoto" ADD CONSTRAINT "BabyPhoto_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumPhoto" ADD CONSTRAINT "AlbumPhoto_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumPhoto" ADD CONSTRAINT "AlbumPhoto_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityPhoto" ADD CONSTRAINT "ActivityPhoto_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityPhoto" ADD CONSTRAINT "ActivityPhoto_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestonePhoto" ADD CONSTRAINT "MilestonePhoto_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MilestonePhoto" ADD CONSTRAINT "MilestonePhoto_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumAccess" ADD CONSTRAINT "AlbumAccess_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumAccess" ADD CONSTRAINT "AlbumAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentInvite" ADD CONSTRAINT "ParentInvite_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentInvite" ADD CONSTRAINT "ParentInvite_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
