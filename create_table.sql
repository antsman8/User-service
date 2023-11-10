CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,       
    email VARCHAR(255) UNIQUE,   
    password VARCHAR(255)        
);