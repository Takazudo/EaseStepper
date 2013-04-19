(function() {

  // draws graph for easing

  var Graph = function(options) {

    this.options = options;
    var src = '<canvas width="' + options.width + '" height="' + options.height + '" class="graph"></canvas>';

    this.$el = $(src);
    this.el = this.$el[0];

    $(options.appendTo).append(this.$el);

    var p = this._paper = new paper.PaperScope;
    p.project = new p.Project;
    p.view = new p.View(this.el);

    this._circles = [];

    p.view.draw();

  };
  Graph.prototype.startDrawing = function() {
    var p = this._paper;
    var h = this.options.height;
    var path = new p.Path;
    path.strokeColor = 'black';
    //var point = new p.Point(0, h);
    //path.add(point);
    path.strokeWidth = 1;
    this._path = path;
    return this;
  };
  Graph.prototype.addPoint = function(x, y) {

    var o = this.options;
    var p = this._paper;

    // calc x and y of the point
    var point_x = o.width * x;
    var point_y = o.height * (1 - y);
    var point = new p.Point(point_x, point_y);

    // add point to the current path
    this._path.add(point);

    // create point circle
    var circle = new p.Path.Circle(point, 2);
    circle.strokeColor = 'black';
    circle.fillColor = 'black';
    circle.strokeWidth = 0;
    this._circles.push(circle);

    p.view.draw();
    return this;
  };
  Graph.prototype.endDrawing = function() {
    var p = this._paper;
    var o = this.options;
    //var point = new p.Point(o.width, 0);
    //this._path.add(point);
    p.view.draw();
    return this;
  };
  Graph.prototype.clear = function() {
    if(this._path) {
      this._path.remove();
    }
    $.each( this._circles, function(i, circle) {
      circle.remove();
    });
    if(this._lines) {
      $.each( this._lines, function(i, line) {
        line.remove();
      });
    }
    this._paper.view.draw();
    return this;
  };
  Graph.prototype.createLine = function(color, lineOptions) {
    if(!this._lines) {
      this._lines = [];
    }
    var line = new Graph.Line(this._paper, color, this.options, lineOptions);
    this._lines.push(line);
    return line;
  };

  // Line

  Graph.Line = function(paper, color, graphOptions, lineOptions) {
    this.options = graphOptions;
    this.lineOptions = lineOptions;
    this.color = color;
    var p = this._paper = paper;
    var path = new p.Path;
    path.strokeColor = color;
    path.strokeWidth = 1;
    this._path = path;
    this._circles = [];
  };
  Graph.Line.prototype.addPoint = function(x, y) {
    var o = this.options;
    var p = this._paper;

    // calc x and y of the point
    var point_x = o.width * x;
    var point_y = o.height * (1 - y);
    var point = new p.Point(point_x, point_y);

    // add point to the current path
    if(this._path) {
      this._path.add(point);
    }

    if(this.lineOptions && this.lineOptions.showDots) {
      var circle = new p.Path.Circle(point, 2);
      circle.strokeColor = this.color;
      circle.fillColor = this.color;
      circle.strokeWidth = 0;
      this._circles.push(circle);
    }

    p.view.draw();
    return this;
  };
  Graph.Line.prototype.remove = function() {
    if(this._path) {
      this._path.remove();
      this._path = null;
    }
    $.each( this._circles, function(i, circle) {
      circle.remove();
    });
    this._circles = [];
    this._paper.view.draw();
    return this;
  };


  window.Graph = Graph; // globalify

}());
