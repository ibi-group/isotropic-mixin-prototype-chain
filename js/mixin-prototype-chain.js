import _prototypeChain from 'isotropic-prototype-chain';

const _mixinPrototypeChain = {
    * fromInstanceObject (object) {
        yield object;

        for (object of _mixinPrototypeChain.fromPrototypeObject(Reflect.getPrototypeOf(object))) {
            yield object;
        }
    },
    * fromPrototypeObject (object) {
        for (object of _prototypeChain(object)) {
            if (object === Object.prototype) {
                break;
            }

            yield object;

            if (Array.isArray(object.constructor && object.constructor.mixins)) {
                for (let mixinIndex = object.constructor.mixins.length - 1; mixinIndex >= 0; mixinIndex -= 1) {
                    const mixin = object.constructor.mixins[mixinIndex];

                    for (const object of _mixinPrototypeChain.fromStaticObject(mixin)) {
                        yield object.prototype;
                    }
                }
            }
        }
    },
    * fromStaticObject (object) {
        for (object of _prototypeChain(object)) {
            if (object === Object) {
                break;
            }

            yield object;

            if (Array.isArray(object.mixins)) {
                for (let mixinIndex = object.mixins.length - 1; mixinIndex >= 0; mixinIndex -= 1) {
                    const mixin = object.mixins[mixinIndex];

                    for (const object of _mixinPrototypeChain.fromStaticObject(mixin)) {
                        yield object;
                    }
                }
            }
        }
    }
};

export default _mixinPrototypeChain;
