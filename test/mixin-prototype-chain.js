import {
    describe,
    it
} from 'mocha';

import {
    mixinPrototypeChainFromInstanceObject,
    mixinPrototypeChainFromPrototypeObject,
    mixinPrototypeChainFromStaticObject
} from '../js/mixin-prototype-chain.js';

import {
    expect
} from 'chai';

import make from 'isotropic-make';

describe('mixin-prototype-chain', () => {
    describe('mixinPrototypeChainFromInstanceObject', () => {
        it('should yield object and mixin prototypes', () => {
            const A = make({
                    a: 'a'
                }),
                B = make(A, {
                    b: 'b'
                }),
                C = make([
                    B
                ], {
                    c: 'c'
                }),
                D = make({
                    d: 'd'
                }),
                E = make(D, [
                    C
                ], {
                    e: 'e'
                }),
                e = E(),
                objects = [];

            for (const object of mixinPrototypeChainFromInstanceObject(e)) {
                objects.push(object);
            }

            expect(objects).to.deep.equal([
                e,
                E.prototype,
                C.prototype,
                B.prototype,
                A.prototype,
                D.prototype
            ]);
        });
    });

    describe('mixinPrototypeChainFromPrototypeObject', () => {
        it('should yield object and mixin prototypes', () => {
            const A = make({
                    a: 'a'
                }),
                B = make(A, {
                    b: 'b'
                }),
                C = make([
                    B
                ], {
                    c: 'c'
                }),
                D = make({
                    d: 'd'
                }),
                E = make(D, [
                    C
                ], {
                    e: 'e'
                }),
                e = E(),
                objects = [];

            for (const object of mixinPrototypeChainFromPrototypeObject(Reflect.getPrototypeOf(e))) {
                objects.push(object);
            }

            expect(objects).to.deep.equal([
                E.prototype,
                C.prototype,
                B.prototype,
                A.prototype,
                D.prototype
            ]);
        });
    });

    describe('mixinPrototypeChainFromStaticObject', () => {
        it('should yield object and mixin prototypes', () => {
            const A = make({
                    a: 'a'
                }),
                B = make(A, {
                    b: 'b'
                }),
                C = make([
                    B
                ], {
                    c: 'c'
                }),
                D = make({
                    d: 'd'
                }),
                E = make(D, [
                    C
                ], {
                    e: 'e'
                }),
                objects = [];

            for (const object of mixinPrototypeChainFromStaticObject(E)) {
                objects.push(object);
            }

            expect(objects).to.deep.equal([
                E,
                C,
                B,
                A,
                D
            ]);
        });
    });
});
