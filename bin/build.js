const path = require('path');
const fs = require('fs').promises;
const ejs = require('ejs');

async function buildFacebookTemplates() {
  // Define all paths
  const templateDir = path.join(__dirname, '../templates/default');
  const partialsDir = path.join(templateDir, 'partials');
  const outputDir = path.join(__dirname, '../dist');
  const assetsDir = path.join(templateDir, 'public');

  try {
    console.log('🚀 Starting Facebook Mirror build process...');

    // 1. Prepare directories
    console.log('📂 Preparing directories...');
    await fs.mkdir(outputDir, { recursive: true });

    // 2. Load all partial templates
    console.log('🔄 Loading partial templates...');
    const partialFiles = await fs.readdir(partialsDir);
    const partials = {};
    
    for (const file of partialFiles) {
      if (path.extname(file) === '.ejs') {
        const name = path.basename(file, '.ejs');
        partials[name] = await fs.readFile(path.join(partialsDir, file), 'utf-8');
        console.log(`   ✓ Loaded partial: ${name}`);
      }
    }

    // 3. Copy public assets
    try {
      await fs.access(assetsDir);
      console.log('🖼️ Copying public assets...');
      await fs.cp(assetsDir, path.join(outputDir, 'public'), { recursive: true });
      console.log('   ✓ Assets copied');
    } catch {
      console.log('   ⚠️ No public assets directory found');
    }

    // 4. Create sample data for the template
    const templateData = {
      // Current user data
      user: {
        name: 'John Doe',
        avatar: '/public/images/default-avatar.jpg'
      },

      // Stories data
      stories: [
        {
          image: '/public/images/story1.jpg',
          user: {
            name: 'Alice Smith',
            avatar: '/public/images/avatar1.jpg'
          }
        },
        {
          image: '/public/images/story2.jpg',
          user: {
            name: 'Bob Johnson',
            avatar: '/public/images/avatar2.jpg'
          }
        },
        {
          image: '/public/images/story3.jpg',
          user: {
            name: 'Charlie Brown',
            avatar: '/public/images/avatar3.jpg'
          }
        }
      ],

      // Posts data
      posts: [
        {
          id: 'post1',
          user: {
            name: 'Alice Smith',
            avatar: '/public/images/avatar1.jpg'
          },
          created_time: new Date(),
          message: 'Having a great day at the beach! 🏖️',
          image: '/public/images/post1.jpg',
          likes: 42,
          comments: 7,
          shares: 3
        },
        {
          id: 'post2',
          user: {
            name: 'Bob Johnson',
            avatar: '/public/images/avatar2.jpg'
          },
          created_time: new Date(Date.now() - 3600000 * 3), // 3 hours ago
          message: 'Just finished my new project! Check it out!',
          likes: 28,
          comments: 5,
          shares: 2
        }
      ],

      // Sponsored content
      sponsored: [
        {
          image: '/public/images/ad1.jpg',
          title: 'Amazing Product',
          domain: 'amazingproduct.com'
        },
        {
          image: '/public/images/ad2.jpg',
          title: 'Travel Deals',
          domain: 'traveldeals.com'
        }
      ],

      // Birthdays
      birthdays: [
        {
          name: 'Emma Watson'
        },
        {
          name: 'Daniel Radcliffe'
        }
      ],

      // Contacts
      contacts: [
        {
          name: 'Alice Smith',
          avatar: '/public/images/avatar1.jpg',
          online: true
        },
        {
          name: 'Bob Johnson',
          avatar: '/public/images/avatar2.jpg',
          online: false
        },
        {
          name: 'Charlie Brown',
          avatar: '/public/images/avatar3.jpg',
          online: true
        }
      ],

      // Template configuration
      title: 'Facebook Mirror',
      path: path, // Make path module available
      __dirname: templateDir, // Set template directory
      filename: path.join(templateDir, 'index.ejs'), // Required for includes
      
      // EJS configuration
      root: templateDir,
      views: [partialsDir],
      cache: false,
      
      // Helper function for safe includes
      include: (file, data = {}) => {
        const fullPath = path.join(partialsDir, `${file}.ejs`);
        return ejs.render(partials[file] || '', { ...data, path, __dirname: partialsDir });
      }
    };

    // 5. Render main template with proper context
    console.log('🎨 Rendering templates...');
    const template = await fs.readFile(path.join(templateDir, 'index.ejs'), 'utf-8');
    const rendered = ejs.render(template, templateData);

    // 6. Write output
    await fs.writeFile(path.join(outputDir, 'index.html'), rendered);
    
    console.log('✅ Build completed successfully!');
    console.log(`📁 Output directory: ${path.resolve(outputDir)}`);

  } catch (error) {
    console.error('❌ Build failed:');
    console.error(error.stack || error.message);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  buildFacebookTemplates();
}

module.exports = { buildFacebookTemplates };