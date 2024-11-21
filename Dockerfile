FROM node:20.15 as build
WORKDIR /app
COPY package*.json .
RUN npm install 
COPY . .
RUN npm run build 

FROM node:20.15 
WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY --from=build /app/dist ./dist
CMD npm run start:prod 