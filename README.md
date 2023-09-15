# Equipo 10 - Mavericks Flask
### Inteligencia artificial avanzada para la ciencia de datos I (Gpo 101)
### Integrantes del equipo
* A01751655 Cortés Olvera Gabriela
* A01745865 García Gómez José Ángel
* A01745096 González de la Parra Pablo
* A01751580 Islas Montiel Zaide
* A01745371 Sánchez Bahnsen Elisa

### Objetivo
El proyecto se centró principalmente en la creación y desarrollo de una aplicación basada en Express con el objetivo de facilitar la interacción entre el usuario y la interfaz frontal (frontend). Esta aplicación se diseñó con la capacidad de gestionar y manipular los datos relacionados con los usuarios de manera eficiente y efectiva. En esencia, su propósito principal fue proporcionar una plataforma robusta y confiable para el manejo de información de usuarios a través de una interfaz de usuario amigable y receptiva.

### Requisitos del sistema
* Node.js - [Descargar](https://nodejs.org/es/download/) e instalar la versión LTS (Long Term Support) más reciente (14.17.0)
* npm - [Descargar](https://www.npmjs.com/get-npm) e instalar la versión más reciente (7.13.0)
* .env - Generar un archivo de configuracion con los siguientes elementos: 
```
AWS_REGION
AWS_ACCESS_KEY
AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY
AWS_SESSION_TOKEN
COGNITO_APP_CLIENT_ID
COGNITO_APP_SECRET_HASH
COGNITO_USER_POOL_ID
MONGODB_URI
```

### Instrucciones de uso
1. Clonar el repositorio
2. Abrir una terminal y navegar hasta la carpeta del repositorio
3. Ejecutar el comando `npm install` para instalar las dependencias
4. Ejecutar el comando `npm run build:start` para iniciar el servidor
5. Abrir un navegador web y navegar a la dirección `localhost:8080`