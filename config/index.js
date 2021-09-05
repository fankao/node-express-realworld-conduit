const env = process.env;
const isProduction = env.NODE_ENV === 'production';
const secret = isProduction ? env.PROD_JWT_SECRET : env.JWT_SECRET;
const expires = isProduction ? env.PROD_JWT_EXPIRES_IN : env.JWT_EXPIRES_IN;
const mongo_uri = isProduction ?
  env.DATABASE.replace('DATABASE_PASSWORD', env.DATABASE_PASSWORD) :
  env.DATABASE_LOCAL
module.exports = {
  secret,
  expires,
  mongo_uri
};
