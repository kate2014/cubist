/**
 * Settings for api server in production environment
 */
const settings = {
  PORT: 6000,
  JWT_SECRET: 'cubist-by-studio-slash-production',
  DATABASE_URL: 'mongodb://localhost/cubist-api-production',
  SENDGRID_API_KEY: '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',
  ADMIN_NAME: 'admin',
  ADMIN_EMAIL: 'admin@cubist3d.me',
  ADMIN_PASSWORD: 'cubist3d.me'
};

export default settings;
