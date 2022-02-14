Api : api/logs-in-time-range/:startTime/:endTime
Method : get
Example api : http://localhost:3000/api/logs-in-time-range/2020-01-01T00:00:11.172Z/2020-01-01T00:03:02.588Z

To keep things simple didn't handle all cornercases in the routing, error cases
assuming the user will use GET with the api /logs-in-time-range/:startTime/:endTime

To keep things simple as it's just a assignment, I didn't use routes, controller folders
