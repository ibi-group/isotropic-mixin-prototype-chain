import _chai from 'isotropic-dev-dependencies/lib/chai.js';
import _make from 'isotropic-make';
import _mixinPrototypeChain from '../lib/mixin-prototype-chain.js';
import _test from 'node:test';

_test.describe('mixin-prototype-chain', () => {
    _test.describe('mixinPrototypeChain.fromInstanceObject', () => {
        _test.it('should yield object and mixin prototypes', () => {
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

            for (const object of _mixinPrototypeChain.fromInstanceObject(e)) {
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

        _test.it('should yield mixin prototypes in reverse definition order', () => {
            const A = _make({
                    a: 'a'
                }),
                B = _make({
                    b: 'b'
                }),
                C = _make({
                    c: 'c'
                }),
                D = _make({
                    d: 'd'
                }),
                E = _make([
                    A,
                    B,
                    C,
                    D
                ], {
                    e: 'e'
                }),
                e = E(),
                objects = [];

            for (const object of _mixinPrototypeChain.fromInstanceObject(e)) {
                objects.push(object);
            }

            _chai.expect(objects).to.deep.equal([
                e,
                E.prototype,
                D.prototype,
                C.prototype,
                B.prototype,
                A.prototype
            ]);
        });
    });

    _test.describe('mixinPrototypeChain.fromPrototypeObject', () => {
        _test.it('should yield object and mixin prototypes', () => {
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

            for (const object of _mixinPrototypeChain.fromPrototypeObject(Reflect.getPrototypeOf(e))) {
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

        _test.it('should yield mixin prototypes in reverse definition order', () => {
            const A = _make({
                    a: 'a'
                }),
                B = _make({
                    b: 'b'
                }),
                C = _make({
                    c: 'c'
                }),
                D = _make({
                    d: 'd'
                }),
                E = _make([
                    A,
                    B,
                    C,
                    D
                ], {
                    e: 'e'
                }),
                e = E(),
                objects = [];

            for (const object of _mixinPrototypeChain.fromPrototypeObject(Reflect.getPrototypeOf(e))) {
                objects.push(object);
            }

            _chai.expect(objects).to.deep.equal([
                E.prototype,
                D.prototype,
                C.prototype,
                B.prototype,
                A.prototype
            ]);
        });
    });

    _test.describe('mixinPrototypeChain.fromStaticObject', () => {
        _test.it('should yield object and mixin prototypes', () => {
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

            for (const object of _mixinPrototypeChain.fromStaticObject(E)) {
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

        _test.it('should yield mixin prototypes in reverse definition order', () => {
            const A = _make({
                    a: 'a'
                }),
                B = _make({
                    b: 'b'
                }),
                C = _make({
                    c: 'c'
                }),
                D = _make({
                    d: 'd'
                }),
                E = _make([
                    A,
                    B,
                    C,
                    D
                ], {
                    e: 'e'
                }),
                objects = [];

            for (const object of _mixinPrototypeChain.fromStaticObject(E)) {
                objects.push(object);
            }

            _chai.expect(objects).to.deep.equal([
                E,
                D,
                C,
                B,
                A
            ]);
        });
    });
});
