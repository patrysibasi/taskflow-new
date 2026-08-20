CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'employee'
        CHECK (role IN ('admin', 'employee')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'in_progress', 'completed')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    due_date TIMESTAMP
);

INSERT INTO users (
    name,
    email,
    password_hash,
    role
)
VALUES
    (
        'Patryk',
        'patryk@example.com',
        '$2b$12$sxDReK.DmJhTwLEg2JfCF.Px8Tc3q92u5HB3GLxmN3GCidT.InR4i',
        'admin'
    ),
    (
        'Demo',
        'demo@taskflow.pl',
        '$2b$12$J7gAX19CoF0Oq4Mo8Fmug.LFO5cEMg2TR.UAIr/39E/zMmu9ZiYMu',
        'admin'
    ),
    (
        'Employee Demo',
        'employee@taskflow.pl',
        '$2b$12$9YAdqGfr5G9JHrXwhLkweuNcY7RqVb2eCBverwkW5vPur/fRJUswO',
        'employee'
    );

INSERT INTO tasks (
    user_id,
    title,
    status,
    due_date
)
VALUES
    (1, 'Zadanie1', 'completed', NULL),
    (2, 'Zadanie2', 'in_progress', NULL),
    (3, 'Zadanie3', 'pending', NULL),
    (3, 'Zadanie4', 'in_progress', NULL);