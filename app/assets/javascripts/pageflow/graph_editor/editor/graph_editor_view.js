/*global graphEditor, Backbone, pageflow, data*/

graphEditor.GraphEditorView = Backbone.Marionette.ItemView.extend({
  className: 'container',
  template: 'pageflow/graph_editor/editor/templates/graph',

  initialize: function(options) {
    this.data = options.data;
    this.controller = new graphEditor.EditorModeController(options.data);
  },

  events: {
    "click .close.button": function() {
      this.hide();
    }
  },

  onRender: function() {
    var svgElement = this.$el.find('svg')[0];
    new graphEditor.GraphView(svgElement, this.controller);

    pageflow.app.on('resize', graphEditor.pan.resize);
    setTimeout(graphEditor.pan.resize, 250);
  },

  hide: function () {
    this.$el.hide();
  },

  show: function () {
    this.$el.show();
  }
});
