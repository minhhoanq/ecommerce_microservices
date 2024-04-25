FROM node

WORKDIR /app/user_service

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 30043

CMD ["npm", "start"]