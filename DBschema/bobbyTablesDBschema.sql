CREATE TABLE Buisness(
    buisId NVARCHAR(25),
    name NVARCHAR(100),
    city NVARCHAR(30),
    state CHAR(2),
    postalCode CHAR(5),
    lat REAL,
    long REAL,
    stars REAL,
    revCount INT,
    isOpen INT,
    
    goodForKids BIT(1),
    noiseLevel VARCHAR(10),
    restDelivery BIT(1),
    
    dessert BIT(1),
    lateNight BIT(1),
    lunch BIT(1),
    dinner BIT(1),
    brunch BIT(1),
    bfast BIT(1),
    
    alcohol VARCHAR(20),
    caters BIT(1),
    wifi BIT(1),
    takeOut BIT(1),
    accCreditCard BIT(1),
    
    romantic BIT(1),
    intimate BIT(1),
    touristy BIT(1),
    hipster BIT(1),
    divey BIT(1),
    classy BIT(1),
    trendy BIT(1),
    upscale BIT(1),
    casual BIT(1),
    
    garagePark BIT(1),
    streetPark BIT(1),
    lotParl BIT(1),
    valetPark BIT(1),

    tableService BIT(1),
    good4Groups BIT(1),
    outdoorSeat BIT(1),
    reservation BIT(1),
    priceRange INT,
    attire VARCHAR(10),

    monHrs VARCHAR(11),
    tueHrs VARCHAR(11),
    wedHrs VARCHAR(11),
    thuHrs VARCHAR(11),
    friHrs VARCHAR(11),
    satHrs VARCHAR(11),
    sunHrs VARCHAR(11),
    PRIMARY KEY(buisId)
);

CREATE TABLE BuisCategory(
    buisId NVARCHAR(25),
    category NVARCHAR(25),
    PRIMARY KEY(buisId,category),
    FOREIGN KEY(buisId) REFERENCES Buisness(buisId)
);

CREATE TABLE User(
    avgStars REAL,
    cool INT,
    funny INT,
    userName NVARCHAR(20),
    tipCount INT,
    useful INT,
    userId NVARCHAR(25),
    yelpStartDate CHAR(10),
    yelpStartTime CHAR(8),
    PRIMARY KEY (userId)
);

CREATE TABLE Tip(
    buisId NVARCHAR(25),
    userId NVARCHAR(25),
    likeCount INT,
    tipText NVARCHAR(150),
    tipDate CHAR(10),
    tipTime CHAR(8),
    PRIMARY KEY(buisId, userId),
    FOREIGN KEY buisId REFERENCES Buisness(buisId),
    FOREIGN Key userId REFERENCES User(userId)
);

CREATE TABLE Friends(
    userId NVARCHAR(25),
    friendId NVARCHAR(25),
    PRIMARY KEY (userId, friendId),
    FOREIGN KEY userId REFERENCES User(userId),
    FOREIGN KEY friendId REFERENCES User(userId)
);

CREATE TABLE checkin(
    buisId NVARCHAR(25),
    checkDate CHAR(10),
    checkTime CHAR(8),
    PRIMARY KEY (buisId, checkDate, checkTime),
    FOREIGN KEY buisId REFERENCES Buisness(buisId)
);