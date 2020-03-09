CREATE TABLE Business(
    --Non-Composite Attributes
    busId NVARCHAR(25) NOT NULL,
    busName NVARCHAR(100) NOT NULL,
    city NVARCHAR(30) NOT NULL,
    busState CHAR(2) NOT NULL,
    postalCode CHAR(5) NOT NULL,
    lat CHAR(13) NOT NULL, --i.e. "40° 44' 54" N"
    long CHAR(13) NOT NULL,
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
    attributeName NVARCHAR(20) NOT NULL,
    attributeVal NVARCHAR(30) NOT NULL,
    PRIMARY KEY(busId, attributeName),
    FOREIGN KEY(busId) REFERENCES Business(busId)
);

CREATE TABLE BusGoodForMeals(
    busId NVARCHAR(25) NOT NULL,
    mealType NVARCHAR(10) NOT NULL,
    mealVal BOOLEAN,
    
    PRIMARY KEY(busId, mealType),
    FOREIGN KEY(busId) REFERENCES Business(busId)
);

CREATE TABLE BusAmbience(
    busId NVARCHAR(25) NOT NULL,
    ambienceType NVARCHAR(9) NOT NULL,
    ambienceVal BOOLEAN,

    PRIMARY KEY(busId, ambienceType),
    FOREIGN KEY(busId) REFERENCES Business(busId)
);

CREATE TABLE BusParking(
    busId NVARCHAR(25) NOT NULL,
    parkingType NVARCHAR(15) NOT NULL,
    parkVal BOOLEAN,
    
    PRIMARY KEY(busId, parkingType),
    FOREIGN KEY(busId) REFERENCES Business(busId)
);

CREATE TABLE BusHours(
    busId NVARCHAR(25) NOT NULL,
    dayOfWeek  NVARCHAR(9) NOT NULL,
    hrOpen NVARCHAR(5),
    hrClosed VARCHAR(5)
    
    
    PRIMARY KEY(busId, dayOfWeek),
    FOREIGN KEY(busId) REFERENCES Business(busId)
);

CREATE TABLE User(
    avgStars REAL,
    cool INT NOT NULL,
    funny INT NOT NULL,
    totalLikes INT,
    fans INT,
    userLat CHAR(13),
    userLong CHAR(13),
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
    PRIMARY KEY (busId, userId, tipDate),
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
    checkYear CHAR(4) NOT NULL,
    checkDate CHAR(10) NOT NULL,
    checkMonth CHAR(2) NOT NULL,
    checkTime CHAR(8) NOT NULL,
    PRIMARY KEY (busId, checkDate, checkTime),
    FOREIGN KEY busId REFERENCES Business(busId)
);