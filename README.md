# Table Editor

A React-based table editor with hierarchical data support, built with Mantine React Table, Redux Toolkit, and TypeScript.

## Features

- 📊 **Hierarchical Data Tables**: Support for nested person records with expandable rows
- 🔄 **Full CRUD Operations**: Create, Read, Update, Delete operations with Redux integration
- 🎨 **Modern UI**: Built with Mantine v6 for beautiful, accessible components
- 🔍 **Advanced Filtering**: Multi-select filters with custom styling
- ✏️ **Inline Editing**: Row-based editing with modal dialogs
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔧 **TypeScript**: Full type safety throughout the application

## Tech Stack

- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Mantine v6** for UI components
- **Mantine React Table** for advanced table functionality
- **Create React App** for development and build tooling

## Prerequisites

- Node.js 16+
- npm or yarn

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd table-editor
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Install React app dependencies**:
   ```bash
   npm install --prefix src
   ```

## Development

### Starting the Development Server

```bash
npm start --prefix src
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Development Features

- **Hot Reload**: Changes are reflected immediately in the browser
- **TypeScript**: Full type checking and IntelliSense support
- **Redux DevTools**: Available in browser for debugging state changes

## Building for Production

### Create Production Build

```bash
npm run build --prefix src
```

This creates an optimized production build in the `src/build` directory.

### Serve Production Build

```bash
npm install -g serve
serve -s src/build -l 3000
```

## Project Structure

```
table-editor/
├── src/                    # React application
│   ├── src/
│   │   ├── App.tsx        # Main application component
│   │   ├── index.tsx      # Application entry point
│   │   ├── store.ts       # Redux store configuration
│   │   └── ...
│   ├── package.json       # React app dependencies
│   └── ...
├── package.json           # Root dependencies
└── README.md             # This file
```

## Usage

### Table Features

1. **Viewing Data**: The table displays hierarchical person data with expandable rows
2. **Filtering**: Use the multi-select filter on the Status column
3. **Editing**: Click the edit button on any row to modify data
4. **Adding**: Use the "Create New Row" button to add new persons
5. **Expanding**: Click the expand button to view child records

### Redux State Management

The application uses Redux Toolkit for state management:

- **State Structure**: Hierarchical person data with loading states
- **Actions**: `addPerson`, `updatePerson`, `deletePerson`, `setData`, `setLoading`
- **Recursive Operations**: Update and delete operations work at any level in the tree

### Data Structure

```typescript
interface Person {
  id: string;
  name: string;
  age: number;
  status: 'active' | 'inactive';
  children?: Person[];
}
```

## Available Scripts

### Root Directory

- `npm install` - Install root dependencies
- `npm install --prefix src` - Install React app dependencies

### React App Directory (src/)

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

## Configuration

### Mantine Configuration

The application uses Mantine v6 with the following configuration:

```typescript
<MantineProvider withGlobalStyles withNormalizeCSS>
  <App />
</MantineProvider>
```

### Redux Store

The Redux store is configured with:

- **Person Slice**: Manages hierarchical person data
- **Recursive Operations**: Update and delete work at any tree level
- **Loading States**: For async operations

## Troubleshooting

### Common Issues

1. **Port 3000 in use**: Change the port in `src/package.json` scripts
2. **TypeScript errors**: Ensure all dependencies are properly installed
3. **Mantine styling issues**: Verify Mantine v6 is installed correctly

### Dependencies

If you encounter dependency issues:

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules src/node_modules
npm install
npm install --prefix src
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

- Check the [Mantine React Table documentation](https://www.mantine-react-table.com/)
- Review the [Redux Toolkit documentation](https://redux-toolkit.js.org/)
- Open an issue in this repository
