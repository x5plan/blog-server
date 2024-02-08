FROM node:lts-alpine
RUN apk add tzdata

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY config-example.yaml ./config.yaml
COPY dist ./dist

RUN yarn install --production

ENV TZ=Asia/Shanghai
ENV NODE_ENV=production
ENV X5PLAN_BLOG_CONFIG=/app/config.yaml

VOLUME ["/app/config.yaml"]

CMD ["yarn", "start:prod"]
