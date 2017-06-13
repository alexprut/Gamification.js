function Gamification () {
  var _points = 0
  var _breakpoints = []
  var _missions = []
  var _components = []

  function _addComponent (component) {
    if (component instanceof ProgressBar) {
      _components.push(component)
      component.start()
    } else {
      throw new Error('component must be instance of ProgressBar')
    }
  }

  function _addMission (mission) {
    if (mission instanceof Mission) {
      _missions.push(mission)
      mission.start()
    } else {
      throw new Error('mission must be instance of Mission')
    }

    return mission.id
  }

  function _addBreakpoint (breakpoint) {
    if (breakpoint instanceof Breakpoint) {
      _breakpoints.push(breakpoint)
    } else {
      throw new Error('breakpoint must be instance of Breakpoint')
    }
  }

  function _addPoints (points) {
    _points += points

    // Notify Breakpoints
    for (var i = 0, length = _breakpoints.length; i < length; i++) {
      if (((_points - points) < _breakpoints[i].pointsThreshold) &&
        (_breakpoints[i].pointsThreshold <= (_points))) {
        _breakpoints[i].action()
      }
    }

    // Notify Components
    for (var i = 0, length = _components.length; i < length; i++) {
      _components[i].update()
    }
  }

  function _achieveMission (id) {
    for (var i = 0, lenght = _missions.length; i < lenght; i++) {
      if (_missions[i].id === id) {
        _addPoints(_missions[i].points)
        break
      }
    }
  }

  function Mission (points, callback) {
    this.points = points || 0
    this.callback = callback || function () {}
    this.id = Math.floor(Math.random() * 100000 * Math.random())
  }

  Mission.prototype.setPoints = function (points) {
    this.points = points
  }
  Mission.prototype.start = function () {
  }
  Mission.prototype.achieveMission = function () {
    _achieveMission(this.id)
    this.callback()
  }

  function CustomMission (points, startFunc, callback) {
    Mission.call(this, points, callback)
    this.startFunc = startFunc || function () {}
  }

  CustomMission.prototype = Object.create(Mission.prototype)
  CustomMission.prototype.constructor = CustomMission
  CustomMission.prototype.start = function () {
    this.startFunc()
  }

  function ClickMission (points, element, callback) {
    Mission.call(this, points, callback)
    this.element = element
  }

  ClickMission.prototype = Object.create(Mission.prototype)
  ClickMission.prototype.constructor = ClickMission
  ClickMission.prototype.start = function () {
    $(this.element).on('click.gamification' + this.id, null, {missionObj: this}, function (e) {
      $(this).off('click.gamification' + e.data.missionId)

      var missionObj = e.data.missionObj
      missionObj.achieveMission()
    })
  }

  function ScrollMission (points, element, callback) {
    Mission.call(this, points, callback)
    this.element = element
  }

  ScrollMission.prototype = Object.create(Mission.prototype)
  ScrollMission.prototype.constructor = ScrollMission
  ScrollMission.prototype.start = function () {
    $(window).on('scroll.gamification' + this.id, null, {missionObj: this}, function (e) {
      var missionObj = e.data.missionObj
      if (window.pageYOffset > ($(missionObj.element).offset().top - window.pageYOffset / 2)) {
        $(this).off('scroll.gamification' + missionObj.id)

        missionObj.achieveMission()
      }
    })
  }

  function Breakpoint (pointsThreshold, action) {
    this.pointsThreshold = pointsThreshold
    this.actionFunc = action || function () {}
  }

  Breakpoint.prototype.action = function () {
    this.actionFunc()
  }

  function TimeMission (points, msTime, callback) {
    Mission.call(this, points, callback)
    this.msTime = msTime
  }

  TimeMission.prototype = Object.create(Mission.prototype)
  TimeMission.prototype.constructor = TimeMission
  TimeMission.prototype.start = function () {
    setTimeout(function (missionObj) {
      missionObj.achieveMission()
    }, this.msTime, this)
  }

  function ProgressBarComponent (maxPoints, update, start) {
    this.maxPoints = maxPoints || 0
    this.updateFunc = update || function () {}
    this.startFunc = start || function () {}
    this.isFull = false
  }

  // TODO: Create a Component parent Class
  ProgressBarComponent.prototype.update = function () {
    if (!this.isFull) {
      this.updateFunc()

      if (this.maxPoints <= _points) {
        this.isFull = true
      }
    }
  }
  ProgressBarComponent.prototype.start = function () {
    this.startFunc()
  }
  ProgressBarComponent.prototype.getProgress = function () {
    return Math.min(Math.max(Math.ceil(100 * _points / this.maxPoints), 0), 100)
  }

  return {
    achieveMission: _achieveMission,
    addMission: _addMission,
    addComponent: _addComponent,
    addBreakpoint: _addBreakpoint,
    CustomMission: CustomMission,
    ClickMission: ClickMission,
    ScrollMission: ScrollMission,
    TimeMission: TimeMission,
    Breakpoint: Breakpoint,
    ProgressBarComponent: ProgressBarComponent
  }
}
