import _prototypeChain from 'isotropic-prototype-chain';

const _mixinPrototypeChainFromStaticObject = function* (object) {
        for (object of _prototypeChain(object)) {
            if (object === Object) {
                break;
            }

            yield object;

            if (Array.isArray(object.mixins)) {
                for (let mixinIndex = object.mixins.length - 1; mixinIndex >= 0; mixinIndex -= 1) {
                    const mixin = object.mixins[mixinIndex];

                    for (const object of _mixinPrototypeChainFromStaticObject(mixin)) {
                        yield object;
                    }
                }
            }
        }
    },

    _mixinPrototypeChainFromPrototypeObject = function* (object) {
        for (object of _prototypeChain(object)) {
            if (object === Object.prototype) {
                break;
            }

            yield object;

            if (Array.isArray(object.constructor && object.constructor.mixins)) {
                for (let mixinIndex = object.constructor.mixins.length - 1; mixinIndex >= 0; mixinIndex -= 1) {
                    const mixin = object.constructor.mixins[mixinIndex];

                    for (const object of _mixinPrototypeChainFromStaticObject(mixin)) {
                        yield object.prototype;
                    }
                }
            }
        }
    },

    _mixinPrototypeChainFromInstanceObject = function* (object) {
        yield object;

        for (object of _mixinPrototypeChainFromPrototypeObject(Reflect.getPrototypeOf(object))) {
            yield object;
        }
    };

export {
    _mixinPrototypeChainFromInstanceObject as mixinPrototypeChainFromInstanceObject,
    _mixinPrototypeChainFromPrototypeObject as mixinPrototypeChainFromPrototypeObject,
    _mixinPrototypeChainFromStaticObject as mixinPrototypeChainFromStaticObject
};
