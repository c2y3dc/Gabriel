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
###### If no WWW folder

```
npm install && bower install
grunt -f
```
######ELSE
```
cd www
npm install && bower install
grunt serve

```
Make sure the bottom of main.js looks like this when serving to a browser
```
if (window.cordova)
    document.addEventListener('deviceready', start, false);
else{
    //document.addEventListener('DOMContentLoaded', start)
    require('../lib/oauth-js/dist/oauth.min.js');
    start();  
}
````

###Add Android Device
```
cordova platforms add android
cordova plugin add org.apache.cordova.device
cordova plugin add org.apache.cordova.console
cordova plugin add https://github.com/oauth-io/oauth-phonegap
cordova run android -d
```
###Add iOS Device
iOS instructions assume the use of Mac OS X

```
cordova platform add ios
cordova plugin add org.apache.cordova.device
cordova plugin add org.apache.cordova.console
cordova plugin add https://github.com/oauth-io/oauth-phonegap
cordova build ios -d
```

If you encounter ios-sim was not found. Run the following
```
npm install -g ios-sim
```

To emulate the app as an iOS app, run the following command line
```
cordova emulate ios
```

####To build and run on an iPhone
```
cordova run ios -d
```

####To rebuild for iPhone after changes have been made
```
grunt -f
cordova run ios -d
```

####Note about deploying to mobile
Make sure the bottom of main.js looks like this when deploying to mobile
```
if (window.cordova)
    document.addEventListener('deviceready', start, false);
else{
    document.addEventListener('DOMContentLoaded', start)
    //require('../lib/oauth-js/dist/oauth.min.js');
    //start();  
}
```

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.