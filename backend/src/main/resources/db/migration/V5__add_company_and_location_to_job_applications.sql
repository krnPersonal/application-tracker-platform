ALTER TABLE job_applications
    ADD COLUMN company_name VARCHAR(150) NOT NULL DEFAULT '' AFTER phone,
    ADD COLUMN location VARCHAR(150) NULL AFTER company_name;
