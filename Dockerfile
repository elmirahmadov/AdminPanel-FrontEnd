FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

ENV APP_PORT=${APP_PORT}

EXPOSE ${APP_PORT}

CMD [ "sh", "-c", "serve -s dist -l $APP_PORT" ]
