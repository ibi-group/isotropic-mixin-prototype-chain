# Changelog

## 0.12.0 - 2026-07-15

### Breaking changes

**The package now ships source directly instead of a Babel build.** `lib/mixin-prototype-chain.js` is the original, unminified ES module source rather than transpiled and minified output. The source moved from `js/` to `lib/` in the repository, so published code now has readable identifiers and accurate line numbers in stack traces. Build artifacts such as minified names and inline source maps are gone.

The entry point and the exported object are unchanged.

#### Migration

Nothing to change beyond running on Node 26.

### Changed

- `description` rewritten and `keywords` expanded for npm discoverability.
- The generators now use `yield*` delegation and optional chaining (`object.constructor?.mixins`) in place of manual re-yield loops and `&&` guards. The sequence of yielded objects is unchanged.
- Recommends `node ^26.5.0` / `npm ^11.17.0`.

### Internal

- Test suite migrated from Mocha to the built-in `node --test` runner; assertions still use Chai.
- The Babel toolchain (`@babel/cli`, `@babel/core`, `@babel/preset-env`, `babel-preset-minify`, `babel-plugin-transform-line`) and the `build` / `prepare` build scripts were removed.
- `isotropic-dev-dependencies` updated to `~0.4.0`; the separately pinned `eslint` dev dependency was dropped, since the correct version now comes from `isotropic-dev-dependencies`.

## 0.11.0 - 2025-04-10

### Breaking changes

**The three named exports were replaced by a single default export.** The module previously exported `mixinPrototypeChainFromInstanceObject`, `mixinPrototypeChainFromPrototypeObject`, and `mixinPrototypeChainFromStaticObject` as named bindings. It now has a default export: an object with `fromInstanceObject`, `fromPrototypeObject`, and `fromStaticObject` generator methods.

The traversal behavior of all three generators is unchanged, only how you reach them changed.

#### Migration

```javascript
// Before
import {
    mixinPrototypeChainFromInstanceObject,
    mixinPrototypeChainFromPrototypeObject,
    mixinPrototypeChainFromStaticObject
} from 'isotropic-mixin-prototype-chain';

for (const object of mixinPrototypeChainFromInstanceObject(instance)) {
    // ...
}

// After
import _mixinPrototypeChain from 'isotropic-mixin-prototype-chain';

for (const object of _mixinPrototypeChain.fromInstanceObject(instance)) {
    // ...
}
```

If you prefer to keep the call sites unchanged, destructure at the import site:

```javascript
import _mixinPrototypeChain from 'isotropic-mixin-prototype-chain';

const {
    fromInstanceObject: mixinPrototypeChainFromInstanceObject,
    fromPrototypeObject: mixinPrototypeChainFromPrototypeObject,
    fromStaticObject: mixinPrototypeChainFromStaticObject
} = _mixinPrototypeChain;
```

### Changed

- A comprehensive README was added, documenting the full public interface with worked examples.
- `eslint` pinned at `~9.8.0` as a direct dev dependency to guarantee the intended version is installed.
- `isotropic-dev-dependencies` bumped to `~0.3.1`.

## 0.10.0 - 2024-07-30

### Breaking changes

**The package is now an ES module.** `"type": "module"` was added to `package.json`. CommonJS consumers can no longer `require('isotropic-mixin-prototype-chain')`.

#### Migration

Switch to `import`:

```javascript
// Before
const _mixinPrototypeChain = require('isotropic-mixin-prototype-chain');

// After
import _mixinPrototypeChain from 'isotropic-mixin-prototype-chain';
```

### Changed

- ESLint moved to flat config (`eslint.config.js`).
- The `eslintConfig` block was removed from `package.json`.
- Coverage tooling switched from `nyc` to `c8`.
- `repository` given an explicit `github:` prefix.
- Recommends `node ^22.5.1` / `npm ^10.8.2`.

No runtime behavior changed in this release.

## 0.9.0 - 2021-02-22

### Changed

- The entire dev toolchain was replaced by a single `isotropic-dev-dependencies` dev dependency. The Babel, ESLint, and nyc configuration blocks were removed from `package.json` in favor of shared configuration, and git hooks are now installed via Husky on `postinstall`.
- Recommends `node ^14.15.5` / `npm ^7.5.4`.

No runtime behavior changed in this release.

## 0.8.0 - 2020-07-27

