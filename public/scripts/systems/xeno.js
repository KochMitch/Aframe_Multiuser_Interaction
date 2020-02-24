'use strict';
GAME.xenos = {};

AFRAME.registerSystem('xeno', {
    schema: { },

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

        sceneEl.addEventListener('gamestate-changed', function (evt)
        {
            if ('state' in evt.detail.diff)
            {
                if (evt.detail.state.state === 'STATE_PLAYING')
                {
                    setTimeout(function ()
                    {
                        self.createXeno(0);
                    }, 1000);
                }
                else if (evt.detail.state.state === 'STATE_GAME_OVER'
                    || evt.detail.state.state === 'STATE_GAME_WIN'
                    || evt.detail.state.state === 'STATE_MENU')
                {
                    self.reset();
                    return;
                }
            }

            if ('waveSequence' in evt.detail.diff)
            {
                self.createSequence(evt.detail.state.waveSequence);
            }

            if ('wave' in evt.detail.diff)
            {
                self.createWave(evt.detail.state.wave);
            }
        });
    },

    onEnemyDeath: function (name, entity)
    {
        if (this.sceneEl.getAttribute('gamestate').state === 'STATE_MENU')
        {
            this.sceneEl.emit('start-game');
        } else
        {
            this.poolHelper.returnEntity(name, entity);
            this.sceneEl.emit('enemy-death');
        }
    },

    createXeno: function (e)
    {
        const self = this;
        let entity = document.createElement('a-entity');
        entity.setAttribute('mixin', 'xeno');

        function activateEnemy(entity)
        {
            //entity.setAttribute('visible', true);
            GAME.xenos.push(entity);
            self.sceneEl.emit('xeno-spawn', { enemy: entity });
        }

        if (timeOffset)
        {
            if (timeOffset < 0)
            {
                entity.setAttribute('visible', false);
                setTimeout(function ()
                {
                    activateEnemy(entity);
                }, -timeOffset);
            }
            else
            {

            }
        }
        else
        {
            activateEnemy(entity);
        }
    },
});
