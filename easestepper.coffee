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
  constructor: ->
    console.log 'foo'

window.EaseStepperNs = ns
window.EaseStepper = EaseStepper
