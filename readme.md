# GSG-APP

simple CRUD app

## Setup

Use [npm](https://www.npmjs.com/) and [docker-compose](https://docs.docker.com/compose/) to start server:

```bash
cd ./server
npm install
cd ..
docker-compose up -d --build
```

Navigate to `client` directory and use [npm](https://www.npmjs.com/) to start front-end:

```bash
cd ./client
npm install
npm start
```

## Testing Frontend

use [npm](https://www.npmjs.com/) to test front-end:

```bash
npm test
```

## Shutting Down

Use [docker-compose](https://docs.docker.com/compose/) to shut the server down:

```bash
docker-compose down
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
