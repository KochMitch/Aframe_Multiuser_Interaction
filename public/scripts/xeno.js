'use strict';

AFRAME.registerComponent('xeno',
    {
        schema:
        {
            //isHit: { default: false },
        },

        init: function ()
        {
            const self = this;
            this.despawnTimer = setTimeout(function ()
            {
                self.despawnSelf();
            }, ((Math.random() * 6) + 4) * 1000);

            const collsionHandler = function (event)
            {
                const targetEl = event.detail.body.el;

                if (targetEl.id == "playerWeap")
                {
                    //self.isHit = true;
                    self.el.removeEventListener("collide", collsionHandler);
                    if (self.despawnTimer)
                    {
                        clearTimeout(self.despawnTimer);
                    }

                    self.despawnTimer = setTimeout(function ()
                    {
                        self.despawnSelf();
                    }, 1200);
                }
            };

            self.el.addEventListener("collide", collsionHandler);
            self.el.components.sound.playSound();
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
            const self = this;
            const el = self.el;

            // Check who owns the element and take ownership if it belongs to a different client,
            // as only the element owner can remove it.
            if (NAF.utils.isMine(el))
            {
                self.system.despawnXeno(el);
            }
            else
            {
                NAF.utils.takeOwnership(el);
            }

            el.sceneEl.removeChild(el);
        },
    })