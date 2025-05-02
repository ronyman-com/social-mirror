const FB_API = require('../api/fb');

module.exports = {
  // Render template with Facebook data
  renderWithFBData: async (template, res, additionalData = {}) => {
    try {
      // Get user data if logged in
      const authStatus = await FB_API.auth.getLoginStatus();
      
      const templateData = {
        user: authStatus.status === 'connected' ? await FB_API.profile.getUserData() : null,
        ...additionalData
      };

      res.render(template, templateData);
    } catch (error) {
      console.error('Template rendering error:', error);
      res.render(template, additionalData);
    }
  },

  // Inject FB SDK into templates
  injectFBSDK: (appId) => {
    return `
      <script>
        window.fbAsyncInit = function() {
          FB.init({
            appId: '${appId}',
            cookie: true,
            xfbml: true,
            version: 'v12.0'
          });
        };
      </script>
      <script async defer src="https://connect.facebook.net/en_US/sdk.js"></script>
    `;
  }
};