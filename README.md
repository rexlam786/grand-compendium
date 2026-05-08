# The Grand Compendium

A hierarchical knowledge management web app built with React.

The Grand Compendium is designed to function as a lightweight personal wiki / notebook system for organizing large projects, ideas, worldbuilding notes, development plans, and long-form structured thoughts.

Unlike traditional note apps, every entry can contain infinitely nested child entries, allowing ideas to be broken down into chapters, subchapters, and detailed branches.

---

# Website

[The Grand Compendium](grand-compendium.web.app)


# Features

## Current MVP Features

* Recursive chapter/subchapter hierarchy
* Expandable/collapsible navigation tree
* Rich text note editing
* Search by title or content
* Recursive node deletion
* Drag-and-drop chapter nesting
* Local persistence using localStorage
* Mobile responsive layout
* Collapsible sidebar navigation

---

# Tech Stack

## Frontend

* React
* JavaScript
* CSS

## Storage

* localStorage (current MVP)
* Firebase Firestore (planned)

## Deployment

* Firebase Hosting

---

# Project Structure

```text
src/
├── components/
│   ├── Sidebar/
│   ├── TreeNode/
│   ├── Editor/
│
├── services/
│
├── styles/
│
├── utils/
│
├── App.js
└── index.js
```

---

# Data Architecture

The application uses a flat node structure instead of deeply nested JSON trees.

Each node contains a `parentId` field:

```js
{
  id,
  title,
  content,
  parentId,
  expanded
}
```

This allows:

* infinite nesting
* recursive rendering
* efficient searching
* easier drag/drop manipulation
* scalable cloud storage

---

# How It Works

## Recursive Tree Rendering

The sidebar uses recursive React components to render nested chapters:

```text
Chapter
 ├── Subchapter
 │    ├── Notes
 │    └── Ideas
 └── Additional Notes
```

Each node can:

* contain text content
* contain child nodes
* be reordered
* be deleted recursively

---

# Running Locally

## Install dependencies

```bash
npm install
```

## Start development server

```bash
npm start
```

---

# Build for Production

```bash
npm run build
```

---

# Deployment

This project is intended to be deployed using Firebase Hosting.

```bash
firebase deploy
```

---

# Planned Features

## High Priority

* Firebase Firestore synchronization
* User authentication
* Cloud save
* Markdown support
* Chapter ordering system
* Drag/drop reordering improvements
* Search highlighting
* Auto-save indicators

---

# Future Ideas

## Knowledge Management Features

* Tags
* Favorites
* Backlinks
* Graph visualization
* Cross-note references
* Completion tracking
* Progress percentages

---

# Editor Improvements

* Rich text formatting
* Image embedding
* Code blocks
* Tables
* Checklists
* Syntax highlighting

---

# Long-Term Vision

The Grand Compendium is intended to evolve into a scalable personal knowledge system combining ideas from:

* OneNote
* Obsidian
* Notion
* Personal wiki systems
* Development documentation tools

while remaining lightweight, understandable, and fully customizable.

---

# Learning Goals

This project was also built as a software engineering learning project covering:

* recursive rendering
* tree data structures
* React state management
* drag-and-drop systems
* responsive design
* cloud persistence
* scalable application architecture

---

# License

Personal project / open learning project.
