# Editor plugin external state

Holds editor settings that are stored outside ADF, such as numbered headings. A product passes an
`ExternalStateProvider` that loads, saves and syncs the values; other plugins read them with
`getState` and follow changes with `getStateChange`.

- `getInitialState` is read once when the plugin is created, over the `initialState` defaults.
- `subscribe` is called when the editor view is created. Emitted values that differ from the
  current values are applied in one transaction.
- `saveState(key, value)` updates editor state first, then calls `updateState`. When the save
  rejects, the value reverts to the last confirmed value, unless it changed again in the meantime.
  It resolves `true` when saved and `false` when the save failed.
- `setState(key, value)` changes editor state only.

Changes are transaction metadata only: they are not added to undo history and create no collab
steps. Without a provider, values live in editor state only.

Saves for a key run one at a time, in order. Requests made while a save runs collapse into the
latest one, so quick toggles send only what's needed and an older value can't land after a newer
one. While a save runs, provider updates for that key are recorded but don't change the editor.
Providers should emit only changes from other sources, and not echo the editor's own saves. When a provider knows the stored value after a save (another source's write may have landed
after it), `updateState` can resolve with `{ value }`; the editor shows that value once its saves
for the key finish.
