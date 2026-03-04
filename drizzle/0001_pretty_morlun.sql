CREATE TABLE "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "votes_product_user_idx" ON "votes" USING btree ("product_id","user_id");--> statement-breakpoint
CREATE INDEX "votes_product_id_idx" ON "votes" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "votes_user_id_idx" ON "votes" USING btree ("user_id");