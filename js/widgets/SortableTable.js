/**************************************************************

 Script        : Sortable Table
 Version        : 1.4
 Authors        : Samuel Birch
 Desc            : Sorts and filters table elements
 Licence        : Open Source MIT Licence


 Data types:
 number    123.45
 string    firstname
 date      YYYY-MM-DD, DD/MM/YY[YY], DD-MM-YY[YY]
 currency  £100.00 (any currency as long as its a single symbol)

 options
 overCls
 the name of the class added when the mouse is over the tr.
 onClick
 the name of the function to call on the onClick event.
 sortOn
 the number of the column to initially sort on (zero based).
 sortBy
 the direction of the sort (ASC / DESC) (default: ASC).
 filterHide
 whether or not to show just the results. (default: true).



 **************************************************************/
var SortableTable = new Class({
    Implements:[Options, Events],

    options:{
        tableId:'',
        tableClass:'',
        targetId:'',

        cellpadding:'0',
        cellspacing:'0',
        border:'0',

        showTableTopToolbar:true, // whether show the filter on the top of the table
        filterHide:true,
        filterHideCls:'hide',
        filterSelectedCls:'selected',


        showTableBottomToolbar:true, // whether show the filter on the bottom of the table
        pagingEnabled:true,
        pageSize:10, //default size per one page  5 , 10, 20 , 50


        onClick:false,
        sortOn:0,
        sortBy:'ASC',

        //style other widgets
        topToolbarClass: 'topToolbar',
        columnSelectClass: '',
        keywordInputClass: '',
        bottomToolbarClass: 'bottomToolbar',
        pagingSelectorClass: ''

    },

    json_data:null,


    table:null,
    tHead:null,
    tBody:null,
    tFoot:null,
    rows:null,
    rowSize:0,
    filtered:false,

    topToolbar:null,
    col_selector:null,
    searchInput:null,

    bottomToolbar:null,

    totalPagingSize:1, // stores total number of pages
    currentPageIdx:1, // the current showing page

    //last key up event
    interval:500,
    lastKeypressTime:null,

    initialize:function (options, data) {
        this.setOptions(options);
        this.json_data = data;

        this._render();

    },

    _render:function () {
        this._createElements();
        this._setupHeader();

        if (this.options.pagingEnabled) {
            this._pagingCalc();
        }
    },

    _createElements:function () {
        if ($(this.options.targetId)) {
            this.table = new Element('table', {
                'cellpadding':this.options.cellpadding,
                'cellspacing':this.options.cellspacing,
                'border':this.options.border,
                'id':this.options.tableId,
                'class':this.options.tableClass
            });

            $(this.options.targetId).grab(this.table);
            this._createTableHeader();
            this._createTableBody();
            this._createTableFooter();

            if (this.options.showTableTopToolbar) {
                this._createTopToolbar();
            }

            if (this.options.showTableBottomToolbar) {
                this._createBottomToolbar();
            }

            this.rows = this.tBody.getElements('tr');
            this.rowSize = this.rows.getChildren().length;
        }
        else {
            console.error("Can not create table as the targeted container div '" + this.options.targetId + "' does not exists!");
        }
    },

    _createTableHeader:function () {
        this.tHead = new Element('thead');
        var tr = new Element('tr');
        var data_list = this.json_data.header;
        data_list.each(
            function (item) {
                tr.grab(new Element('th',
                    {
                        'text':item.title,
                        'axis':item.data_type
                    }))
            });
        this.tHead.grab(tr);
        this.table.grab(this.tHead);
    },

    _createTableBody:function () {
        this.tBody = new Element('tbody');
        this.table.grab(this.tBody);
        var thisRef = this;
        var rows = this.json_data.data;
        var col_idx = 0;
        rows.each(function (cols) {
            var tr = new Element('tr', { 'id':col_idx}).inject(thisRef.tBody);
            col_idx++;
            cols.each(function (cell) {
                tr.grab(new Element('td', {
                    'text':cell
                }));
            });
        });
    },

    _createTableFooter:function () {
        this.tFoot = new Element('tfoot');
        var tr = new Element('tr');
        if (this.json_data.footer) {
            var data_list = this.json_data.footer;
            data_list.each(
                function (item) {
                    tr.grab(new Element('td', { 'text':item }))
                });
        }
        this.tFoot.grab(tr);
        this.table.grab(this.tFoot);
    },

    _createTopToolbar:function () {
        var thisRef = this;
        this.topToolbar = new Element('div', {
            'class': this.options.topToolbarClass
        });
        this.col_selector = new Element('select', {
            'id':'columns',
            'class': this.options.columnSelectClass
        }).addEvent("change", function (E) {
            thisRef.clearFilter();
        });
        this.topToolbar.grab(this.col_selector);
        // build up the rest of drop down items
        if (this.col_selector) {
            var col_idx = 0;
            this.tHead.getElements('th').each(function (header) {
                var head_title = header.get('text');
                thisRef.col_selector.grab(new Option(head_title, col_idx));
                col_idx++;
            });
        }
        this.searchInput = new Element('input', {
                'id':'keyword',
                'class': this.options.keywordInputClass,
                'type':'text',
                'value':'Search...'}
        ).addEvent("keyup",
            function (E) {
                //fire the search event when detect user stop typing
                thisRef.lastKeypressTime = new Date().getTime();
                var that = thisRef;
                setTimeout(function () {
                    var currentTime = new Date().getTime();
                    if (currentTime - that.lastKeypressTime > that.interval) {
                        thisRef.search(thisRef.col_selector, thisRef.searchInput);
                    }
                }, that.interval + 100);

            }).addEvent("click", function (E) {
                thisRef.searchInput.value = "";
            });
        this.topToolbar.grab(this.searchInput);
        $(this.options.targetId).grab(this.topToolbar, 'top');
    },

    _createBottomToolbar:function () {
        this.bottomToolbar = new Element('div', {
            'class':this.options.bottomToolbarClass
        });
        var thisRef = this;
        var pageNav = new Element('div', {
            'id':'pageNav'
        }).adopt([
            new Element('div', {
                'class':'page_first',
                'alt':'First Page'
            }).addEvent("click", function (E) {
                thisRef._pagingMove(0);
            }),
            new Element('div', {
                'class':'page_previous',
                'alt':'Previous Page'
            }).addEvent("click", function (E) {
                thisRef._pagingMove(-1);
            }),
            new Element('div', {
                'class':'page_next',
                'alt':'Next Page'
            }).addEvent("click", function (E) {
                thisRef._pagingMove(1);
            }),
            new Element('div', {
                'class':'page_last',
                'alt':'Last Page'
            }).addEvent("click", function (E) {
                thisRef._pagingMove(1, true);
            })
        ]);

        var pageIndex = new Element('div', {
            'id':'pageIndex',
            'text':'Page '
        }).adopt([
            new Element('span', {
                'id':'pageIndexSpan',
                'text':thisRef.currentPageIdx
            }),
            new Element('text', {
                'text':' of '
            }),
            new Element('span', {
                'id':'totalPagesSpan'
            }),
            new Element('text', {
                'text':'    (Total Records: '
            }),
            new Element('span', {
                'id':'totalRecordsFound'
            }),
            new Element('text', {
                'text':')'
            })
        ]);

        var pageSizeSelector = new Element('div', {
            'id':'pageSizeSelectorDiv'
        }).adopt([
            new Element('select',{
                'class': this.options.pagingSelectorClass
            }).addEvent("change",
                function (E) {
                    thisRef._changePagingSize(this.value);
                }).adopt([
                new Element('option', {
                    'text':'5',
                    'value':'5'
                }),
                new Element('option', {
                    'text':'10',
                    'value':'10',
                    'selected':'selected'
                }),
                new Element('option', {
                    'text':'20',
                    'value':'20'
                }),
                new Element('option', {
                    'text':'50',
                    'value':'50'
                }),
                new Element('option', {
                    'text':'100',
                    'value':'100'
                })
            ]),
            new Element('span', {
                'text':'Entries Per Page'
            })
        ]);

        this.bottomToolbar.adopt([pageNav, pageIndex, pageSizeSelector]);
        $(this.options.targetId).grab(this.bottomToolbar);
    },

    _setupHeader:function () {
        //setup header
        this.tHead.getElements('th').each(function (el, i) {
            if (el.axis) {
                el.addEvent('click', this.sort.bind(this, i));
                el.addEvent('mouseover', function () {
                    el.addClass('tableHeaderOver');
                });
                el.addEvent('mouseout', function () {
                    el.removeClass('tableHeaderOver');
                });
                el.getdate = function (str) {
                    // inner util function to convert 2-digit years to 4
                    function fixYear(yr) {
                        yr = +yr;
                        if (yr < 50) {
                            yr += 2000;
                        }
                        else if (yr < 100) {
                            yr += 1900;
                        }
                        return yr;
                    }

                    var ret;
                    //
                    if (str.length > 12) {
                        strtime = str.substring(str.lastIndexOf(' ') + 1);
                        strtime = strtime.substring(0, 2) + strtime.substr(-2)
                    } else {
                        strtime = '0000';
                    }
                    //
                    // YYYY-MM-DD
                    if (ret = str.match(/(\d{2,4})-(\d{1,2})-(\d{1,2})/)) {
                        return (fixYear(ret[1]) * 10000) + (ret[2] * 100) + (+ret[3]) + strtime;
                    }
                    // DD/MM/YY[YY] or DD-MM-YY[YY]
                    if (ret = str.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})/)) {
                        return (fixYear(ret[3]) * 10000) + (ret[2] * 100) + (+ret[1]) + strtime;
                    }
                    return 999999990000; // So non-parsed dates will be last, not first
                };
                //
                el.findData = function (elem) {
                    var child = elem.getFirst();
                    if (child) {
                        return el.findData(child);
                    } else {
                        return elem.innerHTML.trim();
                    }
                };
                //
                el.compare = function (a, b) {
                    var1 = el.findData(a.getChildren()[i]);
                    var2 = el.findData(b.getChildren()[i]);
                    //var1 = a.getChildren()[i].firstChild.data;
                    //var2 = b.getChildren()[i].firstChild.data;

                    if (el.axis == 'number') {
                        var1 = parseFloat(var1);
                        var2 = parseFloat(var2);

                        if (el.sortBy == 'ASC') {
                            return var1 - var2;
                        } else {
                            return var2 - var1;
                        }

                    } else if (el.axis == 'string') {
                        var1 = var1.toUpperCase();
                        var2 = var2.toUpperCase();

                        if (var1 == var2) {
                            return 0;
                        }

                        if (el.sortBy == 'ASC') {
                            if (var1 < var2) {
                                return -1;
                            }
                        } else {
                            if (var1 > var2) {
                                return -1;
                            }
                        }
                        return 1;

                    } else if (el.axis == 'date') {
                        var1 = parseFloat(el.getdate(var1));
                        var2 = parseFloat(el.getdate(var2));

                        if (el.sortBy == 'ASC') {
                            return var1 - var2;
                        } else {
                            return var2 - var1;
                        }

                    } else if (el.axis == 'currency') {
                        var1 = parseFloat(var1.substr(1).replace(',', ''));
                        var2 = parseFloat(var2.substr(1).replace(',', ''));

                        if (el.sortBy == 'ASC') {
                            return var1 - var2;
                        } else {
                            return var2 - var1;
                        }

                    }

                }

                if (i == this.options.sortOn) {
                    el.fireEvent('click');
                }
            }
        }, this);
    },

    sort:function (index) {
        if (this.options.onStart) {
            this.fireEvent('onStart');
        }
        //
        this.options.sortOn = index;
        var header = this.tHead.getElements('th');
        var el = header[index];

        header.each(function (e, i) {
            if (i != index) {
                e.removeClass('sortedASC');
                e.removeClass('sortedDESC');
            }
        });

        if (el.hasClass('sortedASC')) {
            el.removeClass('sortedASC');
            el.addClass('sortedDESC');
            el.sortBy = 'DESC';
        } else if (el.hasClass('sortedDESC')) {
            el.removeClass('sortedDESC');
            el.addClass('sortedASC');
            el.sortBy = 'ASC';
        } else {
            if (this.options.sortBy == 'ASC') {
                el.addClass('sortedASC');
                el.sortBy = 'ASC';
            } else if (this.options.sortBy == 'DESC') {
                el.addClass('sortedDESC');
                el.sortBy = 'DESC';
            }
        }
        this.rows.sort(el.compare);
        this.rows.inject(this.tBody);
        if (this.options.onComplete) {
            this.fireEvent('onComplete');
        }

        this._pagingCalc();
    },

    filter:function (form) {
        var form = $(form);
        var col = 0;
        var key = '';

        form.getChildren().each(function (el, i) {
            if (el.id == 'column') {
                col = Number(el.value);
            }
            if (el.id == 'keyword') {
                key = el.value.toLowerCase();
            }
            if (el.type == 'reset') {
                el.addEvent('click', this.clearFilter.bind(this));
            }
        }, this);

        if (key) {
            this.rows.each(function (el, i) {
                if (this.options.filterHide) {
                    el.removeClass('altRow');
                }
                if (el.getChildren()[col].firstChild.data.toLowerCase().indexOf(key) > -1) {
                    el.addClass(this.options.filterSelectedCls);
                    if (this.options.filterHide) {
                        el.removeClass(this.options.filterHideCls);
                    }
                } else {
                    el.removeClass(this.options.filterSelectedCls);
                    if (this.options.filterHide) {
                        el.addClass(this.options.filterHideCls);
                    }
                }
            }, this);
            if (this.options.filterHide) {
                this.filtered = true;
            }
        }
    },

    search:function (col_selecor, inputBox) {
        var col = Number(col_selecor.value)
        var key = inputBox.value.toLowerCase();

        if (key) {
            this.rows.each(function (el, i) {
                if (this.options.filterHide) {
                    el.removeClass('altRow');
                }
                if (el.getChildren()[col].firstChild.data.toLowerCase().indexOf(key) > -1) {
                    el.addClass(this.options.filterSelectedCls);
                    if (this.options.filterHide) {
                        el.removeClass(this.options.filterHideCls);
                    }
                } else {
                    el.removeClass(this.options.filterSelectedCls);
                    if (this.options.filterHide) {
                        el.addClass(this.options.filterHideCls);
                    }
                }
            }, this);
            if (this.options.filterHide) {
                //this.filteredAltRow();
                this.filtered = true;
            }
        } else {
            this.clearFilter();
        }

        this._applyAltRow();
    },

    clearFilter:function () {
        this.rows.each(function (el, i) {
            el.removeClass(this.options.filterSelectedCls);
            if (this.options.filterHide) {
                el.removeClass(this.options.filterHideCls);
            }
        }, this);
        if (this.options.filterHide) {
            this.filtered = false;
        }
        if (this.searchInput) {
            this.searchInput.value = "Search...";
        }

        this._pagingShow();
    },

    _pagingCalc:function () {
        this.totalPagingSize = Math.ceil(this.rowSize / parseInt(this.options.pageSize));
        this.currentPageIdx = 1; // set it back to the first page

        this._pagingShow();
    },

    _pagingMove:function (index, gotoEnd) {
        if (gotoEnd) {
            // go to the last page
            this.currentPageIdx = this.totalPagingSize;
        } else {
            if (index == -1) {
                this.currentPageIdx--
            } else if (index == 1) {
                this.currentPageIdx++
            } else if (index == 0) {
                this.currentPageIdx = 1;
            }

            if (this.currentPageIdx == 0) {
                this.currentPageIdx = 1;
            }

            if (this.currentPageIdx > this.totalPagingSize) {
                this.currentPageIdx = this.totalPagingSize;
            }
        }
        this._pagingShow();
    },

    _pagingShow:function () {
        // update page index span
        $$('#pageIndexSpan').set('text', this.currentPageIdx);
        $$('#totalPagesSpan').set('text', this.totalPagingSize);
        $$('#totalRecordsFound').set('text', this.rowSize);


        var startIdx = (this.currentPageIdx - 1) * this.options.pageSize;
        var endIdx = this.currentPageIdx * this.options.pageSize;
        if (endIdx >= this.rowSize) {
            endIdx = this.rowSize - 1;
        }

        this.rows.addClass('hide');
        for (var idx = startIdx; idx < endIdx; idx++) {
            this.rows[idx].removeClass('hide');
        }

        this._applyAltRow();
    },

    _applyAltRow:function () {
        var isEven = false
        this.rows.each(function (row) {
            row.removeClass('even');
            if (!row.hasClass('hide')) {
                if (isEven) {
                    row.addClass('even');
                    isEven = false;
                } else {
                    isEven = true;
                }
            }
        });
    },

    _changePagingSize:function (new_size) {
        this.options.pageSize = new_size;
        this._pagingCalc();
    }

});

