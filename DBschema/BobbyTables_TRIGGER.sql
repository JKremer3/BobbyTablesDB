create function update_business_checkins() RETURNS trigger as $update_business_checkins$ 
    BEGIN
    --
    --update business.numCheckins()
    --