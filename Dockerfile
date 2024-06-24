FROM node:21-slim

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

RUN rm -rf ./src

EXPOSE 4000

CMD ["npm", "run", "start:prod"]