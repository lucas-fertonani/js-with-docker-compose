CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    valor DECIMAL(10, 2) NOT NULL,
    desconto DECIMAL(10, 2) DEFAULT 0,
    clienteid INTEGER NOT NULL,
    userid INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Relacionamentos
    CONSTRAINT fk_pedidos_clientes FOREIGN KEY (clienteid) REFERENCES clientes(id) ON DELETE CASCADE,
    CONSTRAINT fk_pedidos_users FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);
-- Índices para melhorar performance nas consultas
CREATE INDEX idx_pedidos_clienteid ON pedidos(clienteid);
CREATE INDEX idx_pedidos_userid ON pedidos(userid);
ALTER TABLE pedidos
ADD COLUMN deleted_at TIMESTAMP;