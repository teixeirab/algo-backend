FROM node:7.7

VOLUME /root/.npm

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD package.json /usr/src/app
RUN npm install
ADD . /usr/src/app
# ARG DOMAIN
# ENV DOMAIN=$DOMAIN

EXPOSE 3000
CMD node app
