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

    // Function sets the game state to end.
    gameEnd: function (newState, win)
    {
        newState.state = 'STATE_GAME_WIN';
        newState.isGameWin = true;
    },

    init: function ()
    {
        var initialState = this.initialState;
        const self = this;
        const sceneEl = this.sceneEl;
        var state = this.data;
        this.ready = false;
        this.otherReady = false;
        this.mainMenuGroup = document.getElementById('mainmenu');

        if (!initialState)
        {
            initialState = state;
        }

        socket.on('connect', function ()
        {
            console.log("connected!");
        });

        sceneEl.emit('gamestateinitialized', { state: initialState });
        _select('#score').setAttribute('text', 'value', 'Score: ' + state.score);

        registerHandler('coopSelect', function (newState)
        {
            newState.isCoop = true;
            newState.scoreToWin = 10;
            self.ready = true;
            socket.emit('ready', { isReady: true, isCoop: true });
            if (self.otherReady)
            {
                sceneEl.emit('start-game');
                _select('#waitText').setAttribute('visible', false);
            }
            else
            {
                _select('#waitText').setAttribute('visible', true);
            }

            return newState;
        });

        registerHandler('competitiveSelect', function (newState)
        {
            newState.isCoop = false;
            newState.scoreToWin = 5;
            self.ready = true;
            socket.emit('ready', { isReady: true, isCoop: false });
            if (self.otherReady)
            {
                sceneEl.emit('start-game');
                _select('#waitText').setAttribute('visible', false);
            }
            else
            {
                _select('#waitText').setAttribute('visible', true);
            }

            return newState;
        });

        registerHandler('start-game', function (newState)
        {
            self.mainMenuGroup.setAttribute('visible', false);
            _select('#coop').setAttribute('class', '');
            _select('#competitive').setAttribute('class', '');
            newState.isGameOver = false;
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
                    newState.state = 'STATE_MAIN_MENU';
                }
            }

            return newState;
        });

        registerHandler('reset', function ()
        {
            self.mainMenuGroup.setAttribute('visible', true);
            _select('#coop').setAttribute('class', 'clickable');
            _select('#competative').setAttribute('class', 'clickable');
            _select('#score').setAttribute('text', 'value', 'Score: ' + newState.score);
            _select('#waitText').setAttribute('visible', false);
            self.ready = false;
            socket.emit('ready', { isReady: false, });
            return initialState;
        });

        // Add a point scored by this player.
        registerHandler('score-point', function (newState)
        {
            newState.score++;
            if (newState.score >= self.data.scoreToWin)
            {
                self.gameEnd(newState, true);
            }

            _select('#score').setAttribute('text', 'value', 'Score: ' + newState.score);
            socket.emit('player_score');

            return newState;
        });

        // Add a point scored by another player.
        registerHandler('add-point', function (newState)
        {
            newState.score++;
            if (newState.score >= self.data.scoreToWin)
            {
                self.gameEnd(newState, true);
            }

            _select('#score').setAttribute('text', 'value', 'Score: ' + newState.score);

            return newState;
        });

        // Socket functions.
        socket.on('other_score', function (data)
        {
            if (state.isCoop)
            {
                sceneEl.emit('add-point');
            }
        });

        socket.on('other_ready', function (data)
        {
            self.otherReady = data.isReady && data.isCoop === state.isCoop;
            if (self.ready && self.otherReady)
            {
                _select('#waitText').setAttribute('visible', false);
                sceneEl.emit('start-game');
            }
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
