# GitHub CI Setup

Simple GitHub Actions workflows for the React Native client and Egg.js server.

## Workflows

### 1. Main CI (`ci.yml`)
- Detects which parts of the codebase changed
- Provides a summary of what will be built

### 2. Client CI (`client.yml`)
- **Trigger**: Changes to `client/**` files
- **Commands**: 
  - `yarn install` - Install dependencies (10min timeout)
  - `npm run lint` - Run ESLint
  - `npm run web` - Build test (starts web server to verify build works)

### 3. Server CI (`server.yml`)
- **Trigger**: Changes to `server/**` files  
- **Commands**:
  - `yarn install` - Install dependencies (10min timeout)
  - `npm run ci` - Run lint + coverage (as defined in package.json)
  - `npm run build` - Build the application

## Available Scripts

### Client (client/package.json)
```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android", 
  "ios": "expo start --ios",
  "web": "expo start --web",
  "lint": "eslint . --ext .js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix"
}
```

### Server (server/package.json)
```json
"scripts": {
  "start": "egg-scripts start --daemon --title=egg-server-portal_platform",
  "dev": "egg-bin dev",
  "test": "npm run lint -- --fix && npm run test-local",
  "test-local": "egg-bin test", 
  "cov": "egg-bin cov",
  "lint": "eslint .",
  "ci": "npm run lint && npm run cov",
  "build": "APP_ROOT=$PWD/app/view umi build"
}
```

## Running Locally

### Client
```bash
cd client
yarn install
npm run lint                                    # linting
npm run web                                     # build test (starts web server)
```

### Server  
```bash
cd server
yarn install
npm run ci      # lint + coverage
npm run build   # build application
```

The CI workflows only use commands that exist in the respective package.json files.