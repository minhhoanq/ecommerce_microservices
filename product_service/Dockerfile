FROM node

WORKDIR /app/product_service

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 30044

CMD ["npm", "start"]