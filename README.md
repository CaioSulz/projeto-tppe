# projeto-tppe

Sistema de Gerenciamento de Locatarios de Carros. 


---

<br>

## Diagrama de Classes do Projeto

<div align='center'>
<p>Diagrama UML de Classes:</p>
<a href="docs/assets/DiagramaClassesTPPE.png"><img src='assets/ProjetoOO-UML.png'></img></a>
</div>

## Backlog do Projeto

 [Backlog do Projeto](https://github.com/users/CaioSulz/projects/1) 

---

## Requisitos para executar o projeto

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## Como executar o projeto

1. **Clone o repositório**
   ```bash
   git clone https://github.com/CaioSulz/projeto-tppe.git
   cd projeto-tppe
   ```

2. **Build dos containers**

    ```bash
    docker-compose up --build
    ```

3. **Acesse as aplicações:**

   - **Frontend (Interface Principal)**: http://localhost:3000
   - **Backend API**: http://localhost:8080
   - **Documentação da API (Swagger)**: http://localhost:8080/swagger-ui.html

## Comandos Úteis

```bash
# Executar em background
docker-compose up -d

# Parar todos os containers
docker-compose down

# Rebuild apenas um serviço específico
docker-compose up --build app
docker-compose up --build frontend


