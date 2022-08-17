# Deferred loading

If you want to, you can _dynamically load_ in `@atlaskit/drag-and-drop` at a point after the page is interactive.

Deferring the loading of `@atlaskit/drag-and-drop` has some advantages:

- faster page loads
- the ability to load in drag and drop behaviour when it is needed, rather than in the critical bundle

There are also some drawbacks:

- Additional complexity as you are no longer simply importing a module and using it (largely mitigated with `@atlaskit/async`)
- Potential to miss an interaction: let's say a user starts trying to drag before `@atlaskit/drag-and-drop` is ready, then the user would not be able to perform a drag operation. You can add some instrumentation to detect when these 'misses' occur for your experience if you like.

Given `@atlaskit/drag-and-drop` is tiny, the benefits of dynamic loading might not outweigh the costs. That said, it is worth giving a go! Anything we can do to speed up page loads is a good thing.

<details>
  <summary>General background on dynamic imports</summary>

Modern bundles often support _dynamic imports_; which sounds scary, but really it is just this:

```ts
import('module-name').then(module => {
  // use the module
});

// or using await
const module = await import('@atlaskit/drag-and-drop/element');
```

You can use dynamic imports to do things like deferring the import of a module until a `react` useEffect

```ts
useEffect(() => {
  let isActive = true;
  // could also use an `AbortController` if your bundler supports it
  import('@atlaskit/drag-and-drop/adapter/element').then(module => {
    if(!isActive) {
      return;
    }
    // do something with module
  }
  return () => {
    isActive = false;
  }
}, [])
```

- [Webpack: lazy loading](https://webpack.js.org/guides/lazy-loading/)
- [Parcel: dynamic imports](https://parceljs.org/features/code-splitting/)

Note: we don't recommend using these techniques directly. We have created `@atlaskit/async` to handle a lot of the complexity, performance and edge cases in this space.

</details>

Atlassian has some wrappers for working with dynamic imports which we recommend that you use:

[`@atlaskit/async/react-async`]

TODO: document!!! this is epic!!
