# `no-unsafe-no-exposure`

Warns against using `UNSAFE_noExposureExp` from feature-experimenting packages (e.g. `@adminhub/feature-experimenting`, `@atlassian/jira-feature-experiments`).

## Why

`UNSAFE_noExposureExp` defers the Statsig exposure event to a manually triggered `fireExposure()` callback. This makes it easy to:

- Forget to fire the exposure event entirely, causing gaps in experiment data
- Fire it at the wrong time, skewing results

The recommended alternatives are `expVal` and `expValEquals`, which fire exposure automatically when the experiment value is read.

## Rule details

### ❌ Incorrect

```js
import { UNSAFE_noExposureExp } from '@adminhub/feature-experimenting';

const value = UNSAFE_noExposureExp('my_experiment', 'variant', 'control');
```

### ✅ Correct

```js
import { expVal } from '@adminhub/feature-experimenting';

const value = expVal('my_experiment', 'variant', 'control');
```

## When `UNSAFE_noExposureExp` is intentional

If you genuinely need deferred exposure (e.g. the experiment value is read before the user has been shown the experience), add an `eslint-disable-next-line` comment on the line **before the call** with a documented reason:

```js
// eslint-disable-next-line @atlaskit/platform/no-unsafe-no-exposure -- exposure is fired manually in onComponentMount after the UI is shown
const value = UNSAFE_noExposureExp('my_experiment', 'variant', 'control');
```
