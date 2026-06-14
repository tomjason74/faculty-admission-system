# Faculty Admission & Profiling System - Transfer & Setup Guide

This guide provides instructions for packing, transferring, and setting up the Faculty Admission and Profiling System on a new computer (laptop or desktop).

---

## 📋 Table of Contents
1. [Prerequisites Checklist](#1-prerequisites-checklist)
2. [Step-by-Step Transfer Guide (For Sender)](#2-step-by-step-transfer-guide-for-sender)
3. [Step-by-Step Setup Guide (For Receiver)](#3-step-by-step-setup-guide-for-receiver)
4. [How to Run the System](#4-how-to-run-the-system)
5. [Database Backups & Maintenance](#5-database-backups--maintenance)

---

## 1. Prerequisites Checklist

Before setting up the project, the new computer must have the following runtimes installed and configured in the system's environment variables (`PATH`):

| Software | Required Version | Purpose | Download Link |
| :--- | :--- | :--- | :--- |
| **PHP** | 8.2 or 8.3 | Runs the Laravel backend server | [windows.php.net](https://windows.php.net/download/) |
| **Node.js** | 20.x or newer (LTS) | Compiles the React/Vite frontend | [nodejs.org](https://nodejs.org/) |
| **Composer** | 2.x or newer | Installs PHP package dependencies | [getcomposer.org](https://getcomposer.org/) |
| **Git** *(Optional)* | Any | For cloning/managing code repositories | [git-scm.com](https://git-scm.com/) |

> [!IMPORTANT]
> Ensure that both `php` and `npm` are added to the system **PATH** variable on Windows so they can be run from the command prompt.

---

## 2. Step-by-Step Transfer Guide (For Sender)

If you are uploading the system to Google Drive, OneDrive, or sending it via a flash drive, follow these steps to keep the file size minimal and ensure a fast upload.

1. **Delete temporary library folders** (these folders contain thousands of files and take up over 300MB, but can be easily reinstalled by the receiver):
   * Delete the folder: `node_modules/`
   * Delete the folder: `vendor/`
   * Delete the folder: `bootstrap/cache/*` (Keep the cache folder itself, but delete its contents if any)
2. **Keep the Database File**:
   * Do **NOT** delete the file: `database/database.sqlite`. This file contains all the records, users, and settings.
3. **Compress the folder**:
   * Right-click the `Faculty-Admission-System` folder -> select **Compress to ZIP file**.
4. **Upload/Transfer**:
   * Upload the compressed `.zip` file (which will now only be around 5–10MB) to Google Drive or copy it to a USB drive.

---

## 3. Step-by-Step Setup Guide (For Receiver)

Once the new admin downloads the `.zip` file, follow these steps to restore the application:

1. **Extract the ZIP file**:
   * Extract the ZIP file into your preferred folder (e.g., `C:\Users\Admin\Desktop\Faculty-Admission-System`).
2. **Install runtimes**:
   * Make sure PHP, Node.js, and Composer are installed on your computer.
3. **Restore application libraries**:
   * Open **Command Prompt** or **PowerShell** in the extracted project folder.
   * Run the following command to download and restore the PHP libraries:
     ```bash
     composer install
     ```
   * Next, run this command to download and restore the JavaScript/React libraries:
     ```bash
     npm install
     ```
4. **Ensure `.env` file exists**:
   * Verify there is a file named `.env` in the root of the project. If it is missing, rename `.env.example` to `.env`.
   * Make sure the line `DB_CONNECTION=sqlite` is present in the `.env` file.

---

## 4. How to Run the System

You do not need to keep typing command lines to start the system. A shortcut batch script is already prepared for you:

1. Double-click the file named **`start_system.bat`** in the project root folder.
2. A command prompt window will open. It will automatically:
   * Boot the backend Laravel server on `http://localhost:8000`.
   * Boot the frontend Vite development server.
   * Pause for 4 seconds to allow the databases and services to initialize.
   * Automatically open the application in your default browser at `http://localhost:8000`.
3. **To Stop the System:** Close the command prompt window.

### Creating a Desktop Shortcut (Optional)
If you want an app icon on your desktop:
1. Right-click on `start_system.bat` -> **Send to** -> **Desktop (create shortcut)**.
2. You can rename the shortcut to "Faculty Admission System" and change its icon properties if desired.

---

## 5. Database Backups & Maintenance

* Since the system uses **SQLite**, all database records are self-contained in:
  📂 `database/database.sqlite`
* **How to Backup:** Simply make a copy of the `database.sqlite` file and save it in a safe folder or cloud storage (e.g., `database_backup_2026_06_14.sqlite`).
* **How to Restore:** Replace the active `database.sqlite` file with your backup copy (renaming it back to `database.sqlite`).
