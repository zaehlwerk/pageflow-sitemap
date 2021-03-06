/*globals _, sitemap, pageflow */

sitemap.AbstractController = pageflow.Object.extend({
  lineSelected: function (line, event) {},

  storylineSelected: function (storyline, event) {},

  storylinesSelected: function (storylines) {},

  chapterSelected: function (chapter, event) {},

  pageSelected: function (page, event) {},

  pageDblClick: function (page, event) {},

  pageLinkSelected: function (pageLink) {},

  pageLinkDroppedOnPage: function(links, link, page) {},

  newPageLinkDroppedOnPage: function(links, page) {},

  pageLinkDroppedOnPlaceholder: function(sourcePage, links, link, laneAndRow) {},

  newPageLinkDroppedOnPlaceholder: function(sourcePage, links, laneAndRow) {},

  successorLinkSelected: function (link) {},

  successorLinkDroppedOnPage: function(page, targetPage) {},

  successorLinkDroppedOnPlaceholder: function(page, laneAndRow) {},

  storylinesPositioned: function(updates) {},

  pagesMoved: function(pagesGroupedByChapters) {},

  addPage: function (chapter) {},

  insertPageAfter: function (page) {},

  addChapter: function(storyline, configuration) {},

  insertChapterAfter: function(targetChapter) {},

  chaptersMoved: function(chaptersGroupedByStorylines) {},

  addStoryline: function(configuration) {},

  addUpdateHandler: function (handler) {
    var timeout;

    this.addDebouncedUpdateHandler(function(/* args */) {
      var args = arguments;

      timeout = timeout || setTimeout(function() {
        timeout = null;
        handler.apply(this, args);
      }, 1);
    });
  },

  addDebouncedUpdateHandler: function(handler) {},

  dispose: function() {
    this.stopListening();
  }
});

_.extend(sitemap.AbstractController, Backbone.Events);