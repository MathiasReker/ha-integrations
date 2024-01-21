import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import heating from './src/routes/heating.route.js';
import { notFound } from './src/middlewares/error.middleware.js';
import { corsOptions } from './src/configs/cors.config.js';
import { jsonOptions, urlEncodedOptions } from './src/configs/express.config.js';
import { limiterOptions } from './src/configs/limiter.config.js';
import { apiOptions } from './src/configs/api.config.js';
import { compressionOptions } from './src/configs/compression.config.js';
import { helmetOptions } from './src/configs/helmet.config.js';
import verifyMiddleware from './src/middlewares/verify.middleware.js';

const app = express();

app.set('trust proxy', 1);
app.use(verifyMiddleware);
app.use(cors(corsOptions));
app.use(compression(compressionOptions));
app.use(helmet(helmetOptions));
app.use(express.urlencoded(urlEncodedOptions));
app.use(express.json(jsonOptions));
app.use(rateLimit(limiterOptions));
app.use(`${apiOptions.prefix}/heating`, heating);
app.use(notFound);

export default app;
