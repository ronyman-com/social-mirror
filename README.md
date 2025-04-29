# Facebook Mirror Platform

A mirror platform for Facebook that allows users to authenticate via Facebook and manage their content through our interface.

## Features

- Facebook OAuth authentication
- View and manage personal profile
- Create and manage Facebook pages
- Post content to personal profile and pages
- View news feed
- Mirror Facebook's UI for familiar user experience
- Admin capabilities for platform managers

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Set up your Facebook Developer app and add credentials to `.env`
5. Start the server: `npm start`

## Configuration

### Facebook App Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Configure valid OAuth redirect URIs
5. Add required permissions:
   - public_profile
   - email
   - pages_show_list
   - pages_manage_posts

### Environment Variables

- `FACEBOOK_APP_ID`: Your Facebook App ID
- `FACEBOOK_APP_SECRET`: Your Facebook App Secret
- `FACEBOOK_CALLBACK_URL`: Callback URL for OAuth
- `MONGODB_URI`: MongoDB connection string
- `SESSION_SECRET`: Secret for session encryption

## API Endpoints

### Authentication
- `GET /auth/facebook` - Initiate Facebook login
- `GET /auth/facebook/callback` - Facebook callback
- `GET /logout` - Logout user

### Profile
- `GET /` - User profile and feed

### Pages
- `GET /pages` - List managed pages
- `GET /pages/create` - Page creation form
- `POST /pages/create` - Create new page

## Admin Features

Platform administrators can:
- Manage user accounts
- Moderate content
- Access analytics
- Configure platform settings

## License

MIT

facebook-mirror/
├── dist/                      # Compiled/processed files
├── templates/                # All template files
│   ├── default/              # Default template set
│   │   ├── public/           # Public assets
│   │   │   ├── css/
│   │   │   │   └── style.css
│   │   │   └── js/
│   │   │       └── main.js
│   │   ├── partials/         # Reusable template partials
│   │   │   ├── header.ejs
│   │   │   ├── sidebar.ejs
│   │   │   └── footer.ejs
│   │   ├── auth/             # Authentication templates
│   │   │   └── login.ejs
│   │   ├── pages/            # Page management templates
│   │   │   ├── create.ejs
│   │   │   └── manage.ejs
│   │   ├── index.ejs         # Main page template
│   │   └── profile.ejs       # Profile page template
│   └── sidebar.json          # Sidebar configuration
├── config/                   # Configuration files
│   ├── facebook.js           # Facebook API config
│   ├── passport.js           # Passport authentication config
│   └── firebase.js           # Firebase configuration
├── models/                   # Data models
│   └── User.js               # User model (Firebase version)
├── routes/                   # Route handlers
│   ├── auth.js               # Authentication routes
│   ├── pages.js              # Page management routes
│   ├── posts.js              # Post management routes
│   └── profile.js            # Profile routes
├── app.js                    # Main application entry point
├── package.json              # Project dependencies and scripts
├── .env                      # Environment variables
├── .gitignore                # Git ignore rules
├── serviceAccountKey.json    # Firebase service account key
├── firestore.rules           # Firebase security rules
└── README.md                 # Project documentation