/**
 * Created with RubyMine.
 * By: superrunt
 * Date: 5/8/14
 * Time: 2:40 PM
 */

// MASONRY
var transitionProp = getStyleProperty('transition');
var transitionEndEvent = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'otransitionend',
    transition: 'transitionend'
}[ transitionProp ];

$( function() {
    if ( $('.masonry-container').width() <= 535 ) { return; }

    var $container = $('.masonry').masonry({
        itemSelector: '.item',
        columnWidth: '.grid-sizer'
    });

    $container.on( 'click', '.item-content', function( event ) {

        if ( $(event.target).hasClass("post-link") ) { return; }

        var $this = $(this);

        var previousContentSize = getSize( this );
        // disable transition
        this.style[ transitionProp ] = 'none';

        if ( $this.find('div.post-summary-short').is(':visible') ) {
            $this.find('div.post-summary-long').fadeIn();
            $this.find('div.post-summary-short').fadeOut();
        } else {
            $this.find('div.post-summary-short').fadeIn();
            $this.find('div.post-summary-long').fadeOut();
        }

        // set current size
        $this.css({
            width: previousContentSize.width,
            height: previousContentSize.height
        });

        var $itemElem = $this.parent().toggleClass('is-expanded');

        // force redraw
        var redraw = this.offsetWidth;

        // renable default transition
        this.style[ transitionProp ] = '';

        // reset 100%/100% sizing after transition end
        if ( transitionProp ) {
            var _this = this;
            var onTransitionEnd = function() {
                _this.style.width = '';
                _this.style.height = '';
            };
            $this.one( transitionEndEvent, onTransitionEnd );
        }

        // set new size
        var size = getSize( $itemElem[0] );
        $this.css({
            width: size.width,
            height: size.height
        });

        $container.masonry();

    });

});
