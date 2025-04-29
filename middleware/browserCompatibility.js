module.exports = function(req, res, next) {
    const userAgent = req.headers['user-agent'] || '';
    
    res.locals.browser = {
      isIE: userAgent.includes('Trident'),
      isEdge: userAgent.includes('Edg'),
      isSafari: userAgent.includes('Safari') && !userAgent.includes('Chrome'),
      needsPolyfills: userAgent.includes('MSIE') || userAgent.includes('Trident')
    };
    
    next();
  };