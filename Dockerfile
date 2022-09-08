FROM node:12.18.1
ENV NODE_ENV=production

WORKDIR /usr/app

COPY . .

RUN cd react &&\
    cp src/config.docker.js config.js &&\
    mkdir build/sprites || exit 0 &&\
    ln -s build/sprites public/sprites || exit 0 &&\
    npm run build

RUN cd /usr/app && npm install

RUN apt-get update && apt-get install -y \
    vim

CMD [ "/usr/app/start.sh" ]