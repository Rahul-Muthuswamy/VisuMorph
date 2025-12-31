# PostgreSQL Database Setup

## Quick Setup

### 1. Install PostgreSQL

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Or use Chocolatey: `choco install postgresql`

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE visumorph;

# Exit psql
\q
```

### 3. Configure Environment Variables

Add to your `backend/.env` file:

```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=visumorph
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

### 4. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 5. Initialize Database

The database table will be created automatically when you start the FastAPI server (it runs `init_db()` on startup).

You can also manually initialize by running:

```python
from database import init_db
init_db()
```

## Verify Setup

1. Start your FastAPI server
2. Check that the `users` table was created:
   ```bash
   psql -U postgres -d visumorph
   \dt  # List tables
   \d users  # Describe users table
   ```

## Troubleshooting

- **Connection refused**: Make sure PostgreSQL is running
- **Authentication failed**: Check DB_USER and DB_PASSWORD in .env
- **Database doesn't exist**: Create it manually (step 2 above)




