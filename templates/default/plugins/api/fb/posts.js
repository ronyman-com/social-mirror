const FB_POSTS = {
    // Get user's posts
    getPosts: (userId, fields = 'id,message,created_time,full_picture') => {
      return new Promise((resolve, reject) => {
        FB.api(
          `/${userId}/posts`,
          { fields: fields },
          (response) => {
            if (response.error) reject(response.error);
            else resolve(response);
          }
        );
      });
    },
  
    // Create a new post
    createPost: (userId, message) => {
      return new Promise((resolve, reject) => {
        FB.api(
          `/${userId}/feed`,
          'POST',
          { message: message },
          (response) => {
            if (response.error) reject(response.error);
            else resolve(response);
          }
        );
      });
    }
  };
  
  module.exports = FB_POSTS;