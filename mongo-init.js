db = db.getSiblingDB('agile_accounting');

db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'agile_accounting'
    }
  ]
});

db.createCollection('accounts');
db.createCollection('transactions');
db.createCollection('users');

// Create default admin user
db.users.insertOne({
  username: 'admin',
  email: 'admin@example.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.ckstG.', // password: 'password'
  role: 'admin',
  isActive: true,
  createdAt: new Date()
});