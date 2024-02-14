FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

ENV NODE_ENV=production

EXPOSE 3333

CMD ["npm", "run", "start:prod"]
