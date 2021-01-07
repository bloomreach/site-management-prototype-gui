FROM node:alpine

WORKDIR /app

ENV REACT_APP_BASE_URL=http://localhost:8080
ENV REACT_APP_USERNAME=admin
ENV REACT_APP_PASSWORD=admin

COPY package.json /app

RUN yarn install

COPY . /app

CMD ["yarn", "run", "start"]