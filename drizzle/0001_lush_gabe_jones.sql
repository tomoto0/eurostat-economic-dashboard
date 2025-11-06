CREATE TABLE `ai_analysis_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`analysisType` varchar(50) NOT NULL,
	`targetCode` varchar(50),
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_analysis_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `economic_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`country` varchar(255) NOT NULL,
	`countryCode` varchar(2) NOT NULL,
	`indicator` varchar(255) NOT NULL,
	`indicatorCode` varchar(50) NOT NULL,
	`year` int NOT NULL,
	`value` varchar(255) NOT NULL,
	`unit` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `economic_data_id` PRIMARY KEY(`id`)
);
