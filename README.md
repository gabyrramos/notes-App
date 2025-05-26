# 📝 Notes Management Application

A full-stack Notes Management Application to help users organize their thoughts, tasks, and ideas — featuring category tagging, archiving, and filtering functionality.

---

## 🚀 Features

- ✍️ **Create Notes** – Add notes with title, description, and optional category.
- 📝 **Edit Notes** – Update existing notes.
- 📥 **Archive / Unarchive Notes** – Toggle notes between active and archived.
- 🗑️ **Delete Notes** – Permanently remove notes.
- 🏷️ **Categorize Notes** – Assign categories to better organize notes.
- 🔍 **Filter Notes** – View notes by archive status or category.
- 📱 **Responsive UI** – Clean, responsive design with Tailwind CSS.

---

## ⚙️ Prerequisites

Make sure you have the following installed:

| Tool         | Recommended Version |
|--------------|---------------------|
| **Node.js**  | v18.20.5  |
| **npm**      | ~10.8.2  |
| **PostgreSQL** | 16.2             |

You can verify versions with:
```bash
node -v
npm -v
psql --version

📦 Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/hirelens-challenges/Ramos-1dbecb.git
cd Ramos-1dbecb```


2. Set up PostgreSQL
- Create a database (e.g., notes_db)

- Create a user with access to that DB

- Update backend/config/config.json with your DB credentials

🧰 Running the App
- Run the app with the provided shell script:

```bash
chmod +x run-app.sh
./run-app.sh```


This will:

- Install backend dependencies and run migrations

- Start backend server at http://localhost:3000

- Install frontend dependencies

- Start frontend server at http://localhost:3001

🗂️ Project Structure

├── backend/                  # Express + Sequelize API
│   ├── app.js
│   ├── config/               # Sequelize DB config
│   ├── controllers/          # Route controllers
│   ├── migrations/           # Sequelize migrations
│   ├── models/               # Sequelize models (Note, Category)
│   ├── routes/               # Route definitions
│   └── services/             # Business logic
│
├── frontend/                 # Next.js + React + TypeScript
│   └── src/
│       ├── pages/            # Index, Archive
│       ├── components/       # NoteCard, NoteForm, CategoryDropdown
│       ├── styles/           # Tailwind CSS
│       └── lib/              # API helpers


🧪 Manual Database Migrations

```bash
cd backend
npx sequelize db:migrate              # Apply all migrations
npx sequelize db:migrate:undo         # Undo last migration
npx sequelize db:migrate:undo:all     # Undo all



🔌 API Endpoints
All endpoints served from: http://localhost:3000

🗒️ Notes
Method	Endpoint	                Description
GET	/api/notes	                Get all notes (with filters)
GET	/api/notes/:id	                Get note by ID
POST /api/notes	                        Create a new note
PUT	/api/notes/:id	                Update an existing note
PATCH	/api/notes/:id/toggle      	Toggle archive status
DELETE	/api/notes/:id	         Delete a note

🏷️ Categories
Method	Endpoint	            Description
GET	api/categories	            Get all categories
POST	api/categories	            Create a category

⚠️ Deleting categories not implemented to avoid orphaning associated notes.

🛠️ Technologies Used

🔹 Frontend
Next.js ^14.x.x

React ^18.x.x

Tailwind CSS ^3.x.x

TypeScript ^5.x.x

🔹 Backend
Node.js ^18.20.5

Express.js ^4.x.x

Sequelize ^6.x.x

PostgreSQL 

Sequelize CLI

pg (PostgreSQL driver)


📄 License
This project is for assessment purposes only.

🙌 Acknowledgments
Thank you to the Ensolvers team for the opportunity to complete this technical challenge.

Gabriela Ramos ✨

## 🧭 Future Improvements (Time-Permitting)

- 🔐 Add user login and authentication
- ☁️ Deploy the app (e.g., with Vercel & Render)
- 🧹 Refine error handling and form validation
