'use strict';

let score = 0;
let hit = false;
let resetId = 0;
on(_select("#hammer"), 'collide', (e) =>
{
    const xeno = _select("#xeno")
    if (e.detail.body.id === xeno.body.id && !hit)
    {
        hit = true;
        score = score + 1;
        clearTimeout(resetId);
        resetId = setTimeout(resetBall, 2000);
    }
})

setTimeout(resetBall, 3000);