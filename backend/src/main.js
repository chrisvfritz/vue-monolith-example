const path = require('path')
const Hapi = require('hapi')
const fs = require('fs')

// ---
// Config
// ---

// Define the directory that the frontend builds to. Note that this is
// only used when starting the backend server on its own. When accessed
// from the dev server, the backend only ever receives routes that
// begin with `/api/`.
const frontendFolder = path.resolve(__dirname, '../../frontend/dist')

// Check if the `frontendFolder` is missing
const frontendFolderIsMissing = !fs.existsSync(frontendFolder)

// If the `frontendFolder` is missing...
if (frontendFolderIsMissing) {
  // If the `frontendFolder` is missing in production...
  if (process.env.NODE_ENV === 'production') {
    // Display an error letting the user know what they should do.
    console.error(
      'Directory `frontend/dist` does not exist. You must run `yarn build` before starting the app in production.'
    )
    // Abort starting up the app.
    process.exit(1)
  }
  // Or, if the `frontendFolder` is missing another environment...
  else {
    // Create the `frontendFolder` to avoid errors in development.
    fs.mkdirSync(frontendFolder)
  }
}

// Create the server with Hapi: https://hapijs.com/
const server = new Hapi.Server({
  // This is needed by some hosts, like Heroku.
  host: '0.0.0.0',
  // Set to port to the `PORT` environment variable, or to `9090`.
  port: process.env.PORT || 9090,
  routes: {
    // Allow cross-origin requests.
    cors: true,
    files: {
      // Treat `frontendFolder` as the public folder.
      relativeTo: frontendFolder,
    },
  },
})

// ---
// Plugin registration
// ---

// Allow serving files.
const plugins = [require('inert')]

// Ensure SSL in production.
if (process.env.NODE_ENV === 'production') {
  plugins.push(require('hapi-require-https'))
}

// ---
// Error Handling
// ---

// Allow errors from unhandled promise rejections to be logged
// and make sure they crash the server to avoid going unnoticed.
process.on('unhandledRejection', error => {
  console.error(error)
  process.exit(1)
})

server.register(plugins).then(() => {
  // --------------
  // Authentication
  // --------------

  // This is where you can set up authentication for your app,
  // for example using: https://github.com/dwyl/hapi-auth-jwt2

  // ----------
  // API routes
  // ----------

  // Helper to create API routes. All routes handled by the
  // backend should use this helper.
  function createApiRoute(path, options) {
    server.route({
      path: `/api/${path}`,
      method: 'GET',
      handler: () => 'NOT YET IMPLEMENTED',
      ...options,
    })
  }

  // Create an example route for `/api/todos`.
  createApiRoute('todos', {
    handler(request, h) {
      return [
        {
          id: 1,
          text: 'Do the dishes',
        },
        {
          id: 2,
          text: 'Clean the bathroom',
        },
        {
          id: 3,
          text: 'Rake the leaves',
        },
      ]
    },
  })

  // ----------
  // SPA routes
  // ----------
  // Redirect all unmatched routes to the frontend

  // For each file or folder in `frontendFolder`...
  fs.readdirSync(frontendFolder).forEach(fileOrFolder => {
    // Check if it's a folder
    const isFolder = fs.statSync(frontendFolder, fileOrFolder).isDirectory()

    // If a folder...
    if (isFolder) {
      // Forward routes to assets folders.
      server.route({
        method: 'GET',
        path: `/${fileOrFolder}/{file*}`,
        config: {
          auth: false,
          handler: {
            directory: {
              path: `./${fileOrFolder}`,
            },
          },
        },
      })
    }
    // Or, if a file not named `index.html`...
    else if (fileOrFolder !== 'index.html') {
      // Forward routes to top-level files.
      server.route({
        method: 'GET',
        path: `/${fileOrFolder}`,
        config: {
          auth: false,
          handler: {
            file: fileOrFolder,
          },
        },
      })
    }
  })

  // Forward all unregistered routes to `index.html`, so that
  // the frontend handles everything not defined by the backend,
  // including 404s.
  server.route({
    method: '*',
    path: '/{route*}',
    config: {
      auth: false,
      handler: {
        file: 'index.html',
      },
    },
  })

  // -----
  // Start the server
  // -----

  return server.start().then(() => {
    console.info(`Started backend at ${server.info.uri}`)
  })
})
