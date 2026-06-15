## General

In your language in comments, and user facing copy, please avoid em-dashes and contractions (prefer
"do not" over "don't")

## TypeScript authoring patterns:

- Avoid `any`. Always look for opportunities to have more accurate types
- Avoid `switch` statements, prefer `if` statements in functions with early returns
- Avoid conditional assignment of variables. (Use functions, IIFE, etc. to avoid needing to use
  `let`)
- Avoid nested ternaries. Extract to a function with early returns instead.
- Prefer explicit conversions for types (e.g. `Boolean(value)` and not `!!value` for booleans,
  `Number(value)` for numbers, and `String(value)` for strings. For strings you can also use
  template literals)
- Never use `for` with missing parameters, e.g. `for(;;)`. Use other clearer patterns (`while(true)`
  in this case)
- Prefer function definitions `function getName(){}` over function assignment
  `const getName = function(){}`.
- Do not author `class`. For stateful constructs, use a factory function that closes over its state
  and returns a plain object (e.g. `createClaudeClient({ apiKey })` instead of
  `new ClaudeClient(apiKey)`). Third-party classes you must instantiate (e.g. SDK clients) are fine
  to `new` inside the factory.
- Prefer inline exports (`export function`, `export const`) over grouped `export { ... }` blocks at
  the bottom of a file. This is also true for default exports (eg
  `default export function hello(){}`)
- Prefer discriminated unions for result types `{type: 'error', message: string}` over
  `{error: true, message?: string}`
- Avoid the `void` keyword: do not use `void` as a return type annotation (use explicit return types
  or omit), and do not use the `void` operator (e.g. `void someExpression()`). You can use
  `Promise<void>` though.
- For functions that might return values, prefer functions that return an explicit `null` over
  `undefined`.
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
- Avoid abbreviated variable names. Use descriptive names that read clearly (e.g. `transaction` not
  `tx`, `user` not `u`, `config` not `cfg`, `event` not `e`). This applies to all variables
  including lambda/callback parameters. Exceptions: `ctx` for canvas/React contexts, and `a`/`b` in
  sort comparators.
- For unused parameters or variables, prefix with `_` (e.g. `(_, index) => ...`, or `_unusedName` if
  a descriptive marker reads better). ESLint accepts this via `argsIgnorePattern: '^_'`. Do not
  invent placeholder names like `unused`.
- When making functions that return booleans, always prefer function names that express a positive.
  `function isValidUser():boolean {}` and not `function isInvalidUser(): boolean {}`
- Prefer TypeScript `type` over `interface` unless there is functionality that requires an
  `interface`

## In code comments

- Place comments on the line directly above the code they describe. Never place comments to the
  right of code on the same line.
- Code comments should be minimal, clear and accurate
- Add code comments for anything that is non-obvious by looking at the code
- Use `// comment` for single-line comments. Use JSDoc-style for multi-line documentation comments
  (markdown is encouraged inside)
- Do not use decorative separator comments (e.g. `// ── Section ──`, `// ───────...`). Use a plain
  `// Section` comment instead or JSDoc blocks for larger comments:

  ```ts
  /**
   * **Bold title**
   *
   * Some more content goes here
   */`
  ```

## React rules

- Always use named functions for components (eg `export function App() {})`
- Prefer discriminated unions to model state, rather than having disconnected pieces of state. This
  is the React embodiment of the discriminated unions rule in the TypeScript section above
- Do not add `className` or `style` props to components as they are unbounded APIs
- `forwardRef` is needed as this is a `react@18+` project.

```ts
// Do not do this:
const [isLoading, setIsLoading] = useState(false);
const [loaded, setLoaded] = useState(false);

// Prefer discriminated unions, which makes illegal states impossible:
type TState =
	| { type: 'idle' }
	| {
			type: 'loading';
	  }
	| {
			type: 'loaded';
	  };
const [state, setState] = useState<TState>({ type: 'idle' });
```

- Do not export class name strings from files (e.g. no `export const cardClasses = '...'`)
- Never call a function from a parent context (e.g. a context action, a prop callback) during render
  to update that parent's state. This causes React's "Cannot update a component while rendering a
  different component" error. Use `useEffect` instead. Updating local state during render (the
  getDerivedStateFromProps pattern) is fine.
- If a react component needs to return a type, it should be `ReactNode` and not a JSX type.

## Versioning

This package is still on `0.x` releases. All changes should be a `minor` (`0.x`) release.
