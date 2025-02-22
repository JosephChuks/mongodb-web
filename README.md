# Mongo Web

![image](https://github.com/user-attachments/assets/5e402eab-0494-4535-b59a-f78d07af69e7)

![image](https://github.com/user-attachments/assets/766d35bf-8252-47a5-8430-4b5580bb248a)

![image](https://github.com/user-attachments/assets/5cec8e99-c35c-4548-b277-7a78d9b2d163)

![image](https://github.com/user-attachments/assets/3eae791d-3f60-4084-89e8-dba5ab2983e7)

![image](https://github.com/user-attachments/assets/ebc4d773-ed97-47a8-90a2-5bd1145f9f9d)


**Mongo Web - An equivalent of phpMyAdmin but for MongoDB.**

Mongo Web is a simple web application for managing MongoDB databases. It allows you to view, create, update, and delete databases and collections, as well as perform CRUD operations on documents within collections through a web interface.

Mongo Web is built using Next.js, React, and Tailwind CSS. It uses the MongoDB Node.js Driver to interact with MongoDB databases.

## Features
- 📂 View and manage databases and collections
- ➕➖ Create, update, and delete databases and collections
- 📝 Perform CRUD operations on documents within collections
- 🔍 Filter, search, and sort documents

## Requirements
- ✅ Node.js (version 14 or higher)
- ✅ MongoDB server installed and running
- ✅ Admin credentials to access the MongoDB server (new database accounts will be created under the admin user)

## Installation

To run a NodeJS server that requires a start file, run the following command: `node server.js`
### 🔽 Clone Repository
```bash
git clone https://github.com/JosephChuks/mongo-web.git
cd mongo-web
```

### ⚙️ Setup Environment Variables
Create a `.env.local` file and configure it as shown below:
```ini
NODE_ENV=development
PORT=3000
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET="JfHxRDPc0rufrQyuTzTBgf5pzJ/mJxZUDTbpX4UejWY="
MONGO_ADMIN_PASSWORD=admin_password
ENABLE_AUTH_API=yes # yes or no to enable authentication API (optional)
AUTH_API=http://localhost:8000/auth.php
```

### 📦 Install Dependencies
```bash
npm install
```

### 🚀 Run Development Server
```bash
npm run dev
```

Now, access the application by opening [http://localhost:3000](http://localhost:3000) in your web browser.

## Usage
- 🔑 Log in using your MongoDB username and password.
- 📌 Databases are created under the admin user and prefixed with the logged-in username.

## Authentication
Mongo Web uses **NextAuth** for authentication and authorization.

To authenticate username and password, enable `ENABLE_AUTH_API` in `.env` and set the `AUTH_API` endpoint, which receives credentials from the frontend via POST and returns a `{success: true}` object if the credentials are valid.

## Contributing
Pull requests are welcome! Feel free to fork the repository and submit improvements. Please follow the [contribution guidelines](CONTRIBUTING.md).

## License
This project is licensed under the [MIT License](LICENSE).

---

💙 **Star this repository** if you find it useful!

