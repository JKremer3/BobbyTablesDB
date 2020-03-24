CREATE TABLE Business(
    --Non-Composite Attributes
    busId VARCHAR(25) NOT NULL,
    busName VARCHAR(100) NOT NULL,
    city VARCHAR(30) NOT NULL,
    busState CHAR(2) NOT NULL,
    postalCode CHAR(5) NOT NULL,
    lat REAL NOT NULL,
    long REAL NOT NULL,
    stars REAL,
    revCount INT NOT NULL,
    isOpen INT NOT NULL,
    PRIMARY KEY (busId)
);

CREATE TABLE BusCategory(
    --This table holds all categories associated with busness
    busId VARCHAR(25) NOT NULL,
    category VARCHAR(25),
    PRIMARY KEY (busId,category),
    FOREIGN KEY(busId) REFERENCES Business(busId)
);

CREATE TABLE BusAttributes(
    busId VARCHAR(25) NOT NULL,
    attributeName VARCHAR(20) NOT NULL,
    attributeVal VARCHAR(30) NOT NULL,
    PRIMARY KEY (busId, attributeName),
    FOREIGN KEY (busId) REFERENCES Business(busId)
);

CREATE TABLE BusGoodForMeals(
    busId VARCHAR(25) NOT NULL,
    mealType VARCHAR(10) NOT NULL,
    mealVal BOOLEAN,
    
    PRIMARY KEY (busId, mealType),
    FOREIGN KEY (busId) REFERENCES Business(busId)
);

CREATE TABLE BusAmbience(
    busId VARCHAR(25) NOT NULL,
    ambienceType VARCHAR(9) NOT NULL,
    ambienceVal BOOLEAN,

    PRIMARY KEY (busId, ambienceType),
    FOREIGN KEY (busId) REFERENCES Business(busId)
);

CREATE TABLE BusParking(
    busId VARCHAR(25) NOT NULL,
    parkingType VARCHAR(15) NOT NULL,
    parkVal BOOLEAN,
    
    PRIMARY KEY (busId, parkingType),
    FOREIGN KEY (busId) REFERENCES Business(busId)
);

CREATE TABLE BusHours(
    busId VARCHAR(25) NOT NULL,
    dayOfWeek  VARCHAR(9) NOT NULL,
    hrsOpen VARCHAR(11),
    --Hours Composite
    
    PRIMARY KEY (busId, dayOfWeek),
    FOREIGN KEY (busId) REFERENCES Business(busId)
);

CREATE TABLE Users(
    avgStars REAL,
    cool INT NOT NULL,
    funny INT NOT NULL,
    numLikes INT,
    userName VARCHAR(20) NOT NULL,
    tipCount INT NOT NULL,
    useful INT NOT NULL,
    userId VARCHAR(25) NOT NULL,
    yelpStartDate CHAR(10) NOT NULL,
    yelpStartTime CHAR(8) NOT NULL,
    PRIMARY KEY (userId)
);

CREATE TABLE Tip(
    --table for the tip weak entity
    --tip requires both a valid user and busness ID
    busId VARCHAR(25) NOT NULL,
    userId VARCHAR(25) NOT NULL,
    likeCount INT,
    tipText VARCHAR(150) NOT NULL,
    tipDate CHAR(10) NOT NULL,
    tipTime CHAR(8) NOT NULL,
    
	PRIMARY KEY(busId, userId),
	
    FOREIGN KEY (busId) REFERENCES Business(busId),
    FOREIGN Key (userId) REFERENCES Users(userId)
);

CREATE TABLE Friends(
    --Table for the friends relation
    --userId and friendId must exist in User.userId
    userId VARCHAR(25) NOT NULL,
    friendId VARCHAR(25) NOT NULL,
    PRIMARY KEY (userId, friendId),
    FOREIGN KEY (userId) REFERENCES Users(userId),
    FOREIGN KEY (friendId) REFERENCES Users(userId)
);

CREATE TABLE checkin(
    --Table for the check-in weak entity
    --a checkin must be associated with a valid busness ID
    busId VARCHAR(25) NOT NULL,
    checkDate CHAR(10) NOT NULL,
    checkMonth CHAR(2) NOT NULL,
    checkTime CHAR(8) NOT NULL,
    PRIMARY KEY (busId, checkDate, checkTime),
    FOREIGN KEY (busId) REFERENCES Business(busId)
);