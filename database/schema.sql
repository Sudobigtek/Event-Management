-- Create your database schema here

-- Votes table
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id),
    contestant_id UUID REFERENCES contestants(id),
    user_id UUID REFERENCES users(id),
    vote_count INTEGER NOT NULL,
    payment_reference VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id),
    user_id UUID REFERENCES users(id),
    quantity INTEGER NOT NULL,
    payment_reference VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_votes_contestant ON votes(contestant_id);
CREATE INDEX idx_votes_event ON votes(event_id);
CREATE INDEX idx_tickets_event ON tickets(event_id);