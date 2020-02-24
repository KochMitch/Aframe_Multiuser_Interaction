'use strict';

// Spawn this object randomly in a circle.
AFRAME.registerComponent('spawn-area', {
    schema:
    {
        inCircle: { type: 'bool', default: false },
        radius: { type: 'number', default: 1 },
        innerRadius: {type: 'number', default: 0 },
    },

    init: function ()
    {
        let el = this.el;
        let center = el.getAttribute('position');

        let angleRad = this.getRandomAngleInRadians();
        let circlePoint;
        if (this.data.inCircle)
        {
           circlePoint = this.randomPointInCircle(this.data.radius, angleRad);
        }
        else
        {
            circlePoint = this.randomPointOnCircle(this.data.radius, angleRad);
        }

        let worldPoint = { x: circlePoint.x + center.x, y: center.y, z: circlePoint.y + center.z };
        el.setAttribute('position', worldPoint);

        let angleDeg = angleRad * 180 / Math.PI;
        let angleToCenter = -1 * angleDeg + 90;
        let rotationStr = '0 ' + angleToCenter + ' 0';
        el.setAttribute('rotation', rotationStr);
    },

    getRandomAngleInRadians: function ()
    {
        return Math.random() * Math.PI * 2;
    },

    // Get a random point on the circle edge.
    randomPointOnCircle: function (radius, angleRad)
    {
        let x = Math.cos(angleRad) * radius;
        let y = Math.sin(angleRad) * radius;
        return { x: x, y: y };
    },

    // Get a random point in the circle, but not inside the inner radius.
    randomPointInCircle: function (radius, angleRad)
    {
        let newRadius = radius - this.data.innerRadius;
        let randRadius_sq = (Math.random() * newRadius * newRadius) + (this.data.innerRadius * this.data.innerRadius);
        let x = Math.sqrt(randRadius_sq) * Math.cos(angleRad);
        let y = Math.sqrt(randRadius_sq) * Math.sin(angleRad);
        return { x: x, y: y };
    }
});