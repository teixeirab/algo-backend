module.exports = {
  apiPort: 3000,
  dbHost: '192.168.99.100',
  port: 3306,
  dialect: 'mysql',
  user:'root',
  password: 'test',
  db: 'flexfunds',
  dbLogging: false,
  frontUrl: 'http://localhost:8080/panel/client/',
  email: {
    host: 'smtp.mail.yahoo.com',
    port: 465,
    user: 'flextests@yahoo.com',
    pass: 'testflex123'
  }
};
