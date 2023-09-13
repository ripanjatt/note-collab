FROM node:16 As development

WORKDIR /app

COPY package.json ./

RUN npm i -g rimraf
RUN npm install

COPY . .

RUN npm run build

FROM node:16 As production

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production
RUN npm install pm2 -g

COPY .env ./.env
COPY ./public/test.html ./public/test.html

COPY --from=development /app/dist ./dist

CMD pm2 start npm --name "note-collab" -- run start:prod && pm2 log note-collab