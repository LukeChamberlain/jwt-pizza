# Partner Names

Partner 1: Luke Chamberlain

Partner 2: Joel Demars

## Self Attacks - Luke Chamberlain

#### Self Attack 1

| Item           | Result                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------ |
| Date           | April 11, 2026                                                                                                     |
| Target         | pizza.lukewilliamchamberlain.com                                                                                   |
| Classification | Injection                                                                                                          |
| Severity       | 3                                                                                                                  |
| Description    | I put an SQL injection into the name on the profile edit page and was able to clear everything out of the database |
| Images         | ![injection](./injection.png)                                                                                      |
| Corrections    | The vulnerability has been mitigated by refactoring the query to use parameterized statements                      |

#### Self Attack 2

| Item           | Result                                                    |
| -------------- | --------------------------------------------------------- |
| Date           | April 11, 2026                                            |
| Target         | pizza.lukewilliamchamberlain.com                          |
| Classification | Broken Access Control                                     |
| Severity       | 0                                                         |
| Description    | failed to gain access to restricted pages                 |
| Images         | ![Broken Access Control](./broken%20access%20control.png) |
| Corrections    | No changes needed the attack was unsuccessful             |

#### Self Attack 3

| Item           | Result                                                        |
| -------------- | ------------------------------------------------------------- |
| Date           | April 11, 2026                                                |
| Target         | pizza.lukewilliamchamberlain.com                              |
| Classification | Cryptographic Failures                                        |
| Severity       | 3                                                             |
| Description    | After logging in the password is unhased and token is exposed |
| Images         | ![Cryptographic Failures](./cryptographic%20failure.png)      |
| Corrections    | I hased the password and hid the token                        |

#### Self Attack 4

| Item           | Result                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Date           | April 11, 2026                                                                                                           |
| Target         | pizza.lukewilliamchamberlain.com                                                                                         |
| Classification | Security Misconfiguration                                                                                                |
| Severity       | 0                                                                                                                        |
| Description    | The server intentionally returns index.html for unknown routes that way unauthorized users cannot access the stack trace |
| Images         | ![Security Misconfiguration](./Security%20Misconfiguration.png)                                                          |
| Corrections    | none needed no security vulnerablities were found                                                                        |

#### Self Attack 5

| Item           | Result                                                              |
| -------------- | ------------------------------------------------------------------- |
| Date           | April 11, 2026                                                      |
| Target         | pizza.lukewilliamchamberlain.com                                    |
| Classification | Authentication Failures                                             |
| Severity       | 5                                                                   |
| Description    | passwords are easy they are just the users name put into a password |
| Images         | ![Authentication](./Authentication%20Failures.png)                  |
| Corrections    | changed passwords                                                   |

### Self Attacks - Joel Demars

### Peer Attacks - Luke Chamberlain on Joel Demars

#### Peer Attack 1

| Item           | Result                                      |
| -------------- | ------------------------------------------- |
| Date           | April 14, 2026                              |
| Target         | pizza.joeldemars.com                        |
| Classification | Security Misconfiguration                   |
| Severity       | 3                                           |
| Description    | Logged in as admin with default credentials |
| Images         |  ![login](login.png)             |
| Corrections    |  change default password and user           |

#### Peer Attack 2

| Item           | Result                                      |
| -------------- | ------------------------------------------- |
| Date           | April 14, 2026                              |
| Target         | pizza.joeldemars.com                        |
| Classification | Security Misconfiguration                   |
| Severity       |  4                                          |
| Description    |  was able to get database configuration     |
| Images         |  ![database](databaseexposed.png) |
| Corrections    |  Delete database hostname from /docs endpoint. |

#### Peer Attack 3

| Item           | Result                                      |
| -------------- | ------------------------------------------- |
| Date           | April 14, 2026                              |
| Target         | pizza.joeldemars.com                        |
| Classification |  Insecure Design            |
| Severity       |  3             |
| Description    |  made an order for negative -1000 bitcoin per pizza|
| Images         |  ![invalid order](invalidorder.png)             |
| Corrections    | verify order validity |

#### Peer Attack 4

| Item           | Result                                      |
| -------------- | ------------------------------------------- |
| Date           | April 14, 2026                              |
| Target         | pizza.joeldemars.com                        |
| Classification |  security misconfiguration             |
| Severity       |  0            |
| Description    |   tried to get the stack error trace from an unauthorized request.             |
| Images         |  ![failed stacktrace](failedstacktrace.png) |
| Corrections    |   already corrected            |

#### Peer Attack 5

| Item           | Result                                      |
| -------------- | ------------------------------------------- |
| Date           | April 14, 2026                              |
| Target         | pizza.joeldemars.com                        |
| Classification | Injection |
| Severity       | 0 |
| Description    |  failed injection |
| Images         |  ![failed injection](failedinjection.png)             |
| Corrections    |  need to secure database because it is still vulnearable             |

### Peer Attacks - Joel Demars on Luke Chamberlain

| Item           | Result                                      |
| -------------- | ------------------------------------------- |
| Date           | April 14, 2026                              |
| Target         | pizza.lukewilliamchamberlain.com            |
| Classification | Security Misconfiguration                   |
| Severity       | 3                                           |
| Description    | Logged in as admin with default credentials |
| Images         | ![Admin access](admin.jpg)                  |
| Corrections    | Change password from default                |

| Item           | Result                                                   |
| -------------- | -------------------------------------------------------- |
| Date           | April 14, 2026                                           |
| Target         | pizza.lukewilliamchamberlain.com                         |
| Classification | Insecure Design                                          |
| Severity       | 3                                                        |
| Description    | Placed an invalid order (ordered pizza for -100 bitcoin) |
| Images         | ![Invalid order](invalidOrder.jpg)                       |
| Corrections    | Verify data sent to `/api/order` endpoint is valid       |

| Item           | Result                                             |
| -------------- | -------------------------------------------------- |
| Date           | April 14, 2026                                     |
| Target         | pizza.lukewilliamchamberlain.com                   |
| Classification | Broken Access Control                              |
| Severity       | 3                                                  |
| Description    | Deleted franchise without authenticating           |
| Images         | ![Deleted franchise](deletedFranchise.jpg)         |
| Corrections    | Authenticate user on `/api/franchise/:id` endpoint |

| Item           | Result                                                                                         |
| -------------- | ---------------------------------------------------------------------------------------------- |
| Date           | April 14, 2026                                                                                 |
| Target         | pizza.lukewilliamchamberlain.com                                                               |
| Classification | Mishandled Exception                                                                           |
| Severity       | 1                                                                                              |
| Description    | Internal server error caused by unsanitized input reveals information about database structure |
| Images         | ![Mishandled exception](mishandledException.jpg)                                               |
| Corrections    | Sanitize input, return generic error message                                                   |

| Item           | Result                                                           |
| -------------- | ---------------------------------------------------------------- |
| Date           | April 14, 2026                                                   |
| Target         | pizza.lukewilliamchamberlain.com                                 |
| Classification | Injection                                                        |
| Severity       | 4                                                                |
| Description    | Used a SQL injection to delete all users                         |
| Images         | ![SQL injection](sqlInjection1.jpg) ![Result](sqlInjection2.jpg) |
| Corrections    | Sanitize input                                                   |

### Summary

I learned a lot during this deliverable, I learned that AI will not help you with identifying vulnerables it definilty won't help you with sql injection. I really liked learning to use burp suite. There is a lot of fun things that I can do with burp suite and then I also learned you could probably use that for testing and making sure certain parts are getting sent at the right time.
