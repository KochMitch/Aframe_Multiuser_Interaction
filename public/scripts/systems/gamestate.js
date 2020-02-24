'use strict';

let socket = io();

AFRAME.registerSystem('gamestate', {
    // Initial state.
    schema: {
        score: { default: 0 },
        isGameOver: { default: false },
        isCoop: { default: false },
        state: { default: 'STATE_MENU', oneOf: ['STATE_MENU', 'STATE_PLAYING', 'STATE_GAME_LOST', 'STATE_GAME_WIN'] },
        scoreToWin: {default: 10 },
    },

    gameEnd: function (newState, win)
    {
        newState.state = 'STATE_GAME_WIN';
        newState.isGameWin = true;
    },

    init: function ()
    {
        var initialState = this.initialState;
        const sceneEl = this.el;
        var state = this.data;

        if (!initialState)
        {
            initialState = state;
        }

        sceneEl.emit('gamestateinitialized', { state: initialState });

        sceneEl.emit('start-game', {});

        registerHandler('start-game', function (newState)
        {
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
                    newState.numEnemies = 0;
                    newState.state = 'STATE_GAME_OVER';
                }
            }

            return newState;
        });

        registerHandler('reset', function ()
        {
            //ABLAST.currentScore = {
            //    name: '',
            //    points: 0,
            //    time: 0,
            //    shoots: 0,
            //    validShoot: 0
            //};

            return initialState;
        });

        registerHandler('xeno-spawn', function (newState)
        {
            newState.numEnemies++;
            return newState;
        });

        registerHandler('xeno-death', function (newState)
        {
            newState.score++;
            //ABLAST.currentScore.points++;
            if (newState.score >= self.data.scoreToWin)
            {
                self.gameEnd(newState, true);
            }

            // All enemies killed, advance wave.
            if (newState.numEnemies === 0)
            {
                newState.numSequences--;
                newState.waveSequence++;
                if (newState.numSequences === 0)
                {
                    newState.waveSequence = 0;
                    newState.wave++;
                    if (newState.wave >= WAVES.length)
                    {
                        self.gameEnd(newState, true);
                    }
                }
            }

            return newState;
        });

        //registerHandler('xeno-spawn', function (newState)
        //{
        //    newState.numEnemies++;
        //    return newState;
        //});

        //registerHandler('increment', function (newState, evt)
        //{
        //    newState.value++;
        //    return newState;
        //});

        // Part of the game state library.
        function registerHandler(eventName, handler)
        {
            el.addEventListener(eventName, function (param)
            {
                let newState = handler(AFRAME.utils.extend({}, state), param);
                publishState(eventName, newState);
            });
        }

        // Part of the game state library.
        function publishState(event, newState)
        {
            let oldState = AFRAME.utils.extend({}, state);
            el.setAttribute('gamestate', newState);
            state = newState;
            el.emit('gamestate-changed', {
                event: event,
                diff: AFRAME.utils.diff(oldState, newState),
                state: newState
            });
        }
    }
});
