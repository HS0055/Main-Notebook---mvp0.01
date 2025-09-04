CREATE TABLE `layout_patterns` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`keywords` text NOT NULL,
	`svg_template` text NOT NULL,
	`editable_elements` text NOT NULL,
	`popularity` integer DEFAULT 0,
	`tags` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_layout_preferences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`preferred_categories` text,
	`custom_layouts` text,
	`usage_stats` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `pages` ADD `paper_style` text;--> statement-breakpoint
ALTER TABLE `pages` ADD `template_overlay` text;