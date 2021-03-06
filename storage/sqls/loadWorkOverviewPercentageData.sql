SELECT Department, Team,
COUNT(*) AS COUNT,
SUM( [Jan Available Bandwidth (%)] )/COUNT(*) AS [Jan],
SUM( [Feb Available Bandwidth (%)] )/COUNT(*) AS [Feb],
SUM( [Mar Available Bandwidth (%)] )/COUNT(*) AS [Mar],
SUM( [Apr Available Bandwidth (%)] )/COUNT(*) AS [Apr],
SUM( [May Available Bandwidth (%)] )/COUNT(*) AS [May],
SUM( [Jun Available Bandwidth (%)] )/COUNT(*) AS [Jun],
SUM( [Jul Available Bandwidth (%)] )/COUNT(*) AS [Jul],
SUM( [Aug Available Bandwidth (%)] )/COUNT(*) AS [Aug],
SUM( [Sep Available Bandwidth (%)] )/COUNT(*) AS [Sep],
SUM( [Oct Available Bandwidth (%)] )/COUNT(*) AS [Oct],
SUM( [Nov Available Bandwidth (%)] )/COUNT(*) AS [Nov],
SUM( [Dec Available Bandwidth (%)] )/COUNT(*) AS [Dec]
FROM RMSData GROUP BY Department, Team;