INSERT INTO users (username, password_hash, role, branch_id)
SELECT
  'admin',
  '$2b$12$8oKPzIRosPWDRmzfsJudBugLpsFWoSWjH4iHJCakQYk4rXl.nf13a',
  'superadmin',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM users);
