# The platform option fixes `exec /usr/local/bin/docker-entrypoint.sh: exec format error` error in ECS
FROM --platform=linux/amd64 node:16.15.0
ENV NODE_ENV=production

WORKDIR /usr/app

COPY . .

# Install system dependencies
RUN apt-get update && apt-get install -y libsdl-pango-dev
RUN npm install -g \
    npm@9.1.3 \
    react-scripts

# Build react
RUN bin/m.sh init reactlocal

# Use a script so that we can change what gets run without rebuilding.
ENTRYPOINT [ "/usr/app/start.sh" ]
