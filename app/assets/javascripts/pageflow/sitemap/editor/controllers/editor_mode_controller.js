pageflow.sitemap.EditorModeController = pageflow.sitemap.AbstractController.extend({
  name: 'editor_mode',

  initialize: function() {
    this.selection = new pageflow.sitemap.Selection();

    new pageflow.sitemap.SelectionNavigator({
      selection: this.selection,
      multiSelectionPath: '/'
    }).attach();
  },

  chapterSelected: function (chapter, event) {
    if (!this.selection.contains(chapter)) {
      this.selection.select('chapters', [chapter], {
        additive: event.ctrlKey
      });
    }
  },

  chaptersSelected: function (chapters) {
    this.selection.select('chapters', chapters);
  },

  pageSelected: function (page, event) {
    if (!this.selection.contains(page)) {
      this.selection.select('pages', [page], {
        additive: event.ctrlKey
      });
    }
  },

  pageLinkSelected: function (pageLink) {
    this.selection.select('pageLinks', [pageLink]);
  },

  pageLinkDroppedOnPage: function(links, link, page) {
    links.updateLink(link, page.get('perma_id'));
  },

  pageLinkPlaceholderDroppedOnPage: function(links, page) {
    links.addLink(page.get('perma_id'));
  },

  successorLinkSelected: function (link) {
    this.selection.select('successorLinks', [link]);
  },

  successorLinkDroppedOnPage: function(page, targetPage) {
    if (targetPage && targetPage !== page) {
      page.configuration.set('scroll_successor_id', targetPage.get('perma_id'));
    }
    else {
      page.configuration.unset('scroll_successor_id');
    }
  },

  chaptersPositioned: function(updates) {
    // FIXME should have batch update for chapters
    _.each(updates, function(update) {
      update.chapter.configuration.set({
        row: update.row,
        lane: update.lane
      });
    }, this);
  },

  pagesMoved: function(pagesGroupedByChapters, laneAndRow) {
    _.each(pagesGroupedByChapters, function(update) {
      var chapter = update.chapter || pageflow.entry.addChapter({configuration: laneAndRow});

      _.each(update.pages, function(page, index) {
        page.set('position', index);

        if (page.chapter !== chapter) {
          page.chapter.pages.remove(page);
          chapter.pages.add(page);
        }
      });

      chapter.pages.sort();

      whenSaved(chapter, function() {
        chapter.pages.saveOrder();
      });
    });

    function whenSaved(chapter, fn) {
      if (chapter.isNew()) {
        chapter.once('sync', fn);
      }
      else {
        fn();
      }
    }
  },

  addPage: function (chapter) {
    chapter.addPage();
  },

  insertPageAfter: function (targetPage) {
    var chapter = targetPage.chapter;
    var delta = 0;

    chapter.pages.each(function(page, index) {
      page.set('position', index + delta);

      if (page === targetPage) {
        delta = 1;
      }
    });

    var newPage = chapter.addPage({
      position: targetPage.get('position') + 1
    });

    chapter.pages.sort();
    chapter.pages.saveOrder();
  },

  addChapter: function(configuration) {
    var chapter = pageflow.entry.addChapter({configuration: configuration});

    chapter.once('sync', function() {
      chapter.addPage();
    });
  },

  addUpdateHandler: function (handler) {
    var that = this;

    handler(pageflow.entry, this.selection);

    pageflow.chapters.on('add remove change:configuration', function() {
      handler(pageflow.entry, that.selection);
    });

    pageflow.pages.on('add remove change:configuration', function() {
      handler(pageflow.entry, that.selection);
    });

    this.selection.on('change', function() {
      handler(pageflow.entry, that.selection);
    });
  }
});
