# GitHub CI/CD Setup

This repository uses GitHub Actions for continuous integration and deployment. The CI setup ensures both the React Native client and Egg.js server build successfully.

## 🚀 Workflows Overview

### 1. Full Stack CI (`ci.yml`)
- **Trigger**: Every push/PR to main/master branches
- **Purpose**: Orchestrates all CI processes with smart path filtering
- **Features**:
  - Only runs relevant jobs based on changed files
  - Security audits for both client and server
  - Dependency checks
  - Comprehensive summary reporting

### 2. Client CI (`client.yml`)
- **Trigger**: Changes to `client/**` files
- **Purpose**: React Native/Expo app validation
- **Jobs**:
  - **Lint & Web Build**: ESLint validation and web export
  - **Android Build**: APK generation with Android SDK
  - **iOS Build**: iOS app build on macOS runners
- **Technologies**: Expo CLI, Node.js 18, Android SDK, Xcode

### 3. Server CI (`server.yml`)
- **Trigger**: Changes to `server/**` files
- **Purpose**: Egg.js backend validation
- **Jobs**:
  - Cross-platform testing (Ubuntu, Windows, macOS)
  - Multi-Node.js version support (16, 18, 20)
  - Code coverage reporting
- **Technologies**: Egg.js, Node.js, Codecov

## 📋 Prerequisites

### For Client (React Native/Expo)
- Node.js 18+
- Expo CLI
- Android SDK (for Android builds)
- Xcode (for iOS builds on macOS)

### For Server (Egg.js)
- Node.js 16+ (tested on 16, 18, 20)
- NPM/Yarn package manager

## 🔧 Local Development

### Client Setup
```bash
cd client
npm ci
npm run lint          # Code linting
npm run start          # Start Expo dev server
npm run web            # Web development
npm run android        # Android development
npm run ios            # iOS development
```

### Server Setup
```bash
cd server
npm ci
npm run lint           # Code linting
npm run dev            # Development server
npm run test-local     # Run tests
npm run build          # Build application
npm run cov            # Coverage report
```

## 🎯 CI Job Details

### Path-Based Execution
The CI system uses path filtering to run only relevant jobs:
- Client changes trigger client builds
- Server changes trigger server builds
- Root changes trigger full stack validation

### Multi-Platform Testing
- **Server**: Tested on Ubuntu, Windows, and macOS
- **Client**: 
  - Web builds on Ubuntu
  - Android builds on Ubuntu with Android SDK
  - iOS builds on macOS with Xcode

### Security & Quality
- **Security Audits**: Automated `npm audit` for vulnerabilities
- **Dependency Checks**: Outdated package detection
- **Code Quality**: ESLint enforcement
- **Test Coverage**: Codecov integration for server

## 📊 Monitoring & Reporting

### Build Status
Check the Actions tab in GitHub for:
- ✅ Successful builds
- ❌ Failed builds with detailed logs
- 📊 Coverage reports (server only)

### Coverage Reports
Server code coverage is automatically uploaded to Codecov when:
- Running on Node.js 18
- Running on Ubuntu
- All tests pass

## 🛠️ Customization

### Adding New Platforms
To add new platforms or modify existing builds:

1. **Client**: Edit `.github/workflows/client.yml`
2. **Server**: Edit `.github/workflows/server.yml`
3. **Overall**: Edit `.github/workflows/ci.yml`

### Environment Variables
Configure these secrets in GitHub repository settings:
- `CODECOV_TOKEN`: For coverage reporting (optional)

### Build Optimization
- Dependency caching is enabled for faster builds
- Path filtering prevents unnecessary job execution
- Parallel job execution for efficiency

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are listed in package.json
   - Ensure scripts exist in package.json

2. **Android Build Issues**
   - Verify Android SDK configuration
   - Check Gradle wrapper permissions
   - Ensure proper Java version (17)

3. **iOS Build Issues**
   - macOS runner required for iOS builds
   - Xcode version compatibility
   - iOS Simulator availability

4. **Dependency Issues**
   - Run `npm audit fix` locally
   - Update outdated packages
   - Check for security vulnerabilities

## 📝 Maintenance

### Regular Tasks
- Monitor security audit results
- Update Node.js versions in CI as needed
- Review and update outdated dependencies
- Monitor build times and optimize as necessary

### Version Updates
When updating major versions:
1. Test locally first
2. Update package.json versions
3. Update CI Node.js versions if needed
4. Test CI builds thoroughly

---

For more details, check the individual workflow files in `.github/workflows/`.