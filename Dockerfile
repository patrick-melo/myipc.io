FROM node:16.15.0
ENV NODE_ENV=production

WORKDIR /usr/app

COPY . .

# Install vi (for debugging)
RUN apt-get update && apt-get install -y \
    vim

# Install dependencies
RUN apt-get install -y libsdl-pango-dev
RUN npm install -g \
    npm@9.1.3 \
    react-scripts
RUN cd /usr/app && npm install

# Build react
RUN cp react/src/config.dev.js react/src/config.js

CMD [ "/usr/app/start.sh" ]