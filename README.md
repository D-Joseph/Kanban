# Kanban Board Project

## Preview
![image](https://github.com/user-attachments/assets/6a93b8a8-42bf-4d4b-8035-abfac0bc9a0b)
![image](https://github.com/user-attachments/assets/7499c0c9-7f2e-433a-b7f6-e57a6475f9f4)


## Overview

This project is a custom Kanban board application built using modern web technologies. It provides a visual interface for managing tasks and workflows, allowing users to create, organize, and track tasks across different stages of completion.

## Features

- **User Authentication**: Implemented using Firebase Authentication for secure access.
- **Client-Side Caching**: Implemented caching to reduce load times on a read-heavy system.
- **Real-time Updates**: Utilizes Firestore for live data synchronization across users.
- **Drag and Drop**: Tasks can be easily moved between columns using drag and drop functionality.
- **Customizable Boards**: Users can create multiple boards and customize them with different columns and groups.
- **Task Management**: Create, edit, and delete tasks with various attributes like title, description, assignee, due date, and priority.
- **Filtering**: Tasks can be filtered by group/subteam for easier management.
- **Responsive Design**: Built with a mobile-first approach using Tailwind CSS for responsiveness across devices.

## Technologies Used

- **React**: Frontend library for building the user interface.
- **Vite**: Build tool and development server for faster development.
- **Firebase**: Backend-as-a-Service (BaaS) for authentication, database, and hosting.
- **Material-UI**: React component library for consistent and attractive UI elements.
- **React DnD**: Library for implementing drag and drop functionality.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **ESLint**: Linting tool for maintaining code quality and consistency.

## Project Structure

The project follows a modular structure with separate directories for components, pages, and contexts:

- `src/components`: Reusable UI components like BoardItem, Column, and Header.
- `src/pages`: Main page components for Home, Board, and Authentication.
- `src/contexts`: React contexts for managing authentication and groups state.

## Key Implementations

### Real-time Data Synchronization

The application uses Firestore's `onSnapshot` listener to provide real-time updates to the board and its items. This ensures that all users see the most up-to-date information without needing to refresh the page.

```javascript
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const items = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  setItems(items);
});
```

### Drag and Drop

React DnD is implemented to allow for intuitive task movement between columns. This enhances the user experience by providing a visual way to update task statuses.

```javascript
const [, drop] = useDrop(() => ({
  accept: "BOARD_ITEM",
  drop: (draggedItem) => {
    const updatedItem = { ...draggedItem, status: name.toLowerCase() };
    updateItemStatus(id, updatedItem);
  },
}));
```

### Context API

The project leverages React's Context API for managing global state, particularly for user authentication and group data. This allows for efficient state management without prop drilling.

```javascript
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ... authentication logic
};
```

## Technical Challenges

1. **Real-time Synchronization**: Implementing real-time updates while maintaining performance was challenging. This was addressed by optimizing Firestore queries and using efficient React state management.

2. **Drag and Drop Complexity**: Integrating drag and drop functionality with real-time updates required careful state management to avoid conflicts between local and server states.

3. **Authentication Flow**: Creating a seamless authentication experience while ensuring security and proper access control to boards and tasks required intricate integration with Firebase Authentication.

4. **Performance Optimization**: With potentially large numbers of tasks and real-time updates, optimizing performance was crucial. This was achieved through efficient rendering techniques and data fetching strategies.

## Future Enhancements

- Implement more advanced filtering and sorting options for tasks.
- Add data visualization features for project progress and team productivity.
- Integrate with external tools and APIs for enhanced functionality.
- Implement offline support for better user experience in low-connectivity situations.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up a Firebase project and update the configuration in `src/Firebase.jsx`
4. Run the development server: `npm run dev`

## Deployment

The project is configured for deployment on Firebase Hosting. Use the following commands to deploy:

```bash
npm run build
firebase deploy
```

