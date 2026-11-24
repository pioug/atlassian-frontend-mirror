# INP Collector

Collects the latencies of every interaction with a page, and again of the interactions with named
regions of it, as session-to-date distributions. INP is one percentile of them; the distribution
also answers how many interactions were slow, which a single value per session cannot. See
[RFC 095](https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7527607488/Editor+RFC+095+Confluence+editor+responsiveness+bucketed+INP+telemetry).

**Note:** This component is designed for internal Atlassian development. External contributors will
be able to use this component but will not be able to submit issues.

## Entry points

| Entry point                                  | What it has                                             |
| -------------------------------------------- | ------------------------------------------------------- |
| `@atlaskit/inp-collector/interactivity-collector` | `InteractivityCollector` and the types of its options |
| `@atlaskit/inp-collector/react`              | `useInteractivityRegionElement`                         |
| `@atlaskit/inp-collector/types`              | the snapshot and the other types an owner reads         |

## Create a collector

```ts
import { InteractivityCollector } from '@atlaskit/inp-collector/interactivity-collector';

const collector = new InteractivityCollector({
	regions: ['board', 'sidebar'],
	endReasons: ['navigation', 'unmount'],
	sessionKeys: { pageId: readPageId() },
	onError: (error) => reportError(error),
	emit: (snapshot, { immediate }) => sendEvent(snapshot, { immediate }),
});

collector.start(); // false when the browser has no Event Timing with `interactionId`
// …
collector.stop({ endReason: 'unmount' });
```

The constructor touches nothing of the page, so it can run while rendering. `start` and `stop` bound
the collecting, and every `start` opens a new session.

Regions, end reasons and session keys are written out as literals: their names become the types of
`region()`, `stop()`, `setSessionKeys()` and the snapshot, so a misspelt name does not compile. A
`string[]` or a `Record<string, …>` built at runtime does not compile either, because with it any
string would pass.

## Regions

A region is a part of the page whose interactions are counted on their own, on top of `page`. It is
made of elements, which its owner adds and removes:

```ts
const removeElement = collector.region('board').addElement(boardElement);
```

From React, the hook adds the element for as long as both stay the same:

```tsx
import { useInteractivityRegionElement } from '@atlaskit/inp-collector/react';

const [element, setElement] = useState<HTMLElement | null>(null);
useInteractivityRegionElement({ region: collector.region('board'), element });
return <div ref={setElement}>…</div>;
```

An interaction with two regions is counted in each of them. What renders outside the region's
elements, such as a portal, is counted in `page` only, as is everything before an element arrives.

## Session keys

A session covers one value of each session key, so its latencies are comparable with each other.
`undefined` means not known yet:

```ts
collector.setSessionKeys({ values: { pageId: nextPageId }, endReason: 'navigation' });
```

The first known value fills the session in; a different one ends it with `endReason` and opens the
next. A key's type is that of its initial value, so a key not known yet needs a type that also
allows the known ones, such as a function returning `string | undefined`.

## Snapshots

`emit` receives a session-to-date snapshot:

- `interactivitySessionId`, `seq`, `schema`, `activeMs`, `hiddenMs` and `sessionKeys`.
- `reason`: `timer`, `hidden` or `pagehide` for a session that goes on, or one of the owner's end
  reasons for its last snapshot.
- `page`: every interaction on the page. `regions.<name>`: the interactions with that region, as
  `all` and by kind, `typing`, `pointer` and `other`.

Each group has `totalCount`, `observedCount`, `sumMs`, `maxMs`, `buckets` and `percentilesMs`:

- `totalCount` includes interactions below the 16 ms Event Timing reporting threshold, so
  `totalCount - observedCount` is the sub-threshold count. `page` takes it from
  `performance.interactionCount`; a region counts its own.
- `percentilesMs` ranks over `totalCount`, as INP does, so a percentile that falls among the
  sub-threshold interactions reads as 16. They are exact to the 8 ms Event Timing reports at.
- `buckets` are keyed by each bucket's upper boundary in milliseconds and are not cumulative. Empty
  buckets are omitted, so a missing bucket means zero. The boundaries are versioned by `schema`.

Snapshots are session-to-date: a query takes the highest `seq` per `interactivitySessionId`, then
sums bucket counts across sessions.

`immediate` says the snapshot cannot wait for an idle moment, because the page or the owner may not
be there later: it is true on `hidden`, `pagehide` and every stop.

## Cadence

Snapshots are taken 10 s, 30 s and 60 s after the session starts, then every 60 s, plus when the tab
becomes hidden, on `pagehide`, when the session ends and on `stop`. A snapshot that would repeat the
previous one is skipped, and the signals of one lifecycle transition make one snapshot.

## How interactions are counted

A second observer reports the events of the interactions from each region's elements, alongside the
Event Timing observer that reports the latencies. There is no `performance.interactionCount` per
region, so a region counts its interactions from those events: typing on `keydown`, because a held
key repeats and the browser counts every repeat; pointing on `pointerup`, because a press taken over
by a scroll never gets one, and the browser counts no interaction for it either. An entry lands in
the region of the event it measured, matched by that event's type and timestamp.

Known gaps, all of which only move interactions out of a region and never between its kinds:

- `other` is the remainder: the browser counts only keyboard and pointer interactions today, so it
  reads zero until that changes.
- While an IME composes, the browser can group key presses into fewer interactions than a region
  counts, so its `typing.totalCount` can run ahead of it.

## Errors

The collector never throws at what it is handed. An undeclared region, session key or end reason
from an untyped caller, a reserved end reason, or an `emit` that threw goes to `onError` instead,
each once per collector, and the collector carries on.

## Support

For internal Atlassian, visit the slack channel
[#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit
[go/editor-help](https://go/editor-help) to submit a bug.

## License

Please see
[Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License)
for more licensing information.
