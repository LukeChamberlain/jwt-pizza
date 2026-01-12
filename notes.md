# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL|
| --------------------------------------------------- | ------------------ | ----------------- |------------ |
| View home page                                      |  home.jsx          | none              | none        |
| Register new user<br/>(t@jwt.com, pw: test)         |  register.jsx      | [POST] /api/auth  | `INSERT INTO user (name, email, password) VALUES (?, ?, ?)` <br/>`INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)` |
| Login new user<br/>(t@jwt.com, pw: test)            |  login.tsx         | [PUT] /api/auth   | `SELECT id, name, email, password FROM user WHERE email = ?` <br/> `SELECT role, objectId FROM userRole WHERE userId = ?`            |
| Order pizza                                         |  menu.tsx, payment.tsx, delivery.tsx|  GET /api/order/menu, GET /api/franchise, POST /api/order|`SELECT id, title, description, price, image FROM menu `<br/>` SELECT * FROM franchise<br/>SELECT * FROM store WHERE franchiseId = ?` <br/> `INSERT INTO orders (userId, storeId, franchiseId, createdAt)` <br/>`INSERT INTO orderItem (orderId, menuId, description, price)`             |
| Verify pizza                                        |  delivery.tsx | [POST] /api/order/verify | none |
| View profile page                                   |                    |                   |              |
| View franchise<br/>(as diner)                       |                    |                   |              |
| Logout                                              |                    |                   |              |
| View About page                                     |                    |                   |              |
| View History page                                   |                    |                   |              |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) |                    |                   |              |
| View franchise<br/>(as franchisee)                  |                    |                   |              |
| Create a store                                      |                    |                   |              |
| Close a store                                       |                    |                   |              |
| Login as admin<br/>(a@jwt.com, pw: admin)           |                    |                   |              |
| View Admin page                                     |                    |                   |              |
| Create a franchise for t@jwt.com                    |                    |                   |              |
| Close the franchise for t@jwt.com                   |                    |                   |              |
