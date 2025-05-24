# Etapa de build
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Copia o código-fonte e o pom.xml
COPY src /app/src
COPY pom.xml /app

WORKDIR /app

# Compila o projeto e gera o JAR
RUN mvn clean package -DskipTests

# Etapa final: imagem leve só com o JAR
FROM eclipse-temurin:21-jdk-alpine

# Diretório de trabalho
WORKDIR /app

# Copia o JAR gerado da etapa de build
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta padrão do Spring Boot
EXPOSE 8080

# Comando para rodar o app
ENTRYPOINT ["java", "-jar", "app.jar"]
