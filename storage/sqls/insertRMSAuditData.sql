INSERT INTO RMSAudit
(
    [timestamp],
    [operation],
    [user],
    [newData],
    [oldData]
)
VALUES
(
    ?,
    ?,
    ?,
    ?,
    ?
)
