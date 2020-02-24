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
            }, (Math.random() * 4) + 10 * 1000);

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
            const el = context.el;

            // Check who owns the element and take ownership if it belongs to a different client,
            // as only the element owner can remove it.
            if (!NAF.utils.isMine(el))
            {
                NAF.utils.takeOwnership(entityEl);
            }

            el.sceneEl.removeChild(el);
        },
    })