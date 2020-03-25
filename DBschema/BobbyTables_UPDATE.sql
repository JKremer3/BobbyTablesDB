UPDATE Business, (select busId, count(*) as checkCount from checkin group by busId) as checkTbl
SET Business.numCheckins = checkTbl.checkCount
WHERE Business.busId = checkTbl.busId;