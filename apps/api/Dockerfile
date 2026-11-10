FROM node:20-alpine
RUN apk add --no-cache ffmpeg
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY tsconfig.json ./
COPY src ./src
RUN npm install -D typescript && npm run build
ENV NODE_ENV=production
EXPOSE 8787
CMD ["npm","start"]
