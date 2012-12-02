'use strict';

jQuery.event.props.push("wheelDelta");
StripesFactoryv2App.directive('scrollable', function() {
	return function(scope, element, attrs) {
		var $el = $(element),
			$document = $(document), //used in attaching mouse events
			$scrolldlg = $el.find('.resizeable'),
			$scrollbar = $('<div class="scrollbar horizontal" style="display:none"></div>').appendTo($el),
			pageWidth = $(window).width() - $('.side-ctrl').outerWidth(),
			step = 0;
				
		function getMousePos(evt) {
			var offset = $scrollbar.offset();
			return {
				x : evt.pageX - offset.left,
				y : evt.pageY - offset.top
			};
		}
		
		function scrollTo(x) {
			// normalize
			x = Math.min(
				Math.max(x, 0),
				pageWidth - $scrollbar.width()
			);

			$scrollbar.css('left', x);
			$scrolldlg.css('left', step * -x);
		}
		
		function updateScrollbar() {
			var scrolldlgWidth = $scrolldlg.width();
			if (scrolldlgWidth > pageWidth) {
				var scrollWidth = pageWidth / (scrolldlgWidth / pageWidth);
				$scrollbar.width(scrollWidth);
				// update step
				step = scrolldlgWidth / pageWidth;
				scrollTo(pageWidth - scrollWidth);
				$scrollbar.show();
			}
			else {
				$scrolldlg.css('left', '0');
				$scrollbar.hide();
			}
		}
		
		// attach event handlers
		$document.on('mousedown', '.scrollbar', function(evt){
			evt.preventDefault();
			evt.stopPropagation();
			$scrollbar.addClass('active');
			var anchor = getMousePos(evt).x;
			// bind mousemove only from mousedown and unbind in mouseup
			$document.on('mousemove', function(evt){
				evt.preventDefault();
				scrollTo(
					$scrollbar.position().left - (anchor - getMousePos(evt).x)
				);
			});
		}).on('mouseup', function(evt){
			$scrollbar.removeClass('active');
			$document.off('mousemove');
		})

		$el.on('mousewheel', function(evt){
			evt.preventDefault();
			evt.stopPropagation();

			scrollTo(
				$scrollbar.position().left +
				(evt.wheelDelta > 0 ? -50 : 50)
			);
		});

		$(window).resize(function(evt){
			pageWidth = $(window).width() - $('.side-ctrl').outerWidth();
			updateScrollbar();
		});
		
		scope.$watch(
			function() {
				return $scrolldlg.width();
			},
			updateScrollbar
		);	
	};
});
