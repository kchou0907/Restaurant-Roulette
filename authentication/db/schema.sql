
/* keeps track of our users */
CREATE TABLE IF NOT EXISTS tblUsers (
    UserID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PassHash BINARY(60) NOT NULL,
    UserName VARCHAR(255) NOT NULL UNIQUE,
    FirstName VARCHAR(60) NOT NULL,
    LastName VARCHAR(60) NOT NULL
);

/* logs logins */
CREATE TABLE IF NOT EXISTS tblLogs (
    LogID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    UserID INT FOREIGN KEY REFERENCES tblUsers(UserID) NOT NULL,
    signDateTime DATETIME NOT NULL,
    ipAddr VARCHAR(20) NOT NULL
);

/* user restaurant history */
CREATE TABLE IF NOT EXISTS tblUserRestaurantHistory (
    HistoryID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    UserID INT FOREIGN KEY REFERENCES tblUsers(UserID) NOT NULL,
    RestaurantID INT FOREIGN KEY REFERENCES tblRestaurants(RestaurantID) NOT NULL,
);
/*
TODO: Ranking System? Do I use Favoriting or 1-5?
*/
/* restaurant data (caching from yelp) */
CREATE TABLE IF NOT EXISTS tblRestaurants {
    RestaurantID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address1 VARCHAR(255) NOT NULL,
    Address2 VARCHAR(255),
    City VARCHAR(255) NOT NULL,
    ZipCode VARCHAR(255) NOT NULL,
    Country VARCHAR(255) NOT NULL,
    State VARCHAR(255) NOT NULL,
    Display_Address VARCHAR(255) NOT NULL,
}

/* restaurant tags lookup table */
CREATE TABLE IF NOT EXISTS tblRestaurantTags{
    RestaurantTagsID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    RestaurantID INT FOREIGN KEY REFERENCES tblRestaurants(UserID) NOT NULL,
    TagID INT FOREIGN KEY REFERENCES tblTags(TagID) NOT NULL,
}

/* restaurant tags (cuisine, what they serve, etc) */
CREATE TABLE IF NOT EXISTS tblTags {
    TagID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    TagName VARCHAR(255) NOT NULL
}