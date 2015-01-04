# Gabriel

> Gabriel matches job-seekers with startup jobs on AngelList. Gabriel greatly simplifies the job searching process by allowing you to apply to jobs on AngelList with a simple Tinder-like user interface.

## Team

  - __Product Owner__: Sarah Wesley
  - __Scrum Master__: Ervin Chow
  - __Development Team Members__: Alex Hawkins, Kingsten Banh

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> Gabriel is in currently in alpha. Which means that it is still in development but it is usable and contains basic features. Use at your own risk!

## Requirements

- RequireJS 2.1.15
- Almond 0.2.9
- Famous-polyfills 0.3.0
- Famous 0.3.4
- Grunt 0.4.4


## Development

### Installing Dependencies
```
cd www
npm install && bower install
grunt serve
```
###Add Android Device
```
cordova platforms add android
cordova plugin add org.apache.cordova.device
cordova run android -d
```
###Add iOS Device
iOS instructions assume the use of Mac OS X

```
cordova platforms add ios
cordova plugin add org.apache.cordova.device
cordova build ios -d
```

If you encounter ios-sim was not found. Run the following
```
npm install -g ios-sim
```

To emulate the app as iOS app, run the following command line
```
cordova emulate ios
```

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
