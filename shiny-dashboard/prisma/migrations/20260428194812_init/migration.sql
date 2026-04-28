-- CreateTable
CREATE TABLE "Job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "client" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sqft" INTEGER NOT NULL,
    "value" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "fieldRep" TEXT NOT NULL,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "services" TEXT NOT NULL,
    "urgent" BOOLEAN NOT NULL DEFAULT false,
    "aiSummary" TEXT,
    "aiFlags" TEXT,
    "hours" REAL,
    "basePrice" REAL,
    "addons" REAL,
    "notes" TEXT,
    "billingName" TEXT,
    "billingEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
