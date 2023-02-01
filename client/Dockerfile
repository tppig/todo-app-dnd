# syntax=docker/dockerfile:1
FROM node:18-alpine
ENV NODE_OPTIONS=--openssl-legacy-provider
#ENV WATCHPACK_POLLING=true
WORKDIR /app
COPY . .
RUN npm i
CMD ["npm", "start"]
EXPOSE 3000