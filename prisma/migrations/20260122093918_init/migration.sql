-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';
