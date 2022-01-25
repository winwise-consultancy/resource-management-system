DELETE FROM RMSData
WHERE
    [Department]    = (?)
AND [Team]          = (?)
AND [Employee Name] = (?)
;