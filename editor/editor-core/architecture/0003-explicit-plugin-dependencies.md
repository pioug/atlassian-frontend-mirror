# 3. Explicit Plugin Dependencies

Date: 2023-04-06

## Status

Accepted

## Context

Editor plugins are extremely dependent on each other, and import from each other.

Sometimes to the point of having circular dependencies.

This has many massive side effects, to name just a few:

- Complexity!
  - devs not being able to clearly reason about the implicit dependencies between plugins
  - extremely difficult to ship features, bug fixes, without breaking something unintended or even unrelated
- Performance!
  - products not being able to integrate a lighter weight of the Atlassian Editor
  - single bundle size whether you only use a handful of features in a small Editor, or the entire weight of the Full Page Editor

We learned from the [table extraction effort](https://product-fabric.atlassian.net/wiki/spaces/E/pages/3289779107/Editor+DACI+019+Bring+Tables+back) that it was feasible to extract and untangle one of our most complex Editor Plugins, with some temporary APIs to prevent cross importing.

## Decision

We must now prevent plugins from importing one another to reduce complexity within the Editor. In doing so, we can eliminate intricate dependency chains and, using the `getSharedState()` and `actions()` APIs, offer a clear understanding of how different plugins share their state.

Although making this choice is essential, the aim is to address the initial necessity for cross imports to begin with by outlining some "migration examples" and documentation below. This ADR outlines two of the APIs that are now in place, to address some of the challenges and insights gained from the initial table plugin extraction.

### Prevention

Linting errors will now be present for any new code that gets added, where we continue to attempt importing from one plugin into another. (See `ELR101`, `ELR102` in `repo-docs/content/cloud/framework/atlassian-frontend/editor/lint.md`).

### Other resources

- https://product-fabric.atlassian.net/wiki/spaces/EA/pages/3097395592/EXPLORE+Project+Poster+Composable+Editor+prev+Architecture+V3
- https://product-fabric.atlassian.net/wiki/spaces/EA/pages/3308192650/Composable+Editor+Table+Extraction
- https://product-fabric.atlassian.net/wiki/spaces/EA/pages/3352725568/MAKE+Project+Poster+Editor+Scalability
- https://product-fabric.atlassian.net/wiki/spaces/E/pages/3350692271/Editor+RFC+028+Composition+EditorPlugin+Dependency+Injection

## Consequences

Devs will need to stop importing from one plugin into another, and eventually be blocked on it when we upgrade the lint error from warning to erroring.

We are mitigating this, by presenting some samples of how to quickly migrate / "turn on" a plugin into utilising the new `actions()` and `getSharedState()` APIs in EditorPlugin.

A brief "HOWTO" / "HOW TO" guide of how you can migrate existing or new "cross imports", and get the same functionality:

## 1. `getSharedState()` (and `useSharedPluginState()` hook for React Components)

**Problem**: Let's say you want to access the state from `Foo` plugin, into a second Plugin `Bar`. Something like `previouslyInternalStateA`. Previously, you needed to import that plugin key, and then use it. Now we can use `getSharedState()` and 2 methods `currentState()` & `onChange` methods on `api.dependencies.[plugin-name].sharedState`.

### **Before**

**Implicit state dependency**, you are using `Foo` plugin internals from `Bar` plugin.

```ts
// editor-core/src/plugins/bar-plugin/index.ts
import { pluginKey as internalFooPluginKey } from '../plugins/foo/pm-plugins/some-internal-to-foo-prosemirror-plugin';
//...
const previouslyInternalStateC = internalFooPluginKey.getState(view.state);
doSomethingBasedOnAnotherPluginInternalState(previouslyInternalStateC);
///...
```

### **After**

**Explicit state dependency**, `Foo` plugin "pushes" out, explicitly publicly, shares state surfaced from `internalFooPlugin` prosemirror state internals, for _any_ plugin to use.

### Usage inside general `EditorPlugin` and prosemirror plugins:

```ts
// editor-core/src/plugins/bar-plugin/index.ts

// Note that this type import can come from a fully extracted plugin, or from a plugin inside editor-core. Cross importing _types_ is OK at this stage
import type { fooPlugin } from '@atlaskit/editor-plugin-foo';
// import type { fooPlugin } from '../../src/plugins/editor-plugin-foo/index.ts';

const barPlugin: NextEditorPlugin<
  'bar',
  {
    pluginConfiguration: BarPluginOptions | undefined;
    dependencies: [typeof fooPlugin];
  }
> = (options, api) => {
  const {
    nowExplicitStateA,
    nowExplicitStateB,
    nowExplicitStateC
  } = api?.dependencies?.foo?.sharedState.currentState();

  return {
    name: 'bar',
    pmPlugins() {//... use nowExplicitStateA
    }
    nodes() {...}
    marks() {...}
    contentComponent() {//... use nowExplicitStateB
    }
    primaryToolbarComponent() {//... use nowExplicitStateC
    }
  }
}
```

### New `getSharedState()` to expose all explicitly shared state from plugin `Foo`

```ts
// editor-core/src/plugins/foo-plugin/index.ts
const fooPlugin: NextEditorPlugin <...> {
  getSharedState(editorState) {
    if (!editorState) {
      return {
        nowExplicitStateA: null,
        nowExplicitStateB: false,
        nowExplicitStateC: "and so on"
      };
    }

    const { nowExplicitStateA, nowExplicitStateB, nowExplicitStateC } =
      selfInternalPluginKey.getState(editorState);

    return {
      nowExplicitStateA,
      nowExplicitStateB,
      nowExplicitStateC,
    };
  }
}
```

### **The "new parts" again:**

```diff
// editor-core/src/plugins/bar-plugin/index.ts
- import { pluginKey as internalFooPluginKey } from '../plugins/foo/pm-plugins/some-internal-to-foo-prosemirror-plugin';

  // Note that this type import can come from a fully extracted plugin, or from a plugin inside editor-core. Cross importing _types_ is OK at this stage
+ import type { fooPlugin } from '@atlaskit/editor-plugin-foo';
  // import type { fooPlugin } from '../../src/plugins/editor-plugin-foo/index.ts';

  const fooPlugin: NextEditorPlugin<
    'bar',
    {
      pluginConfiguration: SomePluginOptions | undefined;
+     dependencies: [typeof fooPlugin];
    }
  > = (options, api) => {
    const {
+     nowExplicitStateA,
+     nowExplicitStateB,
+     nowExplicitStateC,
+   } = api?.dependencies?.foo?.sharedState.currentState();

    return {
      name: 'bar',
+     pmPlugins() {//... use nowExplicitStateA
        // deeper inside the pm plugins...
-       const previouslyInternalStateC = internalFooPluginKey.getState(view.state);
      }
      nodes() {...}
      marks() {...}
+     contentComponent() {//... use nowExplicitStateB
      }
+     primaryToolbarComponent() {//... use nowExplicitStateC
      }
    }
  }
```

### Usage inside a React component

(See date plugin at `packages/editor/editor-plugin-date/src/plugin.tsx` for a full code sample of using `useSharedPluginState`)

```ts
// editor-core/src/plugins/bar-some-react-component-based-plugin/index.tsx
function SomeBarComponent({ dependencyApi }) {
  const { fooState } = useSharedPluginState(
    dependencyApi,
    ['foo'],
  );
  const { nowExplicitStateA, nowExplicitStateB, nowExplicitStateC } = fooState;
}

const barPlugin: NextEditorPlugin<
  'bar',
  {
    pluginConfiguration: BarPluginOptions | undefined;
    dependencies: [typeof fooPlugin];
  }
> = (options, api) => {
  return {
    name: 'cat',
    pmPlugins() {}
    contentComponent() {
      return <SomeBarComponent dependencyApi={api} />
    }
  }
}

```

Important parts to note:

1. You will need to implement a new `getSharedState()` function inside the current `EditorPlugin` that you require the state from, to expose any "public state" that you would like to make available to other plugins. **Treat this state as "public API" for other plugins**, as any plugin will be able to depend on this and react to it.

2. You _may_ need to update `packages/editor/editor-core/src/labs/next/presets/universal.ts`, if you are creating a new EditorPlugin to depend on.

3. Anywhere where we used to use `WithPluginState` and import plugin keys, you can now use `useSharedPluginState`

## 2. `actions()`

For a full code sample, please see `actions()` implementation in https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31264?w=1#chg_packages/editor/editor-core/src/plugins/analytics/plugin.ts_newline116

Our first attempt with actions, was on the analytics plugin, which touches almost all plugins and surfaced some other issues. However the same approach can be applied at a smaller scale, for smaller plugins that have "cross action dependencies".

**Problem**: Let's say you had an "`addAnalytics()`" action, used in the `Foo` plugin, and wanted to use it inside of a second, `Bar` plugin.

### **Before**

Again, cross importing from `Foo` plugin, into `Bar` plugin:

```ts
// editor-core/src/plugins/bar-plugin/index.tsx
import { addAnalytics } from "../foo-plugin/pm-plugins/actions";

const barPlugin: NextEditorPlugin<
  'bar'
> = () => ({
  someBarPluginCode() {
    addAnalytics();
  }
}
```

### **After**

```ts
// editor-core/src/plugins/foo-plugin/index.tsx
const fooPlugin: NextEditorPlugin<
  'foo',
  {
    dependencies: [typeof fooPlugin],
  }
> = (options, api) => ({
  actions() {
    addAnalytics() {
      // Do something
      // return something
    }
  }
}
```

```ts
// editor-core/src/plugins/bar-plugin/index.tsx
import type { default as fooPlugin } from "../foo-plugin";

const barPlugin: NextEditorPlugin<
  'bar',
  {
    dependencies: [typeof fooPlugin],
  }
> = (options, api) => ({
  someBarPluginCode() {
    api.externalPlugins?.foo?.actions?.addAnalytics();
  }
}
```

### **The "new parts" again:**

```diff
// editor-core/src/plugins/bar-plugin/index.tsx
-  import { addAnalytics as crossImportedAddAnalytics } from "../foo-plugin/pm-plugins/actions";
+  import type { default as fooPlugin } from "../foo-plugin";

  const barPlugin: NextEditorPlugin<
    'bar',
    {
+     dependencies: [typeof fooPlugin],
    }
  > = (options, api) => ({
    someBarPluginCode() {
-     const addAnalytics = crossImportedAddAnalytics;
+     const addAnalytics = api.externalPlugins?.foo?.actions?.addAnalytics();
    }
  }
```
