CREATE TABLE IF NOT EXISTS jobs (
 id TEXT PRIMARY KEY, access_token_hash TEXT NOT NULL,
 source_url TEXT NOT NULL, filename TEXT NOT NULL,
 status TEXT NOT NULL, content_type TEXT, size_bytes INTEGER, object_key TEXT,
 error TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS jobs_created_idx ON jobs(created_at DESC);
CREATE TABLE IF NOT EXISTS audit_log (
 id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT NOT NULL, detail TEXT,
 created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS rate_limits (
 ip TEXT PRIMARY KEY, window_start INTEGER NOT NULL, requests INTEGER NOT NULL
);
