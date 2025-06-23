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