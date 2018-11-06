const path = require('path')
const Hapi = require('hapi')
const fs = require('fs')

// ---
// Config
// ---

const frontendDir = path.resolve(__dirname, '../../frontend/dist')
if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir)

const server = new Hapi.Server({
  host: '0.0.0.0',
  port: process.env.PORT || 9090,
  routes: {
    // Allow cross-origin requests
    cors: true,
    files: {
      // Treat frontend-dist as the public folder
      relativeTo: frontendDir,
    },
  },
})

// ---
// Plugin registration
// ---

const plugins = [require('inert')]

if (process.env.NODE_ENV === 'production') {
  plugins.push(require('hapi-require-https'))
}

// ---
// Error Handling
// ---

process.on('unhandledRejection', error => {
  console.error(error)
  process.exit(1)
})

server.register(plugins).then(() => {
  // --------------
  // Authentication
  // --------------

  // TODO: Set up authentication for API routes here

  // ----------
  // API routes
  // ----------

  function createApiRoute(path, options) {
    server.route({
      path: `/api/${path}`,
      method: 'GET',
      handler: () => 'NOT YET IMPLEMENTED',
      ...options,
    })
  }

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

  fs.readdirSync(frontendDir).forEach(fileOrFolder => {
    const isFolder = fs.statSync(frontendDir, fileOrFolder).isDirectory()

    if (isFolder) {
      // Forward routes to assets folders
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
    } else if (fileOrFolder !== 'index.html') {
      // Forward routes to non-HTML, top-level resources
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

  // Forward unregistered routes to index.html
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
    console.log(`Started backend at ${server.info.uri}`)
  })
})
