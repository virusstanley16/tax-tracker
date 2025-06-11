/*
  Warnings:

  - You are about to drop the column `businessId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `businesses` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `registerId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_businessId_fkey`;

-- DropIndex
DROP INDEX `payments_businessId_fkey` ON `payments`;

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `businessId`,
    ADD COLUMN `registerId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `businesses`;

-- CreateTable
CREATE TABLE `registers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `ownerName` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `phone` INTEGER NOT NULL,
    `tax_type` VARCHAR(50) NOT NULL,
    `payment_date` DATETIME(3) NOT NULL,
    `amount_due` DECIMAL(65, 30) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `due_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_registerId_fkey` FOREIGN KEY (`registerId`) REFERENCES `registers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
