CREATE TABLE Business(
    --Non-Composite Attributes
    busId NVARCHAR(25) NOT NULL,
    busName NVARCHAR(100) NOT NULL,
    city NVARCHAR(30) NOT NULL,
    busState CHAR(2) NOT NULL,
    postalCode CHAR(5) NOT NULL,
    lat REAL NOT NULL,
    long REAL NOT NULL,
    stars REAL,
    revCount INT NOT NULL,
    isOpen INT NOT NULL,
    PRIMARY KEY(busId)
);

CREATE TABLE BusCategory(
    --This table holds all categories associated with busness
    busId NVARCHAR(25) NOT NULL,
    category NVARCHAR(25),
    PRIMARY KEY(busId,category),
    FOREIGN KEY(busId) REFERENCES Business(busId)
);

CREATE TABLE BusAttributes(
    busId NVARCHAR(25) NOT NULL,
    --Begin attributes composite
    goodForKids BOOLEAN,
    noiseLevel VARCHAR(10),
    restDelivery BOOLEAN,
    alcohol VARCHAR(20),
    caters BOOLEAN,
    wifi BOOLEAN,
    takeOut BOOLEAN,
    accCreditCard BOOLEAN,
    tableService BOOLEAN,
    good4Groups BOOLEAN,
    outdoorSeat BOOLEAN,
    reservation BOOLEAN,
    priceRange INT,
    attire VARCHAR(10),
    PRIMARY KEY(busId),
    FOREIGN KEY(busId) REFERENCES Business(busId)
);

CREATE TABLE BusGoodForMeals(
    busId NVARCHAR(25) NOT NULL,
    --goodForMeal composite
    dessert BOOLEAN,
    lateNight BOOLEAN,
    lunch BOOLEAN,
    dinner BOOLEAN,
    brunch BOOLEAN,
    bfast BOOLEAN,
    PRIMARY KEY(busId),
    FOREIGN KEY(busId) REFERENCES Business(busId)
);

CREATE TABLE BusAmbience(
    busId NVARCHAR(25) NOT NULL,
    --Ambience composite
    romantic BOOLEAN,
    intimate BOOLEAN,
    touristy BOOLEAN,
    hipster BOOLEAN,
    divey BOOLEAN,
    classy BOOLEAN,
    trendy BOOLEAN,
    upscale BOOLEAN,
    casual BOOLEAN,
    PRIMARY KEY(busId),
    FOREIGN KEY(busId) REFERENCES Business(busId)
);

CREATE TABLE BusParking(
    busId NVARCHAR(25) NOT NULL,
    --parking composite
    garagePark BOOLEAN,
    streetPark BOOLEAN,
    lotPark BOOLEAN,
    valetPark BOOLEAN,
    PRIMARY KEY(busId),
    FOREIGN KEY(busId) REFERENCES Business(busId)
);

CREATE TABLE BusHours(
    busId NVARCHAR(25) NOT NULL,
    --Hours Composite
    monHrs VARCHAR(11),
    tueHrs VARCHAR(11),
    wedHrs VARCHAR(11),
    thuHrs VARCHAR(11),
    friHrs VARCHAR(11),
    satHrs VARCHAR(11),
    sunHrs VARCHAR(11),
    PRIMARY KEY(busId),
    FOREIGN KEY(busId) REFERENCES Business(busId)
);

CREATE TABLE User(
    avgStars REAL,
    cool INT NOT NULL,
    funny INT NOT NULL,
    numLikes INT,
    userName NVARCHAR(20) NOT NULL,
    tipCount INT NOT NULL,
    useful INT NOT NULL,
    userId NVARCHAR(25) NOT NULL,
    yelpStartDate CHAR(10) NOT NULL,
    yelpStartTime CHAR(8) NOT NULL,
    PRIMARY KEY (userId)
);

CREATE TABLE Tip(
    --table for the tip weak entity
    --tip requires both a valid user and busness ID
    busId NVARCHAR(25) NOT NULL,
    userId NVARCHAR(25) NOT NULL,
    likeCount INT,
    tipText NVARCHAR(150) NOT NULL,
    tipDate CHAR(10) NOT NULL,
    tipTime CHAR(8) NOT NULL,
    PRIMARY KEY(busId, userId),
    FOREIGN KEY busId REFERENCES Business(busId),
    FOREIGN Key userId REFERENCES User(userId)
);

CREATE TABLE Friends(
    --Table for the friends relation
    --userId and friendId must exist in User.userId
    userId NVARCHAR(25) NOT NULL,
    friendId NVARCHAR(25) NOT NULL,
    PRIMARY KEY (userId, friendId),
    FOREIGN KEY userId REFERENCES User(userId),
    FOREIGN KEY friendId REFERENCES User(userId)
);

CREATE TABLE checkin(
    --Table for the check-in weak entity
    --a checkin must be associated with a valid busness ID
    busId NVARCHAR(25) NOT NULL,
    checkDate CHAR(10) NOT NULL,
    checkMonth CHAR(2) NOT NULL,
    checkTime CHAR(8) NOT NULL,
    PRIMARY KEY (busId, checkDate, checkTime),
    FOREIGN KEY busId REFERENCES Business(busId)
);