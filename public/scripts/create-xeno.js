'use strict';

AFRAME.registerComponent('distribute',
    {
    schema: {
        src: { type: 'string' },
        jitter: { type: 'vec3' },
        centerOffset: { type: 'vec3' },
        radius: { type: 'number' }
    },
    init: function()
    {
        const rg = new Random(Random.engines.mt19937().seed(10))
        const center = new THREE.Vector3(this.data.centerOffset.x,
            this.data.centerOffset.y, this.data.centerOffset.z)
        const jx = this.data.jitter.x
        const jy = this.data.jitter.y
        const jz = this.data.jitter.z
        if (_select(this.data.src).hasLoaded)
        {
            const s = this.data.radius
            for (let i = -s; i < s; i++)
            {
                for (let j = -s; j < s; j++)
                {
                    const el = document.createElement('a-entity')
                    el.setAttribute('gltf-model', this.data.src)
                    const offset = new THREE.Vector3(i * s + rg.real(-jx, jx),
                        rg.real(-jy, jy),
                        j * s - rg.real(-jz, jz));
                    el.setAttribute('position', center.clone().add(offset));
                    el.setAttribute('rotation', { x: 0, y: rg.real(-45, 45) * Math.PI / 180, z: 0 })
                    const scale = rg.real(0.5, 1.5)
                    el.setAttribute('scale', { x: scale, y: scale, z: scale })
                    _select('a-scene').appendChild(el)
                }
            }
        }
    }
})