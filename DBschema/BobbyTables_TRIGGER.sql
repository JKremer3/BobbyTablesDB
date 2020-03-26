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

CREATE TRIGGER UpdateBusCheckins
AFTER INSERT OR DELETE ON checkin
FOR EACH ROW
EXECUTE PROCEDURE update_business_checkins();  