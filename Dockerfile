FROM node:lts-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn prisma generate

RUN yarn prisma migrate deploy

RUN yarn build

CMD [ "yarn", "start:prod" ]
