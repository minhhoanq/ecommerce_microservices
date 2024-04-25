FROM node

WORKDIR /app/notification_service

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 30045

CMD ["npm", "start"]