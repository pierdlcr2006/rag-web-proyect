# Base stage for shared dependencies
FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install

# Development stage
FROM base AS development
COPY . .
EXPOSE 5173
CMD ["yarn", "dev", "--host"]

# Build stage for production
FROM base AS build
COPY . .
RUN yarn build

# Production stage with Nginx
FROM nginx:alpine AS production
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
