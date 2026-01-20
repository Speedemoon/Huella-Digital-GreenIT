CREATE TABLE IF NOT EXISTS calculations (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  inputs JSONB NOT NULL,
  results JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_calculations_created_at ON calculations (created_at DESC);
