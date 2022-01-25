CREATE TABLE IF NOT EXISTS RMSAudit (
    timeStamp TEXT NOT NULL,
    operation TEXT NOT NULL,
    user      TEXT NOT NULL,
    newData   TEXT,
    oldData   TEXT
);
