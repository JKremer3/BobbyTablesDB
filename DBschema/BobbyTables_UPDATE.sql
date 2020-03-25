UPDATE Business, (select busId, count(*) as checkCount from checkin group by busId) as checkTbl
SET Business.numCheckins = checkTbl.checkCount
WHERE Business.busId = checkTbl.busId;

UPDATE Business, (select busId, count(*) as tipCount from Tip group by busId) as tipTbl
SET Business.numTips = tipTbl.tipCount
WHERE Business.busId = tipTbl.busId;