FROM node:20.17.0-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app
RUN npm run build

EXPOSE 9090

CMD ["npm", "run", "preview"]