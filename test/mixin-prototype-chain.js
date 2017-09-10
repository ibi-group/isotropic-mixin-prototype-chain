import * as _mixinPrototypeChain from '../js/mixin-prototype-chain.js';
import _chai from 'chai';
import _make from 'isotropic-make';
import _mocha from 'mocha';

_mocha.describe('mixin-prototype-chain', () => {
    _mocha.describe('mixinPrototypeChainFromInstanceObject', () => {
        _mocha.it('should yield object and mixin prototypes', () => {
            const A = _make({
                    a: 'a'
                }),
                B = _make(A, {
                    b: 'b'
                }),
                C = _make([
                    B
                ], {
                    c: 'c'
                }),
                D = _make({
                    d: 'd'
                }),
                E = _make(D, [
                    C
                ], {
                    e: 'e'
                }),
                e = E(),
                objects = [];

            for (const object of _mixinPrototypeChain.mixinPrototypeChainFromInstanceObject(e)) {
                objects.push(object);
            }

            _chai.expect(objects).to.deep.equal([
                e,
                E.prototype,
                C.prototype,
                B.prototype,
                A.prototype,
                D.prototype
            ]);
        });
    });

    _mocha.describe('mixinPrototypeChainFromPrototypeObject', () => {
        _mocha.it('should yield object and mixin prototypes', () => {
            const A = _make({
                    a: 'a'
                }),
                B = _make(A, {
                    b: 'b'
                }),
                C = _make([
                    B
                ], {
                    c: 'c'
                }),
                D = _make({
                    d: 'd'
                }),
                E = _make(D, [
                    C
                ], {
                    e: 'e'
                }),
                e = E(),
                objects = [];

            for (const object of _mixinPrototypeChain.mixinPrototypeChainFromPrototypeObject(Reflect.getPrototypeOf(e))) {
                objects.push(object);
            }

            _chai.expect(objects).to.deep.equal([
                E.prototype,
                C.prototype,
                B.prototype,
                A.prototype,
                D.prototype
            ]);
        });
    });

    _mocha.describe('mixinPrototypeChainFromStaticObject', () => {
        _mocha.it('should yield object and mixin prototypes', () => {
            const A = _make({
                    a: 'a'
                }),
                B = _make(A, {
                    b: 'b'
                }),
                C = _make([
                    B
                ], {
                    c: 'c'
                }),
                D = _make({
                    d: 'd'
                }),
                E = _make(D, [
                    C
                ], {
                    e: 'e'
                }),
                objects = [];

            for (const object of _mixinPrototypeChain.mixinPrototypeChainFromStaticObject(E)) {
                objects.push(object);
            }

            _chai.expect(objects).to.deep.equal([
                E,
                C,
                B,
                A,
                D
            ]);
        });
    });
});
