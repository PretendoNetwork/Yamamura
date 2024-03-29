FROM node:18-alpine

RUN apk add --no-cache python3 make gcc g++ 
WORKDIR /app

COPY "docker/entrypoint.sh" ./

COPY package*.json ./
RUN npm install

COPY . ./

VOLUME [ "/app/config.json", "/app/db.json" ]

CMD ["sh", "entrypoint.sh"]
