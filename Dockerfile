FROM node:18

WORKDIR /usr/src/app

COPY . .

COPY package.json /usr/src/app/
RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/app.js"]
