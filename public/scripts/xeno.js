'use strict';

AFRAME.registerComponent('xeno',
    {
        schema:
        {
            //isHit: { default: false },
        },

        init : function()
        {
            const context = this;
            this.despawnTimer = setTimeout(function ()
            {
                context.despawnSelf();
            }, (Math.random() * 4) + 5 * 1000);

            context.el.addEventListener("collide", function (event)
            {
                const targetEl = event.detail.body.el;

                if (targetEl.className == "weapon")
                {
                    //context.isHit = true;
                    context.el.removeEventListener("collide", this);
                    if (context.despawnTimer)
                    {
                        clearTimeout(context.despawnTimer);
                    }

                    context.despawnTimer = setTimeout(function ()
                    {
                        context.despawnSelf();
                    }, 1200);
                }
            });
        },

        remove: function ()
        {
            this.el.removeEventListener("collide", this.collideHandle);

            if (this.despawnTimer)
            {
                clearTimeout(this.despawnTimer);
            }
        },

        despawnSelf: function ()
        {
            const context = this;
            context.el.parentNode.removeChild(context.el);
        },
    })