-- CreateTable
CREATE TABLE "educational_resource" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "category" VARCHAR(50) NOT NULL,

    CONSTRAINT "educational_resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_report" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organization_id" UUID NOT NULL,
    "report_date" DATE NOT NULL,
    "report_data" TEXT NOT NULL,

    CONSTRAINT "financial_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "halal_investment_product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "performance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "halal_investment_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "investment_portfolio_id" UUID NOT NULL,
    "halal_investment_product_id" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_portfolio" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,

    CONSTRAINT "investment_portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "owner_id" UUID NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255),
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "roq_user_id" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "financial_report" ADD CONSTRAINT "financial_report_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investment" ADD CONSTRAINT "investment_halal_investment_product_id_fkey" FOREIGN KEY ("halal_investment_product_id") REFERENCES "halal_investment_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investment" ADD CONSTRAINT "investment_investment_portfolio_id_fkey" FOREIGN KEY ("investment_portfolio_id") REFERENCES "investment_portfolio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "investment_portfolio" ADD CONSTRAINT "investment_portfolio_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

