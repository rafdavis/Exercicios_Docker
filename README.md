# Resolução da Lista de Exercícios Docker

## 1. Executar um container básico

### Objetivos:
- Executar um container utilizando a imagem do Nginx
- Acessar a página padrão do navegador e substituir por outra.

#### Crie um container com a imagem nginx
```
docker run -dp 8080:80 --name container nginx:1.27
```
- -d: Roda o container em segundo plano
- -p: Mapeia a porta do host:container
- --name: Nomeia o container


![](EX1/imgs/containerNginx.png)

#### Confira se o container foi iniciado
```
docker ps
```

![](EX1/imgs/execContainerNginx.png)

#### Após iniciado digite no navegador
```
localhost:8080
```

![](EX1/imgs/tailwindcss.png)

## 2. Criando e rodando um container interativo

### Objetivos:
- Iniciar um container Ubuntu
- Interagir com o terminal do container
- Testar um script bash dentro do container

#### Dockerfile
```
FROM ubuntu:20.04
RUN apt-get update && apt-get upgrade -y
RUN apt install nano -y
```
- FROM: Qual imagem vai ser carregada
- RUN: Comando para ser executado dentro da construção da imagem

#### Construa uma imagem do Nginx a partir do Dockerfile
```
docker build -t nome_imagem .
```

![](EX2/imgs/buildUbuntu.png)

#### Entre no container 
```
docker run -it nome_imagem bash
```
- -it: Rodar o container em modo interativo

![](EX2/imgs/containerUbuntu.png)

### Dentro do container crie um arquivo .sh

#### Criando script
```
nano script.sh
```

#### Dentro do script.sh digite:
```
#!/bin/bash

apt-get install curl -y
```

![](EX2/imgs/script.png)

#### Salve o arquivo com CTL+O e saia com CTL+X

#### Dê permissão
```
chmod +x script.sh
```

#### Agora é só executar o script
```
./script.sh
```

#### Confira se foi instalado
```
curl --version
```

![](EX2/imgs/curl.png)

## 3. Listando e removendo containers

### Objetivos:
- Listar todos os containers em execução e parados
- Parar um container em execução
- Remover um container

#### Listando todos os containers em execução e parados
```
docker ps -a
```

![](EX3/imgs/containers.png)

#### Parando um container em execução
```
docker stop nome_container
```

![](EX3/imgs/containerStop.png)

#### Removendo um container
```
docker container rm nome_container
```

![](EX3/imgs/containerRemove.png)


## 4. Criando um Dockerfile para uma aplicação simples em python

### Objetivos:
- Criar um Dockerfile para um aplicação Flask
- Retornar uma mensagem ao acessar o endpoint

#### Dockerfile
```
FROM python:3.13.3
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
EXPOSE 4000
CMD [ "python", "app.py" ]
```

#### app.py
```
from flask import Flask

app = Flask(__name__)

@app.route("/")
def posto():
    return "<h1>Acabou a gasolina</h1>"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000)
```

#### requirements.txt
```
flask==2.2.5
```

#### Com o Dockerfile e os arquivos criados basta construir a imagem
```
docker build -t nome_imagem .
```

![](EX4/imgs/buildFlask.png)

#### Criando um container a partir da imagem
```
docker run -dp 4000:4000 nome_imagem
```

![](EX4/imgs/containerFlask.png)

#### Confira se o container foi criado
```
docker ps
```

![](EX4/imgs/execContainerFlask.png)

#### Após criar o container digite no navegador:
```
localhost:4000
```

![](EX4/imgs/runningFlask.png)

## 5. Criando e utilizando volumes para persistência de dados

### Objetivos:
- Executar um container MySQL
- Configurar um volume para armazenar os dados do banco de forma persistente

#### Dockerfile
```
FROM mysql:8.4.3
EXPOSE 3306
```

#### Criando volume
```
docker volume create nome_volume
```

![](EX5/imgs/volumeMysql.png)

#### Construa a imagem com base no Dockerfile
```
docker build -t nome_imagem .
```

![](EX5/imgs/buildMysql.png)

#### Crie o container a partir da imagem
```
docker run -dp 3306:3306 -e MYSQL_ROOT_PASSWORD=senha -v nome_volume:/caminho_volume nome_imagem
```

![](EX5/imgs/containerMysql.png)

#### Confira se o container foi criado
```
docker ps
```

![](EX5/imgs/execContainerMysql.png)

## 6. Criando e rodando um container multi-stage

### Objetivos:
- Utilizar multi-stage build para otimizar aplicação Go
- Reduzir o tamanho da imagem final

#### Dockerfile
```
FROM golang:1.24.1 AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o appGo

FROM alpine:3.18.12
COPY --from=build /app/appGo /
ENTRYPOINT ["/appGo"]
EXPOSE 8080
```

#### Com base no Dockerfile construa a imagem
```
docker build -t nome_imagem .
```

![](EX6/imgs/buildGo.png)

#### Com a imagem criada, agora é criar o container
```
docker run -dp 8080:8080 nome_imagem
```

![](EX6/imgs/containerGo.png)

#### Confira se o container foi criado
```
docker ps
```

![](EX6/imgs/execContainerGo.png)

#### Com o container criado digite no navegador:
```
localhost:8080
```

![](EX6/imgs/runningGo.png)

## 7. Construindo uma rede Docker para comunicação entre containers

### Objetivos:
- Criar uma rede Docker personalizada
- Na rede, criar dois containers: NodeJS e MongoDB
- Criar comunicação entre esses containers

#### Criando rede Docker
```
docker network create nome_rede
```

