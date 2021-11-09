FROM node:12.18-alpine

WORKDIR /app

RUN npm install -g pm2
RUN npm install -g serve

COPY ["server/package.json", "server/package-lock.json*", "./server/"]

RUN chown -R node:node /app
USER node

RUN cd server && npm install --silent

COPY --chown=node:node . .

CMD ["pm2-runtime", "ecosystem.config.js"]
