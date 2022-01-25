SELECT Department, Team,
SUM( [Jan Available Bandwidth (PD)] ) AS [Jan],
SUM( [Feb Available Bandwidth (PD)] ) AS [Feb],
SUM( [Mar Available Bandwidth (PD)] ) AS [Mar],
SUM( [Apr Available Bandwidth (PD)] ) AS [Apr],
SUM( [May Available Bandwidth (PD)] ) AS [May],
SUM( [Jun Available Bandwidth (PD)] ) AS [Jun],
SUM( [Jul Available Bandwidth (PD)] ) AS [Jul],
SUM( [Aug Available Bandwidth (PD)] ) AS [Aug],
SUM( [Sep Available Bandwidth (PD)] ) AS [Sep],
SUM( [Oct Available Bandwidth (PD)] ) AS [Oct],
SUM( [Nov Available Bandwidth (PD)] ) AS [Nov],
SUM( [Dec Available Bandwidth (PD)] ) AS [Dec]
FROM RMSData GROUP BY Department, Team;