import * as dotenv from 'dotenv';
dotenv.config();

export const jwt_config = {
  access_token_secret: 'belajar_jwt',
  secret: process.env.JWT_SECRET,
  expired: process.env.JWT_EXPIRED,
  refresh_token_secret: 'fajfngjgan',
};
