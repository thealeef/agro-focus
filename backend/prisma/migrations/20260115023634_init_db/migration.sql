-- CreateTable
CREATE TABLE "Talhao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "tamanhoHectares" REAL NOT NULL,
    "cultura" TEXT NOT NULL,
    "safra" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Despesa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "categoria" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "talhaoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Despesa_talhaoId_fkey" FOREIGN KEY ("talhaoId") REFERENCES "Talhao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
