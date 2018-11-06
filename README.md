# Vue Monolith Example

This is a simple example of how to structure a monolithic Vue application, with the frontend and backend both living within the same codebase.

## Development

> NOTE: This project relies on Yarn as an alternative to NPM. To install Yarn, follow [these instructions](https://yarnpkg.com/lang/en/docs/install).

To start your development server:

```bash
yarn dev
```

Once it's started, you'll see a local URL you can use to access it (by default, `http://localhost:8080` if it's available). Note that all routes starting with `/api/` are automatically proxied to your backend server.

## Deployment

### Using [Now](https://zeit.co/now)

```bash
now
```

### Using [Heroku](https://www.heroku.com/)

1.  Only the first time, to create your app:

    ```bash
    heroku create
    ```

1.  Push the Git branch you want to deploy to Heroku:

    ```bash
    git push heroku branch-to-deploy:master
    ```

### Manual deployment

During your build process, make sure to:

1.  Install dependencies, using the exact versions in your lockfile

    ```bash
    yarn install --frozen-lockfile
    ```

2.  Build the frontend

    ```bash
    yarn build
    ```

Then start your application with:

```bash
# Start the backend server
yarn start
```

By default, it will be available at `http://localhost:9090`, but the port can be configured with a `PORT` environment variable.
