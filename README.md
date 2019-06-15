# airy-canvas-mini

> [airy-canvas](https://github.com/Airyworks/airy-canvas-mini) mini demo

## Quick start

### docker

```
docker run \
  -p 3333:3000 \
  -d \
  you06/airy-canvas-mini
  -r [redis address]:[redis port]
```

### docker-compose with redis integrate
- create a directory
- create `docker-compose.yml`, this is a example [docker-compose](https://github.com/Airyworks/airy-canvas-mini/blob/master/Dockerfile)
- create `data` directory for data persistent
- run `docker-compose up -d`

## Manual build

```sh
git clone https://github.com/Airyworks/airy-canvas-mini.git
cd airy-canvas-mini
yarn && yarn build
yarn start
```
