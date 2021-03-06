'use strict';

AFRAME.registerSystem('xeno', {
    schema: {
        maxXenos: {default: 5 },
    },

    init: function ()
    {
        var self = this;
        var sceneEl = this.sceneEl;

        if (!sceneEl.hasLoaded)
        {
            sceneEl.addEventListener('loaded', this.init.bind(this));
            return;
        }

        this.xenos = [];
        this.isSpawning = false;
        this.lastSpawn = 0;

        sceneEl.addEventListener('gamestate-changed', function (evt)
        {
            if ('state' in evt.detail.diff)
            {
                if (evt.detail.state.state === 'STATE_PLAYING')
                {
                    self.isSpawning = true;
                }
                else if (evt.detail.state.state === 'STATE_GAME_OVER'
                    || evt.detail.state.state === 'STATE_GAME_WIN'
                    || evt.detail.state.state === 'STATE_MENU')
                {
                    self.reset();
                    return;
                }
            }
        });
    },

    play: function ()
    {
        this.isSpawning = true;
    },

    pause: function ()
    {
        this.isSpawning = false;
    },

    tick: function (time, delta)
    {
        let self = this;
        if (self.isSpawning && time - self.lastSpawn >= 1000)
        {
            if (self.xenos.length < self.data.maxXenos)
            {
                self.lastSpawn = time;
                self.createXeno();
            }
        }
    },

    despawnXeno: function (xeno)
    {
        let self = this;
        let index = this.xenos.indexOf(xeno);
        if (index > -1)
        {
            self.xenos.splice(index, 1);
            this.sceneEl.emit('xeno-despawn');
        }
    },

    createXeno: function ()
    {
        const self = this;
        let entity = document.createElement('a-entity');
        entity.setAttribute('class', 'xeno');
        entity.setAttribute('networked', { template: "#xeno-template" });
        entity.setAttribute('spawn-area', { radius: 12, innerRadius: 2, inCircle: true });

        self.xenos.push(entity);
        self.sceneEl.emit('xeno-spawn', { xeno: entity });

        setTimeout(function ()
        {
            //entity.setAttribute('xeno', '');
            self.sceneEl.appendChild(entity);
        }, 1000);
    },

    reset: function ()
    {
        let self = this;
        self.xenos = [];
        self.isSpawning = false;
    },
});