### Changed

- A `files` allowlist was added so only `lib` is published. Previously the tarball was filtered by `.npmignore`, which was removed.
- Dependency refresh: ESLint 7, Mocha 8, nyc 15, Babel 7.10, `cross-env` 7.
- Lint target raised to ECMAScript 2020.
- Recommends `node ^12.18.3` / `npm ^6.14.6`.

No runtime behavior changed in this release.

## 0.7.0 - 2019-05-10

### Changed

- Added the `isotropic` keyword to `package.json`.
- Lint cleanup.
- Dependency bumps.

No runtime behavior changed in this release.

## 0.6.2 - 2019-05-08

### Changed

Dependency bumps only.

## 0.6.1 - 2019-05-08

### Changed

Dependency bumps only.

## 0.6.0 - 2019-05-08

### Changed

- Dev dependency refresh (Babel 7.4, Mocha 6, nyc 14, ESLint 5.16).
- Recommends `node ^10.15.3` / `npm ^6.4.1`.

No runtime behavior changed in this release.

## 0.5.0 - 2019-02-18

### Breaking changes

**Mixins are now traversed in reverse declaration order.** Both `mixinPrototypeChainFromStaticObject` and `mixinPrototypeChainFromPrototypeObject` previously iterated a `mixins` array front to back; they now iterate it back to front.

This matters because these generators define lookup precedence for consumers that walk the chain to resolve a property or collect declarations. With a class declared as `mixins: [A, B, C]`, the chain previously yielded `A`, then `B`, then `C`; it now yields `C`, then `B`, then `A`.

The new order is the correct one: later entries in a `mixins` array are applied later and therefore override earlier ones, so they must be encountered first when walking the chain to find the effective definition. The previous order gave precedence to the first-declared mixin, the opposite of how mixin application works.

#### Migration

If you declare only one mixin per level, nothing changes. If you declare two or more mixins that define the same property, the winner resolved by walking this chain will change to the later-declared mixin. Review any `mixins` array with overlapping members, and reverse the array if you were relying on the old precedence.

### Changed

- Dev dependency refresh.
- Recommends `node ^10.15.1` / `npm ^6.4.1`.

## 0.4.0 - 2018-11-25

### Changed

- Migrated from Babel 6 to Babel 7, and from `babel-istanbul` to `nyc` for coverage.
- Dropped the `nsp` security check, which was discontinued in favor of `npm audit`.
- Lint target raised to ECMAScript 2018.
- Recommends `node ^10.13.0` / `npm ^6.4.1`.

No runtime behavior changed in this release.

## 0.3.0 - 2017-09-12

### Breaking changes

**The `babel-runtime` runtime dependency was removed.** Babel's `transform-runtime` plugin was dropped in favor of targeting the running Node.js version directly, so the package no longer pulls `babel-runtime` into your dependency tree. This package now has no runtime dependencies outside the Isotropic family.

### Changed

- ESLint configuration moved from `eslint-config-isotropic` to the `plugin:isotropic/isotropic` shared config provided by `eslint-plugin-isotropic`.
- `isotropic-prototype-chain` bumped to `~0.6.0`.
- Recommends `node ^8.4.0` / `npm ^5.4.1`.

No runtime behavior changed in this release.

## 0.2.0 - 2017-02-05

### Changed

- Dependency bumps.
- Recommends `node ^6.9.5` / `npm ^4.1.2`.

No runtime behavior changed in this release.

## 0.1.0 - 2017-01-08

Initial release.

- Exports three generator functions that walk a prototype chain while descending into any mixins declared along the way, as named exports: `mixinPrototypeChainFromInstanceObject`, `mixinPrototypeChainFromPrototypeObject`, and `mixinPrototypeChainFromStaticObject`.
- `mixinPrototypeChainFromStaticObject` walks the static chain of a constructor, stopping before `Object`, and recurses into each entry of a constructor's `mixins` array.
- `mixinPrototypeChainFromPrototypeObject` walks a prototype chain, stopping before `Object.prototype`, and yields the prototypes of each mixin found on `constructor.mixins`.
- `mixinPrototypeChainFromInstanceObject` yields the instance itself, then delegates to `mixinPrototypeChainFromPrototypeObject`.
- Depends on `isotropic-prototype-chain` and `babel-runtime`.
- Recommends `node ^6.9.4` / `npm ^4.1.1`.
