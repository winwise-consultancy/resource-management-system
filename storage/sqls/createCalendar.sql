CREATE TABLE IF NOT EXISTS Calendar (
    [Months]       TEXT NOT NULL,
    [BusinessDays] INTEGER DEFAULT 0,

    PRIMARY KEY (Months, BusinessDays)
);