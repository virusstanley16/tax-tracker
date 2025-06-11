/*
  Warnings:

  - You are about to drop the `notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `registers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_registerId_fkey`;

-- DropTable
DROP TABLE `notification`;

-- DropTable
DROP TABLE `payments`;

-- DropTable
DROP TABLE `registers`;

-- CreateTable
CREATE TABLE `Register` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `owner_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `phone` INTEGER NOT NULL,
    `tax_type` VARCHAR(50) NOT NULL,
    `payment_date` DATETIME(3) NOT NULL,
    `amount_due` DOUBLE NOT NULL,
    `description` TEXT NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',

    UNIQUE INDEX `Register_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
