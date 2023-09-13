import * as bcrypt from 'bcrypt';
import { decode, sign, verify } from 'jsonwebtoken';
import { LogUtil } from './customLogger';
import { UnauthorizedException } from '@nestjs/common';

/**
 *
 * Configuration for socket connection
 *
 */
export const socketConfig = {
  cors: {
    origin: 'http://localhost:8081',
    methods: ['GET', 'POST'],
  },
};

/**
 *
 * Configuration for redis connection
 *
 */
export const redisConfig = {
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
};

/**
 *
 * Returns hashed value of a string
 *
 * @param value - type: string
 * @returns Promise\<string\>
 */
export const getHash = async (value: string) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND));
  return await bcrypt.hash(value, salt);
};

/**
 *
 * Checks where value matches the provided hash using bcrypt
 *
 * @param hash - type: string
 * @param value - type: string
 * @returns Promise\<boolean\>
 */
export const verifyHash = async (hash: string, value: string) => {
  return await bcrypt.compare(value, hash);
};

/**
 *
 * @param userId - type: string
 * @returns JWT - type: string
 */
export const getJWT = (userId: string) => {
  return sign(
    {
      token: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30m',
    },
  );
};

/**
 *
 * Verifies JWT with the "JWT_SECRET" secret present in .env
 *
 * @param jwt - type: string
 */
export const verifyJWT = (jwt: string) => {
  try {
    verify(jwt, process.env.JWT_SECRET);
    return true;
  } catch (err) {
    LogUtil.error(err.stack);
    throw new UnauthorizedException('Invalid credentials');
  }
};

/**
 *
 * Decodes JWT and return userId
 *
 * @param jwt - type: string
 * @returns userId - type: string
 */
export const getUserId = (jwt: string) => {
  return decode(jwt).token;
};
