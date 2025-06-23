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
  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: 'password'
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});