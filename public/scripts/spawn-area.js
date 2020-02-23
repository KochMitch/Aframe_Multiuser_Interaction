'use strict';

// Spawn this object randomly in a circle.
AFRAME.registerComponent('spawn-area', {
    schema:
    {
        radius: { type: 'number', default: 1 }
    },

    init: function ()
    {
        var el = this.el;
        var center = el.getAttribute('position');

        var angleRad = this.getRandomAngleInRadians();
        var circlePoint = this.randomPointOnCircle(this.data.radius, angleRad);
        var worldPoint = { x: circlePoint.x + center.x, y: center.y, z: circlePoint.y + center.z };
        el.setAttribute('position', worldPoint);

        var angleDeg = angleRad * 180 / Math.PI;
        var angleToCenter = -1 * angleDeg + 90;
        var rotationStr = '0 ' + angleToCenter + ' 0';
        el.setAttribute('rotation', rotationStr);
    },

    getRandomAngleInRadians: function ()
    {
        return Math.random() * Math.PI * 2;
    },

    // Get a random point in the circle.
    randomPointOnCircle: function (radius, angleRad)
    {
        let x = Math.cos(angleRad) * radius;
        let y = Math.sin(angleRad) * radius;
        return { x: x, y: y };
    }
});