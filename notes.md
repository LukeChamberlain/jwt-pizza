# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL|
| --------------------------------------------------- | ------------------ | ----------------- |------------ |
| View home page                                      |  home.jsx          | none              | none        |
| Register new user<br/>(t@jwt.com, pw: test)         |  register.jsx      | [POST] /api/auth  | `INSERT INTO user (name, email, password) VALUES (?, ?, ?)` <br/>`INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)` |
| Login new user<br/>(t@jwt.com, pw: test)`           |  login.tsx         | [PUT] /api/auth   | `SELECT id, name, email, password ` <br/> `FROM user ` <br/> `WHERE email = ?` <br/> `SELECT role, objectId ` <br/> `FROM userRole` <br/> ` WHERE userId = ?`            |
| Order pizza                                         |  menu.tsx, payment.tsx, delivery.tsx|  GET /api/order/menu, GET /api/franchise, POST /api/order|`SELECT id, title, description, price, image ` <br/> `FROM menu `<br/>` SELECT * ` <br/> `FROM franchise`<br/>`SELECT * ` <br/> `FROM store` <br/> `WHERE franchiseId = ?` <br/> `INSERT INTO orders (userId, storeId, franchiseId, createdAt)` <br/>`INSERT INTO orderItem (orderId, menuId, description, price)`             |
| Verify pizza                                        |  delivery.tsx | [POST] /api/order/verify | none |
| View profile page                                   |  dinerDashboard.tsx  | [GET] /api/order| `SELECT id, createdAt`<br/> `FROM orders`<br/> `WHERE userId = ?`<br/> `ORDER BY createdAt DESC;`<br/> `SELECT menuId, description, price`<br/> `FROM orderItem`<br/> `WHERE orderId = ?;`      |
| View franchise<br/>(as diner)                       |  franchiseDashboard.tsx | GET /api/franchise/{userId} | `SELECT role objectId`<br/>`FROM userRole`<br/>`WHERE userId = ?`|
| Logout                                              | logout.tsx | [DELETE] /api/auth | none |
| View About page                                     | about.tsx| none  | none |
| View History page                                   | login.tsx| none | none |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) |   login.tsx  | [PUT] /api/auth   | `SELECT id, name, email, password FROM user WHERE email = ?` <br/> `SELECT role, objectId FROM userRole WHERE userId = ?` |
| View franchise<br/>(as franchisee)                  | franchiseDashboard.tsx | GET /api/franchise/{userId}|`SELECT objectId` <br/> `FROM userRole`<br/> `WHERE userId = ? AND role = 'Franchisee'`<br/>`SELECT *` <br/> `FROM franchise` <br/> `WHERE id = ?`<br/> `SELECT *` <br/> `FROM store` <br/> `WHERE franchiseId = ?` <br/>` SELECT SUM(price)` <br/> `FROM orders o JOIN orderItem oi ON oi.orderId = o.id WHERE o.storeId = ?`|
| Create a store                                      | createStore.tsx | [POST] /api/franchise/{franchiseId}/store |`SELECT 1` <br/> ` FROM userRole ` <br/> `WHERE userId = ? AND role = 'Franchisee' AND objectId = ?`<br/>`INSERT INTO store (name, franchiseId) ` <br/> `VALUES (?, ?)`|
| Close a store                                       | closeStore.jsx | [DELETE] /api/franchise/{franchiseId}/store/{storeId} | `SELECT 1 ` <br/> `FROM userRole ` <br/> `WHERE userId = ? AND role = 'Franchisee' AND objectId = ?`<br/>`DELETE FROM store ` <br/> `WHERE id = ? AND franchiseId = ?`|
| Login as admin<br/>(a@jwt.com, pw: admin)           |   login.tsx  | [PUT] /api/auth   | `SELECT id, name, email, password FROM user WHERE email = ?` <br/> `SELECT role, objectId ` <br/> `FROM userRole ` <br/> `WHERE userId = ?` |
| View Admin page                                     | AdminDashboard.jsx | [GET] /api/franchise?page=&limit=&name=* | `SELECT *` <br/> `FROM franchise ` <br/> `WHERE name LIKE ? LIMIT ? OFFSET ?;` <br/> `SELECT * ` <br/> `FROM store ` <br/> `WHERE franchiseId IN (...);` <br/> `SELECT u.id, u.name ` <br/> `FROM user u ` <br/> `JOIN userRole ur ON u.id = ur.userId ` <br/> `WHERE ur.role='Franchisee' AND ur.objectId IN (...);`|
| Create a franchise for t@jwt.com                    | createFranchise.txt | [POST] /api/franchise | `INSERT INTO franchise (name) ` <br/> `VALUES (?); ` <br/> `INSERT INTO userRole (userId, role, objectId) ` <br/> `VALUES (?, 'Franchisee', ?);`|
| Close the franchise for t@jwt.com             | closeFranchise.txt       |[DELETE] /api/franchise/{franchiseId} |`DELETE FROM franchise ` <br/> `WHERE id = ?;` <br/> `DELETE FROM store ` <br/> `WHERE franchiseId = ?;` <br/> `DELETE FROM userRole ` <br/> `WHERE objectId = ? AND role='Franchisee';`|
