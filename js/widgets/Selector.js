var Selector = new Class({
    Implements:[Options, Events],

    options:{
        targetId:'', // where to place the selector
        selectorClass:'selector',
        selectorId:'',
        isMultiple:false,
        size:'' // integer, only applies when isMultiple equals to true
    },

    json_data:null,
    selector:null,
    items:null,


    initialize:function (options, data) {
        this.setOptions(options);
        this.json_data = data;

        this._render();

    },

    _render:function () {
        this._createElements();

    },

    _createElements:function () {
        if ($(this.options.targetId)) {
            this._createSelector();
        }
        else {
            console.error("Can not create selector as the targeted container div '" + this.options.targetId + "' does not exists!");
        }
    },

    _createSelector:function () {
        this.selector = new Element('select', {
            'id':this.options.selectorId,
            'class':this.options.selectorClass
        });
        $(this.options.targetId).grab(this.selector);

        if (this.options.isMultiple) {
            this.selector.set('multiple','');
            this.selector.set('size', this.options.size);
        }

        var data_list = this.json_data.data;
        if (data_list) {
            data_list.each(
                function (item) {
                    var opt = new Element('option',
                        {
                            'value':item[0],
                            'text':item[1]
                        });
                    if (item[2] == "0") {
                        opt.set('selected','selected');
                    }
                    if (item[3]) {
                        opt.set('class', item[3]);
                    }
                    this.selector.grab(opt);
                }.bind(this));
        }
    }


});

