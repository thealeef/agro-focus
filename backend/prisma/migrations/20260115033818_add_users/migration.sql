/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Despesa` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Talhao` table. All the data in the column will be lost.
  - You are about to drop the column `safra` on the `Talhao` table. All the data in the column will be lost.
  - You are about to drop the column `tamanhoHectares` on the `Talhao` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Talhao` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Despesa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "categoria" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "talhaoId" TEXT NOT NULL,
    CONSTRAINT "Despesa_talhaoId_fkey" FOREIGN KEY ("talhaoId") REFERENCES "Talhao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Despesa" ("categoria", "data", "descricao", "id", "talhaoId", "valor") SELECT "categoria", "data", "descricao", "id", "talhaoId", "valor" FROM "Despesa";
DROP TABLE "Despesa";
ALTER TABLE "new_Despesa" RENAME TO "Despesa";
CREATE TABLE "new_Talhao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cultura" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Talhao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Talhao" ("cultura", "id", "nome") SELECT "cultura", "id", "nome" FROM "Talhao";
DROP TABLE "Talhao";
ALTER TABLE "new_Talhao" RENAME TO "Talhao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
