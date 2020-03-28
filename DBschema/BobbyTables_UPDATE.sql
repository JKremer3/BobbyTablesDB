UPDATE Business
SET numCheckins = (select count(busId) from checkin WHERE Business.busId = checkin.busId);

UPDATE Business 
SET numTips = (select count(busId) from Tip WHERE Business.busId = Tip.busId);

UPDATE Users 
SET tipCount = (select count(userId) from Tip WHERE Users.userId = Tip.userId);

UPDATE Users
SET totalLikes = sumTbl.likeSum
from
(
   	SELECT userId, SUM(likeCount) as likeSum
  	FROM Tip
   	group by userId
) sumTbl
WHERE Users.userId = sumTbl.userId;