--function to update business records with their checkin count
create or replace function update_business_checkins() 
    RETURNS trigger 
as $update_business_checkins$ 
    BEGIN
        UPDATE Business, (select busId, count(*) as checkCount from checkin group by busId) as checkTbl
            SET Business.numCheckins = checkTbl.checkCount
            WHERE Business.busId = checkTbl.busId;
        RETURN NEW;
$update_business_checkins$ 
LANGUAGE plpgsql;

--Trigger statement to call the update function
CREATE TRIGGER UpdateBusCheckins
AFTER INSERT OR DELETE ON checkin
FOR EACH ROW
EXECUTE PROCEDURE update_business_checkins();

--function to update business records with their tip count
create or replace function update_business_tips() 
    RETURNS trigger 
as $update_business_tips$ 
    BEGIN
        UPDATE Business, (select busId, count(*) as tipCount from Tip group by busId) as tipTbl
            SET Business.numTips = tipTbl.tipCount
            WHERE Business.busId = tipTbl.busId;
        RETURN NEW;
$update_business_tips$ 
LANGUAGE plpgsql;

--Trigger statement to call the update function
CREATE TRIGGER UpdateBusTips
AFTER INSERT OR DELETE ON Tip
FOR EACH ROW
EXECUTE PROCEDURE update_business_tips();  