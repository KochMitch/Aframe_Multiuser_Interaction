'use strict';

AFRAME.registerComponent('selector', {
    schema:
    {
        emitEvent: { type: 'string', default: '' },
    },

    init: function ()
    {
        let self = this;
        let selectionHandler = function (event)
        {
            self.el.sceneEl.emit(self.data.emitEvent);
            //self.el.removeEventListener('collide', selectionHandler);
        };

        self.el.addEventListener("mouseenter", selectionHandler);
    },
});