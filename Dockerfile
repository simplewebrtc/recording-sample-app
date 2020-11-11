FROM node:12

ENV NODE_ENV=development
ADD . /app
WORKDIR /app

RUN npm ci

WORKDIR /app/client
RUN npm ci
ARG CONFIG_URL
RUN npm run build

ENV NODE_ENV=production

EXPOSE 5000

WORKDIR /app

CMD ["npm", "start"]
