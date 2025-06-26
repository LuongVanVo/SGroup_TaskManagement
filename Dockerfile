FROM node:22.14.0
WORKDIR /app
COPY package*.json ./
COPY . . 
RUN npm install
EXPOSE 2309
CMD ["npm", "start"]
