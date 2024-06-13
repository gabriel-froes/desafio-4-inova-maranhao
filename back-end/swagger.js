const DisableAuthorizePlugin = () => ({
    wrapComponents: {
      authorizeBtn: () => () => null
    }
});
  
const swaggerOptions = {
    swaggerOptions: {
      plugins: [
        DisableAuthorizePlugin
      ],
    },
};
  
const swaggerSpec = {
    definition: {
        info: {
          title: 'Sistema de Login API',
          version: "1.0.0",
        },
        security: [],
    },
    apis: ['api/User.js'],
};
  
  
module.exports = {
    swaggerSpec,
    swaggerOptions    
};