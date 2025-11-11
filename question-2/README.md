# Question 2

## TODOs Rest API

### Create TODO

```
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Watch Movies"}'
```

### Get TODO
```
curl http://localhost:3000/todos
```

### Update TODO
```
curl -X PATCH http://localhost:3000/todos/<todo-id> \
  -H "Content-Type: application/json" \
  -d '{"completed": true, "title": "Learning go please. not watching movies"}'
```

### Delete ID

```
curl -X DELETE http://localhost:3000/todos/<todo-id>
```