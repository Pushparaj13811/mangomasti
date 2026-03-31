CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"address" varchar(200),
	"variety" varchar(100),
	"rating" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"body" text NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
