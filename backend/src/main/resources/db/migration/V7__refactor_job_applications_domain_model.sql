ALTER TABLE job_applications
    CHANGE COLUMN position job_title VARCHAR(150) NOT NULL,
    CHANGE COLUMN location job_location VARCHAR(150) NULL,
    ADD COLUMN job_url VARCHAR(500) NULL AFTER status,
    ADD COLUMN priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM' AFTER status,
    ADD COLUMN source VARCHAR(50) NULL AFTER job_url,
    ADD COLUMN salary_min INT NULL AFTER applied_date,
    ADD COLUMN salary_max INT NULL AFTER salary_min,
    ADD COLUMN job_type VARCHAR(50) NULL AFTER salary_max,
    ADD COLUMN next_action VARCHAR(255) NULL AFTER notes,
    ADD COLUMN next_action_date DATE NULL AFTER next_action,
    ADD COLUMN recruiter_name VARCHAR(150) NULL AFTER next_action_date,
    ADD COLUMN recruiter_phone VARCHAR(50) NULL AFTER recruiter_name,
    ADD COLUMN recruiter_email VARCHAR(255) NULL AFTER recruiter_phone;

UPDATE job_applications
SET status = CASE status
    WHEN 'INTERVIEW' THEN 'INTERVIEWED'
    WHEN 'OFFER' THEN 'OFFER_RECEIVED'
    ELSE status
END;

ALTER TABLE job_applications
    DROP COLUMN full_name,
    DROP COLUMN email,
    DROP COLUMN phone,
    DROP COLUMN years_experience,
    DROP COLUMN available_from,
    DROP COLUMN work_type,
    DROP COLUMN salary_expectation,
    DROP COLUMN portfolio_url,
    DROP COLUMN linkedin_url;
