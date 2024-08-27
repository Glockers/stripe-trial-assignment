import { json } from 'body-parser';
import { Request } from 'express';
import { WEBHOOK_ENDPOINT } from 'src/shared/constants/stripe';

export interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

function rawBodyMiddleware() {
  return json({
    verify: (request: RequestWithRawBody, _, buffer: Buffer) => {
      if (request.url === WEBHOOK_ENDPOINT && Buffer.isBuffer(buffer)) {
        request.rawBody = Buffer.from(buffer);
      }
      return true;
    }
  });
}

export default rawBodyMiddleware;
