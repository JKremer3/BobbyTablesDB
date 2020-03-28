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
CREATE OR UPDATE TRIGGER UpdateBusCheckins
AFTER INSERT OR DELETE ON checkin
FOR EACH ROW
EXECUTE PROCEDURE update_business_checkins();

--function to update business records with their tip count
create or replace function update_business_tips() RETURNS trigger 
as '
BEGIN
	UPDATE Business 
	SET numTips = (select count(busId) from Tip WHERE Business.busId = Tip.busId);
	RETURN NEW;
END
'LANGUAGE plpgsql;

--Trigger statement to call update_business_tips()
CREATE OR UPDATE TRIGGER UpdateBusTips
AFTER INSERT OR DELETE ON Tip
FOR EACH ROW
EXECUTE PROCEDURE update_business_tips();

--function to update Users records with their tip count
create or replace function update_users_tips() RETURNS trigger 
as '
BEGIN
	UPDATE Users 
	SET tipCount = (select count(userId) from Tip  WHERE Users.userId = Tip.userId);
	RETURN NEW;
END
' LANGUAGE plpgsql;

--Trigger statement to call update_users_tips()
CREATE OR UPDATE TRIGGER UpdateUsersTips
AFTER INSERT OR DELETE ON Tip
FOR EACH ROW
EXECUTE PROCEDURE update_users_tips();

--function to update Users records with their tip count
create or replace function update_users_totalLikes() RETURNS trigger 
as '
BEGIN
	UPDATE Users
	SET totalLikes = sumTbl.likeSum
	FROM
	(
		SELECT userId, SUM(likeCount) likeSum
		FROM Tip
		group by userId
	) sumTbl
	WHERE Users.userId = sumTbl.userId;
	RETURN NEW;
END
' LANGUAGE plpgsql;

--Trigger statement to call update_users_totalLikes() 
CREATE OR UPDATE TRIGGER UpdateUsersTotalLikes
AFTER INSERT OR DELETE OR UPDATE ON Tip
FOR EACH ROW
EXECUTE PROCEDURE update_users_totalLikes(); 