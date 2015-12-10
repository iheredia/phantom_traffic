window.Sputnik = {
  loadTemplate: (templatePath) ->
    template = undefined
    $.ajax(
      method: 'GET'
      url: "/static/jst/#{templatePath}.jst"
      async: false
      success: (response) ->
        template = _.template(response)
    )
    template
}

class Sputnik.App extends Backbone.View

  initialize: ->
    @login = new Sputnik.Login
    @login.bind('userSignedIn', @userSignedIn)

    @disclaimer = new Sputnik.Disclaimer
    @header = new Sputnik.Header
    @mainMenu = new Sputnik.MainMenu

  userSignedIn: (user) =>
    Sputnik.user = user
    @renderMainApp()

  renderLogin: ->
    @$el.html('')

    @login.render()
    @disclaimer.render()

    @$el.append(@login.el)
    @$el.append(@disclaimer.el)

  renderMainApp: ->
    @$el.html('')

    @header.render()
    @mainMenu.render()
    @disclaimer.render()

    @$el.append(@header.el)
    @$el.append(@mainMenu.el)
    @$el.append(@disclaimer.el)