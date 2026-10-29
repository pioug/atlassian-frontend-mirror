Keep legacy `getBooleanFF` calls inline in their consuming conditional, with a literal flag name.
Evaluate them inside the function that needs the result. Preserve existing imports and targeting;
do not cache the evaluated result while the module loads.

## Incorrect

```js
function runAction() {
	const enabled = getBooleanFF('my_gate');
	if (enabled) {
		performAction();
	}
}
```

## Correct

```js
function runAction() {
	if (getBooleanFF('my_gate')) {
		performAction();
	}
}
```

For independent gates, use separate or nested conditionals while preserving short-circuit behavior.
For a gate precondition, follow `../feature-gating/no-preconditioning/README.md` instead of changing
experiment exposure semantics by trial and error. New boolean gate code uses `fg` from the supported
Platform feature-flag module; migrate imports and calls together.
