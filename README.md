## Project 7 | OpenClassrooms | Créez un Réseau Social d'Entreprise

## :pushpin: Project Backend Setup

1. Open a terminal at the root of the project

2. Run the following command to reach the directory "backend"

```
cd backend
```
3. Install the Dependencies

```
npm install
```
4. Create a "images" folder in the "backend" folder (whose name must be "images")
5. Create a project in mongoDB, specify a user with a specific username and password, and create a cluster
6. Create a file .env likes the file .env.example and write the following informations in this file

```
PORT=3000
DB_USERNAME="your mongoDB user name"
DB_PWD="your mongoDB user password"
DB_CLUSTER="your mongoDB cluster name"
JWT_KEY_TOKEN="Create an API token"

```
7. In this file, write your own MongoDB project user name, password and cluster name
8. Generate your own API token and write it also in the file .env for JWT_KEY_TOKEN
9. Run backend server with this command

```
npm start
```
10. Be sure that you see these messages!

![image](https://user-images.githubusercontent.com/80323415/195582036-5e1988b5-2696-4b77-9d89-525764bf2a37.png)

## :pushpin: Project Frontend Setup

1. Open a terminal at the root of the project

2. Run the following command to reach the directory "frontend"

```
cd frontend
```
3. Install the Dependencies

```
npm install
```
4. Run backend server with this command

```
npm run serve
```
5. Be sure that you see this message!

![image](https://user-images.githubusercontent.com/80323415/195582194-75fba201-02de-4a46-9af0-3887349f1c47.png)

6. Type the following URL in your browser to reach the application

👉 http://localhost:8080/
