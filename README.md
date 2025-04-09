# isotropic-mixin-prototype-chain

[![npm version](https://img.shields.io/npm/v/isotropic-mixin-prototype-chain.svg)](https://www.npmjs.com/package/isotropic-mixin-prototype-chain)
[![License](https://img.shields.io/npm/l/isotropic-mixin-prototype-chain.svg)](https://github.com/ibi-group/isotropic-mixin-prototype-chain/blob/main/LICENSE)
![](https://img.shields.io/badge/tests-passing-brightgreen.svg)
![](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

A set of generator functions that walk through the prototype chain of an object and its mixins. This module extends the capabilities of `isotropic-prototype-chain` to specifically handle objects created with `isotropic-make` and its mixin functionality.

## Why Use This?

- **Complete Prototype Traversal**: Examines both inheritance and mixin chains
- **Mixin Awareness**: Recognizes and traverses mixins created with `isotropic-make`
- **Multiple Entry Points**: Separate generators for instance objects, prototype objects, and constructor functions
- **Generator-Based**: Uses JavaScript generators for efficient lazy iteration
- **Flexible Integration**: Works seamlessly with other isotropic modules

## Installation

```bash
npm install isotropic-mixin-prototype-chain
```

## Usage

```javascript
import _make from 'isotropic-make';
import _mixinPrototypeChain from 'isotropic-mixin-prototype-chain';

// Create a class hierarchy with mixins
const _Formatter = _make({
        format (text) {
            return `[Formatted]: ${text}`;
        }
    }),
    _Logger = _make({
        log (message) {
            console.log(message);
        }
    }),

    // Inherit from Formatter and use Logger as a mixin
    _EnhancedFormatter = _make(_Formatter, [
        _Logger
    ], {
        enhancedFormat (text) {
            return this.format(`Enhanced: ${text}`);
        }
    });

{
    // Create an instance
    const formatter = _EnhancedFormatter();

    // Walk through the entire prototype chain including mixins
    for (const prototype of _mixinPrototypeChain.fromInstanceObject(formatter)) {
        console.log(prototype);
    }
    // Outputs:
    // EnhancedFormatter instance
    // EnhancedFormatter.prototype
    // Logger.prototype
    // Formatter.prototype
}
```

## API

The module exports an object with three generator methods for traversing prototype chains with mixin awareness:

### fromInstanceObject(object)

Walks through the prototype chain of an instance, including mixins.

#### Parameters

- `object` (Object): An instance object (created with a constructor or factory function)

#### Returns

- (Generator): A generator that yields each object in the prototype chain, including mixin prototypes

#### Yield Order

1. The instance object itself
2. The constructor's prototype
3. Mixin prototypes (in reverse definition order)
4. Parent prototype
5. Parent's mixin prototypes (recursively)

### fromPrototypeObject(object)

Walks through the prototype chain starting from a prototype object, including mixins.

#### Parameters

- `object` (Object): A prototype object (e.g., `Class.prototype`)

#### Returns

- (Generator): A generator that yields prototype objects, including mixin prototypes

#### Yield Order

1. The prototype object itself
2. Mixin prototypes (in reverse definition order)
3. Parent prototype
4. Parent's mixin prototypes (recursively)

### fromStaticObject(object)

Walks through the prototype chain starting from a constructor function or class, including mixins.

#### Parameters

- `object` (Function): A constructor function or class

#### Returns

- (Generator): A generator that yields constructor functions, including mixin constructors

#### Yield Order

1. The constructor function itself
2. Mixin constructor functions (in reverse definition order)
3. Parent constructor
4. Parent's mixin constructors (recursively)

## Examples

### Finding Methods Across the Inheritance and Mixin Chain

```javascript
import _make from 'isotropic-make';
import _mixinPrototypeChain from 'isotropic-mixin-prototype-chain';

// Define some behaviors as mixins
const _Loggable = _make({
        log (message) {
            console.log(`[${this.name}]: ${message}`);
        }
    }, {
        name: '_Loggable'
    }),
    _Serializable = _make({
        toJSON () {
            return JSON.stringify(this);
        }
    }, {
        name: '_Serializable'
    }),

    // Create a base class
    _Entity = _make({
        _init (name) {
            this.name = name;

            return this;
        }
    }, {
        name: '_Entity'
    }),
    // Create a derived class with mixins
    _User = _make(_Entity, [
        _Loggable,
        _Serializable
    ], {
        greet () {
            return `Hello, I'm ${this.name}`;
        }
    }, {
        name: '_User'
    }),

    // Find all available methods on the instance
    _getAllMethodSources = instance => {
        const methodSourcesByName = {};

        for (const prototype of _mixinPrototypeChain.fromInstanceObject(instance)) {
            // Skip the instance itself
            if (prototype === instance) {
                continue;
            }

            for (const [
                name,
                descriptor
            ] of Object.entries(Object.getOwnPropertyDescriptors(prototype))) {
                if (name !== 'constructor' && typeof descriptor.value === 'function') {
                    let methodSources = methodSourcesByName[name];

                    if (!methodSources) {
                        methodSources = [];
                        methodSourcesByName[name] = methodSources;
                    }

                    methodSources.push(prototype.constructor.name ?? 'Unknown');
                }
            }
        }

        return methodSourcesByName;
    };

{
    // Create an instance
    const user = _User('John');

    // Get all methods
    console.log(_getAllMethodSources(user));
    // {
    //   log: [ '_User', '_Loggable' ],
    //   toJSON: [ '_User', '_Serializable' ],
    //   greet: [ '_User' ],
    //   _init: [ '_Entity' ]
    // }
}
```

### Mixin-Aware Property Lookup

```javascript
import _make from 'isotropic-make';
import _mixinPrototypeChain from 'isotropic-mixin-prototype-chain';

// Function to find where a property is defined in the prototype chain
const _findPropertyDefinition = (instance, propertyName) => {
    for (const prototype of _mixinPrototypeChain.fromInstanceObject(instance)) {
        if (Object.getOwnPropertyDescriptor(prototype, propertyName)) {
            return prototype;
        }
    }

    return null;
};

{
    // Create classes with mixins
    const A = _make({
            methodA () {},
            name: 'A'
        }),
        B = _make({
            methodB () {},
            name: 'B'
        }),
        C = _make(A, [
            B
        ], {
            methodC () {},
            name: 'C'
        }),
        D = _make({
            methodD () {},
            name: 'D'
        }),
        E = _make(C, [
            D
        ], {
            methodE () {},
            name: 'E'
        }),
        // Create an instance
        e = E();

    // Find where each method is defined
    console.log('methodA defined in:', _findPropertyDefinition(e, 'methodA').name); // A
    console.log('methodB defined in:', _findPropertyDefinition(e, 'methodB').name); // C because it was mixed in
    console.log('methodC defined in:', _findPropertyDefinition(e, 'methodC').name); // C
    console.log('methodD defined in:', _findPropertyDefinition(e, 'methodD').name); // E because it was mixed in
    console.log('methodE defined in:', _findPropertyDefinition(e, 'methodE').name); // E
}
```

### Analyzing Constructor Hierarchies

```javascript
import _make from 'isotropic-make';
import _mixinPrototypeChain from 'isotropic-mixin-prototype-chain';

// Function to analyze a constructor's hierarchy
const _analyzeConstructorHierarchy = constructor => {
    const hierarchy = [];

    for (const prototype of _mixinPrototypeChain.fromStaticObject(constructor)) {
        hierarchy.push({
            isMixin: constructor.mixins && constructor.mixins.includes(prototype),
            name: prototype.name ?? 'Anonymous',
            ownMethodCount: Object.getOwnPropertyNames(prototype.prototype)
                .filter(propertyName => propertyName !== 'constructor' && typeof prototype.prototype[propertyName] === 'function').length
        });
    }

    return hierarchy;
};

{
    // Create a class hierarchy with mixins
    const Base = _make({
            baseMethod () {}
        }, {
            name: 'Base'
        }),
        MixinA = _make({
            mixinAMethod () {}
        }, {
            name: 'MixinA'
        }),
        MixinB = _make({
            mixinBMethod () {}
        }, {
            name: 'MixinB'
        }),

        Derived = _make(Base, [
            MixinA,
            MixinB
        ], {
            derivedMethod () {}
        }, {
            name: 'Derived'
        });

    // Analyze the hierarchy
    console.log(_analyzeConstructorHierarchy(Derived));
    // [
    //   { isMixin: false, name: 'Derived', ownMethodCount: 3 },
    //   { isMixin: true, name: 'MixinB', ownMethodCount: 1 },
    //   { isMixin: true, name: 'MixinA', ownMethodCount: 1 },
    //   { isMixin: false, name: 'Base', ownMethodCount: 1 }
    // ]
}
```

## Integration with Other isotropic Modules

This module works especially well with other modules in the isotropic ecosystem:

- **isotropic-make**: Creates constructor functions with mixin support
- **isotropic-mixin**: Copy properties between objects
- **isotropic-prototype-chain**: Basic prototype chain traversal (used internally)

## Contributing

Please refer to [CONTRIBUTING.md](https://github.com/ibi-group/isotropic-mixin-prototype-chain/blob/main/CONTRIBUTING.md) for contribution guidelines.

## Issues

If you encounter any issues, please file them at https://github.com/ibi-group/isotropic-mixin-prototype-chain/issues
