-- CreateTable
CREATE TABLE "public"."LandingPage" (
    "id" TEXT NOT NULL,
    "prompt" TEXT,
    "html" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingPage_pkey" PRIMARY KEY ("id")
);
