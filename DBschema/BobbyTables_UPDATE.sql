UPDATE Business, (select busId, count(*) as checkCount from checkin group by busId) as checkTbl
SET Business.numCheckins = checkTbl.checkCount
WHERE Business.busId = checkTbl.busId;

UPDATE Business, (select busId, count(*) as tipCount from Tip group by busId) as tipTbl
SET Business.numTips = tipTbl.tipCount
WHERE Business.busId = tipTbl.busId;

UPDATE Users, (select userId, count(*) as tipCount from Tip group by userId) as tipTbl
SET Users.tipCount = tipTbl.tipCount
WHERE Users.userId = tipTbl.userId;

UPDATE Users, (select userId, count(*) as tipCount from Tip group by userId) as tipTbl
SET Users.tipCount = tipTbl.tipCount
WHERE Users.userId = tipTbl.userId;

UPDATE Users
SET totalLikes = sumTbl.likeSum
from
(
    SELECT userId, SUM(likeCount) likeSum
    FROM Tip
    group by userId
) sumTbl
WHERE Users.userId = sumTbl.userId;