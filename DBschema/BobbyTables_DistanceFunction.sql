CREATE OR REPLACE FUNCTION distance(lat1 numeric(9, 6), lon1 numeric(9, 6), lat2 numeric(9, 6), lon2 numeric(9, 6)) RETURNS numeric(9, 6) AS $$
DECLARE                                                   
    x float = 69.1 * (lat2 - lat1);                           
    y float = 69.1 * (lon2 - lon1) * cos(lat1 / 57.3);        
BEGIN                                                     
    RETURN sqrt(x * x + y * y);                               
END  
$$ LANGUAGE plpgsql; 