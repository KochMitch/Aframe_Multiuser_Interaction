'use strict';

AFRAME.registerComponent('weapon',
    {
        schema: {},

        init: function ()
        {
            const context = this;

            context.el.addEventListener('collide', function (event)
            {
                const targetEl = event.detail.body.el;
                let targetComp = targetEl.getAttribute('xeno');

                if (targetComp)
                {

                }
            });
        },


    })