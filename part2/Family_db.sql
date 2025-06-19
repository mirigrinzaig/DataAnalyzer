CREATE DATABASE FamilyDB;
GO

USE FamilyDB;
GO

CREATE TABLE Persons (
    Person_Id INT PRIMARY KEY,
    Personal_Name VARCHAR(255),
    Family_Name VARCHAR(255),
    Gender VARCHAR(10),
    Father_Id INT FOREIGN KEY REFERENCES Persons(Person_Id),
    Mother_Id INT FOREIGN KEY REFERENCES Persons(Person_Id),
    Spouse_Id INT FOREIGN KEY REFERENCES Persons(Person_Id)
);
GO

CREATE TABLE FamilyTree (
    Person_Id INT REFERENCES Persons(Person_Id),
    Relative_Id INT REFERENCES Persons(Person_Id),
    Connection_Type VARCHAR(20) CHECK (Connection_Type IN (
        'father', 'mother', 'brother', 'sister',
        'son', 'daughter', 'spouse'
    )),
    PRIMARY KEY (Person_Id, Relative_Id, Connection_Type)
);
GO

--insert data
INSERT INTO Persons (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
VALUES
  (1, 'Adam', 'first', 'male', NULL, NULL, 2),
  (2, 'Hava', 'first', 'female', NULL, NULL, 1),
  (3, 'Kayin', 'first', 'male', 1, 2, NULL),
  (4, 'Hevel', 'first', 'male', 1, 2, NULL);

select * from Persons

-- אבא
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT p.Person_Id, p.Father_Id, 'father'
FROM Persons p
WHERE p.Father_Id IS NOT NULL;

-- אמא
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT p.Person_Id, p.Mother_Id, 'mother'
FROM Persons p
WHERE p.Mother_Id IS NOT NULL;

-- בן/בת (מהורה לילד)
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT p.Father_Id, p.Person_Id,
    CASE p.Gender WHEN 'male' THEN 'son' ELSE 'daughter' END
FROM Persons p
WHERE p.Father_Id IS NOT NULL

UNION ALL

SELECT p.Mother_Id, p.Person_Id,
    CASE p.Gender WHEN 'male' THEN 'son' ELSE 'daughter' END
FROM Persons p
WHERE p.Mother_Id IS NOT NULL;

-- בן/בת זוג
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT p.Person_Id, p.Spouse_Id, 'spouse'
FROM Persons p
WHERE p.Spouse_Id IS NOT NULL;


-- אחים ואחיות
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT
    p1.Person_Id,
    p2.Person_Id,
    CASE p2.Gender
        WHEN 'male' THEN 'brother'
        WHEN 'female' THEN 'sister'
    END AS Connection_Type
FROM Persons p1
JOIN Persons p2
    ON p1.Person_Id <> p2.Person_Id
   AND p1.Father_Id = p2.Father_Id
   AND p1.Mother_Id = p2.Mother_Id
WHERE p2.Gender IN ('male', 'female');

-- השלמה דו־כיוונית של spouse ב־FamilyTree
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT s.Person_Id, p.Person_Id, 'spouse'
FROM Persons p
JOIN Persons s ON p.Spouse_Id = s.Person_Id
WHERE NOT EXISTS (
    SELECT 1 FROM FamilyTree f
    WHERE f.Person_Id = s.Person_Id
      AND f.Relative_Id = p.Person_Id
      AND f.Connection_Type = 'spouse'
);

-- הצגת קשרים לכל אדם
SELECT * FROM FamilyTree ORDER BY Person_Id, Connection_Type;

-- בדיקה סופית של טבלת Persons (כולל השלמת בני זוג)
SELECT * FROM Persons ORDER BY Person_Id;

ALTER TABLE Persons
ADD CONSTRAINT CHK_Gender_Values
CHECK (Gender IN ('male', 'female'));
