const path = require('path');
const fs = require('fs');

module.exports = {
  build: {
    // Template configuration
    templateDir: 'templates/default',
    partials: [
      'partials/header.ejs',
      'partials/footer.ejs',
      'partials/sidebar.ejs'
    ],
    authTemplates: [
      'auth/login.ejs',
      'auth/signup.ejs'
    ],
    assets: [
      'public/css',
      'public/js', 
      'public/images'
    ],
    dataFiles: [
      'sidebar.json'
    ],

    // EJS rendering options
    ejsOptions: {
      views: [
        'templates/default',
        'templates/default/partials'
      ],
      root: process.cwd(),
      locals: {
        // Core utilities
        path: path,
        require: require,
        fs: fs,
        
        // Template helpers
        include: (file, data = {}) => {
          const pathsToTry = [
            path.join(process.cwd(), 'templates/default/partials', `${file}.ejs`),
            path.join(process.cwd(), 'templates/default', `${file}.ejs`),
            path.join(process.cwd(), 'templates/default/auth', `${file}.ejs`)
          ];
          
          for (const fullPath of pathsToTry) {
            if (fs.existsSync(fullPath)) {
              return ejs.render(fs.readFileSync(fullPath, 'utf-8'), {
                ...data,
                path,
                __dirname: path.dirname(fullPath),
                __filename: fullPath
              });
            }
          }
          throw new Error(`Template not found: ${file}`);
        },
        
        // Default template context
        __dirname: path.join(process.cwd(), 'templates/default'),
        __filename: path.join(process.cwd(), 'templates/default/index.ejs')
      }
    }
  },

  // Default template variables
  defaults: {
    title: 'Facebook Mirror',
    user: {
      name: 'Guest',
      avatar: '/public/images/default-avatar.jpg',
      pages: [],
      friends: 0,
      posts: 0
    },
    meta: {
      description: 'A Facebook mirror application',
      keywords: 'facebook, social, mirror'
    },
    sidebar: require('./templates/sidebar.json')
  },

  // Build output configuration
  output: {
    dir: 'dist',
    minify: {
      html: true,
      css: true,
      js: true
    },
    bundleAssets: true,
    hashFilenames: true
  },

  // Server configuration
  server: {
    port: 3000,
    liveReload: true,
    open: true,
    proxy: null,
    https: false
  },

  // Development-specific overrides
  dev: {
    defaults: {
      user: {
        name: 'Developer',
        avatar: '/public/images/dev-avatar.jpg'
      }
    },
    server: {
      port: 3001,
      logLevel: 'debug'
    }
  }
};