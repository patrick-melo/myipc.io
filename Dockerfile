FROM node:16.15.0
ENV NODE_ENV=production

WORKDIR /usr/app

COPY . .

# Install vi (for debugging)
RUN apt-get update && apt-get install -y \
    vim

# Install dependencies
RUN cd /usr/app && npm install

# Build react
RUN cd react &&\
    cp src/config.dev.js src/config.js
#    npm run build &&\
#    mv build/index.html build/main.html &&\
#    mkdir build/sprites

CMD [ "/usr/app/start.sh" ]