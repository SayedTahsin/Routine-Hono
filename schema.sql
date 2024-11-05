-- Create 'Notes' table
CREATE TABLE IF NOT EXISTS Notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    mail TEXT NOT NULL,
    color TEXT DEFAULT 'White'
);

-- Create 'Tasks' table
CREATE TABLE IF NOT EXISTS Tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    status BOOLEAN NOT NULL DEFAULT 0,
    mail TEXT NOT NULL,
    category TEXT NOT NULL
);

-- Create 'Users' table
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mail TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    completedTasks INTEGER DEFAULT 0,
    totalTasks INTEGER DEFAULT 0
);
