/**
 * @file elSelect.js
 * @downloaded from http://www.cult-f.net/2007/12/14/elselect/
 * @author Sergey Korzhov aka elPas0
 * @site  http://www.cult-f.net
 * @date December 14, 2007
 *
 */
var SelectBox = new Class({
    Implements:[Options, Events],

    options:{
        targetId:'', // where to place the selector
        selectorId:'',
        selectorName:'', // <select name='?' />

        selectorClass:'SelectBox'
    },

    json_data:null,
    selector:null,

    selected:null, // holds the reference to the selected option
    selectedOption:null, //holds the value of current selected otption
    dropDown:null, // the dropdwon arrow
    optionsContainer:null, // the div holds list of options
    current:null, // current displaying option

    hiddenInput:null,
    /*
     pass the options,
     create html and inject into container
     */
    initialize:function (options, data) {
        this.setOptions(options)
        this.json_data = data;
        this._createElements();
    },


    _createElements:function () {
        if ($(this.options.targetId)) {

            this.selected = null;
            this._buildingSelectBox();
            if (this.json_data.data) {
                this._buildingOptions(this.json_data.data);
            }
            this._bindEvents();
        }
        else {
            console.error("Can not create selector as the targeted container div '" + this.options.targetId + "' does not exists!");
        }
    },

    _buildingSelectBox:function () {
        this.selector = new Element('div', {
            'id':this.options.selectorId
        }).addClass(this.options.selectorClass);
        this.current = new Element('div').addClass('selected').inject($(this.selector));
        this.selectedOption = new Element('div').addClass('selectedOption').inject($(this.current));
        this.dropDown = new Element('div').addClass('dropDown').inject($(this.current));
        new Element('div').addClass('clear').inject($(this.selector));
        this.optionsContainer = new Element('div').addClass('optionsContainer').inject($(this.selector));
        var t = new Element('div').addClass('optionsContainerTop').inject($(this.optionsContainer));
        var t = new Element('div').addClass('optionsContainerBottom').inject($(this.optionsContainer));


        $(this.options.targetId).grab(this.selector);
        this.hiddenInput = new Element('input').setProperties({
            type:'hidden',
            name:this.options.selectorName
        }).inject($(this.options.selectorId));
    },

    _bindEvents:function () {
        document.addEvent('click', function () {
            if (this.optionsContainer.getStyle('display') == 'block') {
                this._onDropDown();
            }
        }.bind(this));

        $(this.options.selectorId).addEvent('click', function (e) {
            new Event(e).stop();
        });
        this.current.addEvent('click', this._onDropDown.bindWithEvent(this));

    },

    //adding select options
    _buildingOptions:function (items) {
        items.each(
            function (item) {
                var o = new Element('div').addClass('option').setProperty('value', item[0]);// set up the value

                o.set('text', item[1]); // set up text

                o.addEvents({
                    'click':this._onOptionClick.bindWithEvent(this),
                    'mouseout':this._onOptionMouseout.bindWithEvent(this),
                    'mouseover':this._onOptionMouseover.bindWithEvent(this)
                });

                // if the option is selected
                if (item[2] == "0") {
                    if (this.selected) {
                        this.selected.removeClass('selected');
                    }
                    this.selected = o;
                    o.addClass('selected');
                    this.selectedOption.set('text', item[1]);
                    this.hiddenInput.setProperty('value', item[0]);
                }

                // add extra classes if there is any
                if (item[3]) {
                    o.addClass(item[3]);
                }

                // add option to the select
                o.inject($(this.optionsContainer).getLast(), 'before');
            }.bind(this));
    },

    _onDropDown:function (e) {

        if (this.optionsContainer.getStyle('display') == 'block') {
            this.optionsContainer.setStyle('display', 'none');
        } else {
            this.optionsContainer.setStyle('display', 'block');
            this.selected.addClass('selected');
            //needed to fix min-width in ie6
            var width = this.optionsContainer.getStyle('width').toInt() > this.selector.getStyle('width').toInt() ?
                this.optionsContainer.getStyle('width')
                :
                this.selector.getStyle('width');

            this.optionsContainer.setStyle('width', width);
            this.optionsContainer.getFirst().setStyle('width', width);
            this.optionsContainer.getLast().setStyle('width', width);
        }
    },
    _onOptionClick:function (e) {
        var event = new Event(e);
        if (this.selected != event.target) {
            this.selected.removeClass('selected');
            event.target.addClass('selected');
            this.selected = event.target;
            this.selectedOption.set('text', this.selected.get('text'));
            this.hiddenInput.setProperty('value', this.selected.getProperty('value'));
        }
        this._onDropDown();
    },
    _onOptionMouseover:function (e) {
        var event = new Event(e);
        this.selected.removeClass('selected');
        event.target.addClass('selected');
    },
    _onOptionMouseout:function (e) {
        var event = new Event(e);
        event.target.removeClass('selected');
    }

});
