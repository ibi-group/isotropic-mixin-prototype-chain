import _prototypeChain from 'isotropic-prototype-chain';

const _mixinPrototypeChainFromStaticObject = function* (object) {
        for (object of _prototypeChain(object)) {
            if (object === Object) {
                break;
            }

            yield object;

            if (Array.isArray(object.mixins)) {
                for (const mixin of object.mixins) {
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
                for (const mixin of object.constructor.mixins) {
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
