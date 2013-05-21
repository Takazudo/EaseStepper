ns = {}

# ============================================================
# event module

class ns.Event

  on: (ev, callback) ->
    @_callbacks = {} unless @_callbacks?
    evs = ev.split(' ')
    for name in evs
      @_callbacks[name] or= []
      @_callbacks[name].push(callback)
    return this

  once: (ev, callback) ->
    @on ev, ->
      @off(ev, arguments.callee)
      callback.apply(@, arguments)
    return this

  trigger: (args...) ->
    ev = args.shift()
    list = @_callbacks?[ev]
    return unless list
    for callback in list
      if callback.apply(@, args) is false
        break
    return this

  off: (ev, callback) ->
    unless ev
      @_callbacks = {}
      return this

    list = @_callbacks?[ev]
    return this unless list

    unless callback
      delete @_callbacks[ev]
      return this

    for cb, i in list when cb is callback
      list = list.slice()
      list.splice(i, 1)
      @_callbacks[ev] = list
      break

    return this

# ============================================================
# EaseStepper

class EaseStepper extends ns.Event

  # options:
  #   interval
  #   easing
  #   duration
  #   valueInChange
  #   done
  #   beginningValue
  #   endValue
  constructor: (@options) ->

    @_tweakOptions()
    @_whileEasing = false
    @_stopRequested = false

  _tweakOptions: ->

    o = @options

    unless o.interval
      o.interval = 13

    if o.done
      @done o.done

    unless o.beginningValue
      o.beginningValue = 0

    unless o.valueInChange
      o.valueInChange = o.endValue - o.beginningValue

    return this

  _triggerEvent: (name, elapsedTimeRate, valueChangeRate, value) ->

    @_currentData = 
      elapsedTimeRate: elapsedTimeRate
      valueChangeRate: valueChangeRate
      value: value + @options.beginningValue

    @trigger name, @_currentData
    return this

  start: ->
    
    o = @options

    @_triggerEvent 'start', 0, 0, 0
    elapsedTime = 0
    currentVal = 0
    @_whileEasing = true
    @_timerId = null

    tick = =>

      return if @_stopRequested is true

      if elapsedTime >= o.duration

        @_whileEasing = false
        @_triggerEvent 'end', 1, 1, o.valueInChange
        @_clearTimer()
        return

      elapsedTimeRate = elapsedTime / o.duration
      valueChangeRate = o.easing elapsedTimeRate, elapsedTime, 0, 1, o.duration
      currentVal = o.valueInChange * valueChangeRate

      @_triggerEvent 'step', elapsedTimeRate, valueChangeRate, currentVal

      elapsedTime += o.interval

    @_timerId = setInterval tick, o.interval

    return this

  _clearTimer: ->
    if @_timerId
      clearInterval @_timerId
      @_timerId = null
    return this

  stop: ->
    return false if @_whileEasing is false
    @_clearTimer()
    @_stopRequested = true
    @_triggerEvent 'stop', @_currentData
    return this

  done: (fn) ->
    @on 'end', =>
      fn(this)
    return this

window.EaseStepperNs = ns
window.EaseStepper = EaseStepper
