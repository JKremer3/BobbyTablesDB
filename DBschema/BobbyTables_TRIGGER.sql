--function to update business records with their checkin count
create or replace function update_business_checkins() RETURNS trigger 
as '
BEGIN
	UPDATE Business
	SET numCheckins = (select count(busId) from checkin WHERE Business.busId = checkin.busId);
    RETURN NEW;
END
'LANGUAGE plpgsql;

--Trigger statement to call update_business_checkins()
CREATE TRIGGER UpdateBusCheckins
AFTER INSERT OR DELETE ON checkin
FOR EACH ROW
EXECUTE PROCEDURE update_business_checkins();

--function to update business records with their tip count
create function update_business_tips() RETURNS trigger 
as '
BEGIN
	UPDATE Business 
	SET numTips = (select count(busId) from Tip WHERE Business.busId = Tip.busId);
	RETURN NEW;
END
'LANGUAGE plpgsql;

--Trigger statement to call update_business_tips()
CREATE TRIGGER UpdateBusTips
AFTER INSERT OR DELETE ON Tip
FOR EACH ROW
EXECUTE PROCEDURE update_business_tips();

--function to update Users records with their tip count
create or replace function update_users_tips() RETURNS trigger 
as '
BEGIN
	UPDATE Users SET tipCount = res.ccount FROM ( SELECT userId, COUNT(userId) ccount FROM Tip GROUP BY Tip.userId) res WHERE Users.userId = res.userId;
	RETURN NEW;
END
' LANGUAGE plpgsql;

--Trigger statement to call update_users_tips()
CREATE TRIGGER UpdateUsersTips
AFTER INSERT OR DELETE ON Tip
FOR EACH ROW
EXECUTE PROCEDURE update_users_tips();

--function to update Users records with their tip count
create or replace function update_users_totalLikes() RETURNS trigger 
as '
BEGIN
	UPDATE Users SET totalLikes = res.likeSum FROM
	(SELECT Tip.userID, SUM(likeCount) likeSum
	FROM Tip
	GROUP BY userID) res WHERE Users.userId = res.userId;
	RETURN NEW;
END
' LANGUAGE plpgsql;

--Trigger statement to call update_users_totalLikes() 
CREATE TRIGGER UpdateUsersTotalLikes
AFTER INSERT OR DELETE OR UPDATE ON Tip
FOR EACH ROW
EXECUTE PROCEDURE update_users_totalLikes(); 