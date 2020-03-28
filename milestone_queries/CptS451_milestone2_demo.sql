
--GLOSSARY
--table names
/*Business
Users
Tip
Friends
checkin
BusCategory
BusAttributes
BusHours

--some attribute names
postalCode
busId
city   --(business city)
busName   --(business name)
userId
friendId
numTips
numCheckins

userId
tipCount  --(user)
totalLikes --(user)

tipDate
tipText
likeCount  --(tip)

checkYear
checkMonth
checkDate
checkTime
*/

--1.
SELECT COUNT(*) 
FROM  Business;
SELECT COUNT(*) 
FROM  Users;
SELECT COUNT(*) 
FROM  Tip;
SELECT COUNT(*) 
FROM  Friends;
SELECT COUNT(*) 
FROM  checkin;
SELECT COUNT(*) 
FROM  busCategory;
SELECT COUNT(*) 
FROM  BusAttributes;
SELECT COUNT(*) 
FROM  BusHours;



--2. Run the following queries on your business table, checkin table and review table. Make sure to change the attribute names based on your schema. 

SELECT postalCode, count(busId) 
FROM Business
GROUP BY postalCode
HAVING count(busId) > 500
ORDER BY postalCode;

SELECT postalCode, COUNT(distinct C.category)
FROM Business as B, busCategory as C
WHERE B.busId = C.busId
GROUP BY postalCode
HAVING count(distinct C.category)>300
ORDER BY postalCode;

SELECT postalCode, COUNT(distinct A.attributeName)
FROM Business as B, busAttributes as A
WHERE B.busId = A.busId
GROUP BY postalCode
HAVING count(distinct A.attributeName)>65;


--3. Run the following queries on your business table, checkin table and tips table. Make sure to change the attribute names based on your schema. 

SELECT Users.userId, count(friendId)
FROM Users, Friends
WHERE Users.userId = Friends.userId AND 
      Users.userId = 'zvQ7B3KZuFOX7pYLsOxhpA'
GROUP BY Users.userId;


SELECT busId, busName, city, numtips, numCheckins 
FROM Business 
WHERE busId ='UvF68aNDfzCWQbxO6-647g' ;

SELECT userId, userName, tipcount, totallikes
FROM Users
WHERE userId = 'i3bLA4sEdFk8j3Pq6tx8wQ';

-----------

SELECT COUNT(*) 
FROM checkin
WHERE busId ='UvF68aNDfzCWQbxO6-647g';

SELECT count(*)
FROM Tip
WHERE  busId = 'UvF68aNDfzCWQbxO6-647g';



--4. 
--Type the following statements. Make sure to change the attribute names based on your schema. 

SELECT COUNT(*) 
FROM checkin
WHERE busId ='M007_bAIM34x1yd138zhSQ';

SELECT busId,busName, city, numCheckins, numtips
FROM Business 
WHERE busId ='M007_bAIM34x1yd138zhSQ';

INSERT INTO checkin (busId, checkYear,checkMonth, checkDate,checkTime)
VALUES ('M007_bAIM34x1yd138zhSQ','2020','03','27','15:00');


--5.
--Type the following statements. Make sure to change the attribute names based on your schema.  

SELECT busId,busName, city, numCheckins, numtips
FROM Business 
WHERE busId ='M007_bAIM34x1yd138zhSQ';

SELECT userId, userName, tipcount, totallikes
FROM Users
WHERE userId = 'rRrFcSEZOTw6iZagsIwTFQ';


INSERT INTO Tip (userId, busId, tipdate, tipTime,tiptext, likeCount)  
VALUES ('rRrFcSEZOTw6iZagsIwTFQ','M007_bAIM34x1yd138zhSQ', '2020-03-27', '13:00','EVERYTHING IS AWESOME',0);

UPDATE Tip 
SET likeCount = likeCount+1
WHERE userId = 'rRrFcSEZOTw6iZagsIwTFQ' AND 
      busId = 'M007_bAIM34x1yd138zhSQ' AND 
      tipdate ='2020-03-27' AND
      tipTime = '13:00';

SELECT userId, userName, tipcount, totallikes
FROM Users
WHERE userId = 'rRrFcSEZOTw6iZagsIwTFQ';
      