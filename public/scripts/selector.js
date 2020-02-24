'use strict';

AFRAME.registerComponent('selector', {
    schema:
    {
        emitEvent: { type: 'string', default: '' },
    },

    init: function ()
    {
        let self = this;
        let collisionHandler = function (event)
        {
            self.el.sceneEl.emit(self.data.emitEvent);
            //disableMenu();
            //self.el.removeEventListener('collide', collisionHandler);
        };

        self.el.addEventListener("collide", collisionHandler);
    },
});