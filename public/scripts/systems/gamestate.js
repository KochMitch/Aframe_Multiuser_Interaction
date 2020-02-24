'use strict';

let socket = io();

AFRAME.registerSystem('gamestate', {
    // Initial state.
    schema: {
        score: { default: 0 },
        isGameOver: { default: false },
        isCoop: { default: false },
        state: { default: 'STATE_MENU', oneOf: ['STATE_MENU', 'STATE_PLAYING', 'STATE_GAME_LOST', 'STATE_GAME_WIN'] },
        scoreToWin: {default: 5 },
    },

    gameEnd: function (newState, win)
    {
        newState.state = 'STATE_GAME_WIN';
        newState.isGameWin = true;
    },

    init: function ()
    {
        var initialState = this.initialState;
        const sceneEl = this.sceneEl;
        var state = this.data;
        this.mainMenuGroup = document.getElementById('mainmenu');

        if (!initialState)
        {
            initialState = state;
        }

        sceneEl.emit('gamestateinitialized', { state: initialState });

        registerHandler('coopSelect', function (newState)
        {
            newState.isCoop = true;
            newState.scoreToWin = 10;
            return newState;
        });

        registerHandler('competitiveSelect', function (newState)
        {
            newState.isCoop = false;
            newState.scoreToWin = 5;
            return newState;
        });

        registerHandler('start-game', function (newState)
        {
            this.mainMenuGroup.setAttribute('visible', false);
            _select('#coop').setAttribute('class', '');
            _select('#competative').setAttribute('class', '');
            newState.isGameOver = false;
            //newState.isGameWin = false;
            newState.state = 'STATE_PLAYING';
            return newState;
        });

        registerHandler('end-game', function (newState)
        {
            if (newState.state === 'STATE_PLAYING')
            {
                if (newState.health <= 0)
                {
                    newState.isGameOver = true;
                    newState.state = 'STATE_GAME_OVER';
                }
            }

            return newState;
        });

        registerHandler('reset', function ()
        {
            this.mainMenuGroup.setAttribute('visible', true);
            _select('#coop').setAttribute('class', 'clickable');
            _select('#competative').setAttribute('class', 'clickable');
            return initialState;
        });

        registerHandler('score-point', function (newState)
        {
            newState.score++;
            if (newState.score >= self.data.scoreToWin)
            {
                self.gameEnd(newState, true);
            }

            return newState;
        });

        // Part of the game state library.
        function registerHandler(eventName, handler)
        {
            sceneEl.addEventListener(eventName, function (param)
            {
                let newState = handler(AFRAME.utils.extend({}, state), param);
                publishState(eventName, newState);
            });
        }

        // Part of the game state library.
        function publishState(event, newState)
        {
            let oldState = AFRAME.utils.extend({}, state);
            sceneEl.setAttribute('gamestate', newState);
            state = newState;
            sceneEl.emit('gamestate-changed', {
                event: event,
                diff: AFRAME.utils.diff(oldState, newState),
                state: newState
            });
        }
    }
});
