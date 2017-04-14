Gamification.js
===============
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![MIT](https://img.shields.io/dub/l/vibe-d.svg)](https://github.com/alexprut/Gamification.js/blob/master/LICENSE)

A simple Gamification framework for the front-end

## Install
```
bower install gamification.js --save
```

## Usage
```javascript
var gamification = new Gamification()
gamification.addBreakpoint(new gamification.Breakpoint(100, function () {
    // callback function
}))

gamification.addMission(new gamification.ScrollMission(15, '#example'))
gamification.addMission(new gamification.ClickMission(5, '#example button'))
gamification.addMission(new gamification.TimeMission(5, 10000))
gamification.addComponent(new gamification.ProgressBar(100, function () {
    // callback function
}))
```

##  License
Licensed under [MIT](https://github.com/alexprut/Gamification.js/blob/master/LICENSE).