![](EX7/imgs/createNetwork.png)

#### Conferindo a criação da rede
```
docker network ls
```

![](EX7/imgs/networks.png)

### Com a rede criada agora são os container

#### Primeiro as imagens
```
docker build -t mongo_imagem .
```

![](EX7/imgs/buildBackend.png)

```
docker build -t node_imagem .
```

![](EX7/imgs/buildFrontend.png)

#### Agora sim os containers
```
docker run --name container_mongo --network nome_rede -d imagem_mongo
```

![](EX7/imgs/containerBackend.png)

```
docker run --name container_node --network nome_rede -dp 5000:5000 imagem_node
```

![](EX7/imgs/containerFrontend.png)

#### Confira se eles foram criados
```
docker ps
```

![](EX7/imgs/execContainers.png)

#### Com os containers rodando confira a rede
```
docker network inspect nome_rede
```

![](EX7/imgs/networkContainers.png)

## 8. Criando um compose file para rodar uma aplicação com banco de dados

### Objetivos: 
- Configurar uma aplicação com um banco de dados PostgreSQL utilizando Docker Compose

#### Docker Compose
```
version: "3.8"
services:
  db:
    image: bitnami/postgresql:17
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: teste
      POSTGRES_PASSWORD: 1234
      POSTGRES_DATABASE: postgres
    volumes:
      - dadospg:/bitnami/postgresql
  pg:
    image: dpage/pgadmin4:9.1
    environment:
      PGADMIN_DEFAULT_EMAIL: teste@email.com
      PGADMIN_DEFAULT_PASSWORD: 1234
    ports:
      - "8080:80"
    depends_on:
      - db

volumes:
  dadospg:
```

#### Após copiar o Docker Compose basta rodar 
```
docker compose up -d
```

![](EX8/imgs/composeUp.png)

#### Confira se os containers foram criados
```
docker ps
```

![](EX8/imgs/containersDB.png)

## 9. Criando uma imagem personalizada com um servidor web e arquivos estáticos

### Objetivos:
- Construir uma imagem baseada no Nginx ou Apache
- Adicionar um site HTML/CSS estático

#### Dockerfile
```
FROM nginx:stable-alpine3.21-slim
WORKDIR /usr/share/nginx/html
COPY . .
EXPOSE 80
```

#### Construa a imagem com base no Dockerfile
```
docker build -t nome_imagem .
```

![](EX9/imgs/buildNginx.png)

#### Com a imagem feita é possível criar o container
```
docker run -dp 8080:80 nome_imagem
```

![](EX9/imgs/containerNginx.png)

#### Confira se o container foi iniciado
```
docker ps
```

![](EX9/imgs/execContainerNginx.png)

#### Com o container rodando confira a aplicação no navegador em:
```
localhost:8080
```

![](EX9/imgs/runningNginx.png)

## 10. Evitar execução como root

### Objetivos:
- Criar um Dockerfile para uma aplicação simples
- Configurar imagem para rodar com um usuário não-root

#### Dockerfile
```
FROM node:lts-alpine3.21
RUN addgroup dev && adduser -S -G dev docker
USER docker
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "npm", "start" ]
```

#### Com o Dockerfile em mãos construa a imagem
```
docker build -t nome_imagem .
```

![](EX10/imgs/buildNode.png)

#### Crie o container com base na imagem
```
docker run -dp 4000:4000 nome_imagem
```

![](EX10/imgs/containerNode.png)

#### Confira se o container foi criado
```
docker ps
```

![](EX10/imgs/execContainerNode.png)

#### Entre no container
```
docker exec -it nome_container bash
```
![](EX10/imgs/inContainerNode.png)

#### Dentro do Container verifique o usuário
```
whoami
```

![](EX10/imgs/user.png)

## 11. Analisar imagem Docker com Trivy

### Objetivos:
- Analisar uma imagem pública
- Buscar vulnerabilidades conhecidas

#### Dockerfile
```
FROM node:16
EXPOSE 3000
```

#### Para fazer essa busca de vulnerabilidades é preciso instalar o Trivy
```
sudo apt-get install wget apt-transport-https gnupg lsb-release
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy
```

#### Com base no Dockerfile construa a imagem
```
docker build -t nome_imagem .
```

![](EX11/imgs/buildNode.png)

#### Com a imagem criada verifique as vulnerabilidades
```
trivy image nome_imagem
```

![](EX11/imgs/trivyNode.png)


## 12. Corrigir vulnerabilidades encontradas

### Objetivos: 
- Utilizar Dockerfile com más práticas
- Aplicar melhorias e corrigir as vulnerabilidades encontradas no Dockerfile

#### Dockerfile
```
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD [ "python", "app.py" ]
```

#### app.py
```
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
	return "Hello World!"

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000)
```

#### requirements.txt
```
flask==1.1.1
requests==2.22.0
```

#### Construa a imagem vulnerável
```
docker build -t nome_imagem .
```

![](EX12/imgs/buildFlask.png)

#### Com a imagem feita é possível identificar as vulnerabilidades
```
trivy image nome_imagem
```

![](EX12/imgs/trivyFlask.png)

### Agora é hora de corrigir as vulnerabilidades

#### Atualize o requirements.txt
```
flask==2.3.2
requests==2.32.0
```

#### Construa outra imagem
```
docker build -t nome_imagem .
```

![](EX12/imgs/buildUpdateFlask.png)

#### Confira as vulnerabilidades
```
trivy image nome_imagem
```

![](EX12/imgs/trivyUpdateFlask.png)
