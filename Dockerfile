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
RUN cp react/src/config.dev.js react/src/config.js

CMD [ "/usr/app/start.sh" ]