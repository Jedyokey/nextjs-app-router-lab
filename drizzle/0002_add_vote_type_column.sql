ALTER TABLE "votes" ADD COLUMN "vote_type" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "votes" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();