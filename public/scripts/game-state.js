'use strict';

AFRAME.registerState(
{
    initialState:
    {
        enemyPosition: { x: 0, y: 1, z: 2 }
    },

    handlers:
    {
        enemyMoved: function (state, action)
        {
            state.enemyPosition = action.newPosition;
        }
    },
});

