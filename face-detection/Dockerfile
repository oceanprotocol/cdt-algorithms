FROM node:alpine

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global \
    PATH=$PATH:/home/node/.npm-global/bin \
    NODE_PATH=/home/node/.npm-global/lib/node_modules/

RUN apt-get -y update && \
    apt-get -y install ffmpeg

COPY . .

RUN npm install && \
    npm cache clean --force && \
    rm -rf /tmp/*