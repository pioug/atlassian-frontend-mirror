## TypeScript authoring patterns:

- Avoid `any`. Always look for opportunities to have more accurate types
- Avoid `switch` statements, prefer `if` statements in functions with early returns
- Avoid conditional assignment of variables. (Use functions, IIFE, etc. to avoid needing to use
  `let`)
- Prefer explicit conversions for types (e.g. `Boolean(value)` and not `!!value` for booleans,
  `Number(value)` for numbers, and `String(value)` for strings. For strings you can also use
  template literals)
- Never use `for` with missing parameters, e.g. `for(;;)`. Use other clearer patterns (`while(true)`
  in this case)
- Prefer function definitions `function getName(){}` over function assignment
  `const getName = function(){}`.
- Prefer inline exports (`export function`, `export const`) over grouped `export { ... }` blocks at
  the bottom of a file
- Prefer discriminated unions for result types `{type: 'error', message: string}` over
  `{error: true, message?: string}`
- Avoid the `void` keyword: do not use `void` as a return type annotation (use explicit return types
  or omit), and do not use the `void` operator (e.g. `void someExpression()`). You can use
  `Promise<void>` though.
- For functions that might return values, prefer functions that return an explicit `null` over
  `undefined`.
- Prefer `type` over `interface` where possible
- For function parameters, prefer named arguments (e.g. a single destructured options object) over
  positional parameters, even for single-parameter functions
- Avoid regex when a clearer approach exists; use it when it would greatly simplify things.
- If a module needs a helper function, put it above the caller. Ideally do not rely on hoisting
- Always use blocks for conditions, do not do inline conditionals like
  `if(condition) doSomething();`
- Do not use non null assertions (e.g. `value!.condition`). Use `invariant` from `tiny-invariant`
  (if the value should be there), or optional chaining (if it legitimately could be `null`)
- When adding listeners to raw `EventTarget` objects (outside JSX), use `bind-event-listener`
- When a function has cleanup actions (unsubscribe, cancel, teardown), return a cleanup function
  (`TCleanupFn` from `@/types`). This mirrors the `useEffect` cleanup pattern
- Use optional chaining
- For arrays, prefer array methods (eg `map`, `filter` and `reduce`) over manual looping
- Start type names with a `T` to make it clear they are types.
