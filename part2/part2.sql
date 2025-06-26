CREATE DATABASE FamilyDB;
GO

USE FamilyDB;
GO

CREATE TABLE Genders (
    Gender_Id TINYINT PRIMARY KEY,
    Gender_Name VARCHAR(10) UNIQUE
);

INSERT INTO Genders VALUES 
(1, 'male'), 
(2, 'female');

CREATE TABLE Persons (
    Person_Id INT PRIMARY KEY,
    Personal_Name VARCHAR(50) NOT NULL,
    Family_Name VARCHAR(50) NOT NULL,
    Gender_Id TINYINT NOT NULL REFERENCES Genders(Gender_Id),
    Father_Id INT NULL REFERENCES Persons(Person_Id),
    Mother_Id INT NULL REFERENCES Persons(Person_Id),
    Spouse_Id INT NULL REFERENCES Persons(Person_Id)
);

CREATE TABLE Connection_Types (
    Connection_Type_Id INT PRIMARY KEY,
    Connection_Name VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO Connection_Types VALUES 
(1, 'father'),
(2, 'mother'),
(3, 'brother'),
(4, 'sister'),
(5, 'son'),
(6, 'daughter'),
(7, 'spouse');

CREATE TABLE FamilyTree (
    Person_Id INT REFERENCES Persons(Person_Id),
    Relative_Id INT REFERENCES Persons(Person_Id),
    Connection_Type_Id INT REFERENCES Connection_Types(Connection_Type_Id),
    PRIMARY KEY (Person_Id, Relative_Id, Connection_Type_Id)
);

INSERT INTO Persons (Person_Id, Personal_Name, Family_Name, Gender_Id, Father_Id, Mother_Id, Spouse_Id)
VALUES
(1, 'Adam', 'First', 1, NULL, NULL, 2),
(2, 'Chava', 'First', 2, NULL, NULL, 1),
(3, 'Cain', 'First', 1, 1, 2, NULL),
(4, 'Evel', 'First', 1, 1, 2, NULL),
(5, 'Bat', 'First', 2, 1, 2, NULL);


-- Father
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type_Id)
SELECT Person_Id, Father_Id, 1 FROM Persons WHERE Father_Id IS NOT NULL;

-- Mother
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type_Id)
SELECT Person_Id, Mother_Id, 2 FROM Persons WHERE Mother_Id IS NOT NULL;


-- Father -> child-son (5) or daughter(6)
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type_Id)
SELECT Father_Id, Person_Id,
    CASE Gender_Id WHEN 1 THEN 5 ELSE 6 END
FROM Persons
WHERE Father_Id IS NOT NULL;

-- Mother -> child-son (5) or daughter(6)
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type_Id)
SELECT Mother_Id, Person_Id,
    CASE Gender_Id WHEN 1 THEN 5 ELSE 6 END
FROM Persons
WHERE Mother_Id IS NOT NULL;


-- Person → Spouse
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type_Id)
SELECT Person_Id, Spouse_Id, 7 FROM Persons WHERE Spouse_Id IS NOT NULL;

-- Spouse → Person if not exist
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type_Id)
SELECT s.Person_Id, p.Person_Id, 7
FROM Persons p
JOIN Persons s ON p.Spouse_Id = s.Person_Id
WHERE NOT EXISTS (
    SELECT 1 FROM FamilyTree
    WHERE Person_Id = s.Person_Id AND Relative_Id = p.Person_Id AND Connection_Type_Id = 7
);

--Brothers and sisters- with the same parents
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type_Id)
SELECT p1.Person_Id, p2.Person_Id,
    CASE p2.Gender_Id WHEN 1 THEN 3 ELSE 4 END
FROM Persons p1
JOIN Persons p2 ON p1.Person_Id <> p2.Person_Id
    AND p1.Father_Id = p2.Father_Id
    AND p1.Mother_Id = p2.Mother_Id
WHERE p1.Father_Id IS NOT NULL AND p1.Mother_Id IS NOT NULL;


SELECT 
    FT.Person_Id,
    P1.Personal_Name AS Person_Name,
    FT.Relative_Id,
    P2.Personal_Name AS Relative_Name,
    CT.Connection_Name
FROM FamilyTree FT
JOIN Persons P1 ON FT.Person_Id = P1.Person_Id
JOIN Persons P2 ON FT.Relative_Id = P2.Person_Id
JOIN Connection_Types CT ON FT.Connection_Type_Id = CT.Connection_Type_Id
ORDER BY FT.Person_Id, FT.Connection_Type_Id;
