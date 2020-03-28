UPDATE Business
SET numCheckins = (select count(busId) from checkin WHERE Business.busId = checkin.busId);

UPDATE Business 
SET numTips = (select count(busId) from Tip WHERE Business.busId = Tip.busId);

UPDATE Users SET tipCount = res.ccount 
FROM 
( 
    SELECT userId, COUNT(userId) ccount 
    FROM Tip 
    GROUP BY Tip.userId
) res 
WHERE Users.userId = res.userId;

UPDATE Users SET totalLikes = res.likeSum 
FROM
(
    SELECT Tip.userID, SUM(likeCount) likeSum
    FROM Tip
    GROUP BY userID
) res 
WHERE Users.userId = res.userId;