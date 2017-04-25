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

# openssl req -new -x509 -days 9999 -config ca.cnf -keyout ca-key.pem -out ca-crt.pem
# openssl genrsa -out server-key.pem 4096
# openssl req -new -config server.cnf -key server-key.pem -out server-csr.pem
# openssl x509 -req -extfile server.cnf -days 999 -passin "pass:password" -in server-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out server-crt.pem

EXPOSE 3000
CMD node app
