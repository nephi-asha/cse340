INSERT INTO account (account_firstname,	account_lastname, account_email,	account_password) 
VALUES ('Tony', 'Stark', 'tony@starkent.com','Iam1ronM@n');

UPDATE account SET account_type='Admin' WHERE account_email='tony@starkent.com';

DELETE FROM account WHERE account_email='tony@starkent.com';

UPDATE inventory
SET inv_description=REPLACE(inv_description, 'small interiors', 'huge interior') 
WHERE inv_description LIKE '%small interiors%';

SELECT inv_make, inv_model FROM inventory
INNER JOIN classification
ON inventory.inv_model=classification.classification_name;

UPDATE inventory
SET inv_image=REPLACE(inv_image, 'images', 'images/vehicles'),
	inv_thumbnail=REPLACE(inv_thumbnail, 'images', 'images/vehicles')
WHERE inv_image LIKE '%images%' OR
	  inv_thumbnail LIKE '%images%';