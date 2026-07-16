import _prototypeChain from 'isotropic-prototype-chain';

const _mixinPrototypeChain = {
    * fromInstanceObject (object) {
        yield object;

        yield* _mixinPrototypeChain.fromPrototypeObject(Reflect.getPrototypeOf(object));
    },
    * fromPrototypeObject (object) {
        for (object of _prototypeChain(object)) {
            if (object === Object.prototype) {
                break;
            }

            yield object;

            const mixins = object.constructor?.mixins;

            if (Array.isArray(mixins)) {
                for (let mixinIndex = mixins.length - 1; mixinIndex >= 0; mixinIndex -= 1) {
                    for (const object of _mixinPrototypeChain.fromStaticObject(mixins[mixinIndex])) {
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
                    yield* _mixinPrototypeChain.fromStaticObject(object.mixins[mixinIndex]);
                }
            }
        }
    }
};

export default _mixinPrototypeChain;
