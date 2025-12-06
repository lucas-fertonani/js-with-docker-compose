CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone INTEGER NOT NULL,
    birthDate DATE NOT NULL,
    userId INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
-- Índice para melhorar performance nas consultas por userId
CREATE INDEX IF NOT EXISTS idx_clientes_userId ON clientes(userId);
ALTER TABLE clientes
ALTER COLUMN phone TYPE TEXT;