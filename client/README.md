## Nimble FC Challenge
> Client Part
> Author: Tempest (tar118@pitt.edu)
> Website: https://blog.epicanecdotes.games/

The client part of Nimble FC Challenge based on React Native

## Dependencies Installs
`yarn install`

## Launch a iOS app
Require: Mac OS
Open a iOS simulator first: `open -a simulator`
If you don't have a simulator, install one before launch.
After open the simulator, run this command to launch the app on your simulator
`yarn ios`

## Launch an Android app
Require: Android Simulator
`yarn android`

## Run Web Version
`yarn web`


## Components Library
[react-native-paper](https://callstack.github.io/react-native-paper/getting-started.html)

## Router

[react-navigation v6.x](https://reactnavigation.org/docs/getting-started)

## Components Props Types

[PropTypes](https://www.npmjs.com/package/prop-types)

## Component State Manager

[Redux](https://redux.js.org/introduction/getting-started)

## Async Storage
> An equivalent of Local Storage from the web

[React Async Storage](https://react-native-async-storage.github.io/async-storage/docs/install/)

Total storage size is capped at 6 MB by default, Per-entry is limited by a size of a WindowCursor, a buffer used to read data from SQLite. Currently it's size is around 2 MB.

If you want to handle larger size, see documents about multiGet/multiSet

Use it for:
- Persisting non-sensitive data across app runs
- Persisting Redux state
- Persisting GraphQL state
- Storing global app-wide variables

Do not use it for:
- Token storage
- Secrets

## Secure Storages

[expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)

On iOS, it uses the keychain services, and on Android, it uses the SharedPreferences.

Size limit for a value is 2048 bytes, it won't work for web.

## Linter
ESlint & Prettier

[How to set up?](https://three29.com/set-up-eslint-and-prettier-for-react-native-projects/)

## Debug Tips

On iOS simulator, use `CTRL+Command+Z` to invoke debug panel.