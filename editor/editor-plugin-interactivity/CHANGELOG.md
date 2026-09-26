# @atlaskit/editor-plugin-interactivity

## 7.0.0

### Patch Changes

- Updated dependencies

## 6.0.0

### Patch Changes

- Updated dependencies

## 5.0.0

### Patch Changes

- Updated dependencies

## 4.0.1

### Patch Changes

- [`a069fe25a55ec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a069fe25a55ec) -
  Remove the `slowest` records from the `editor interactivity` event. The event now carries the
  histograms only: `page`, `editor`, `editorTyping`, `editorPointer` and `editorOther`.

  Everything that existed only to produce those records is gone with them: the Long Animation Frame
  observer, the document-wide capture listener that kept event paths so a target could be named, and
  the paint layer in the tracker that divided a latency into input delay, processing and
  presentation. No histogram read any of it, so every count, bucket and percentile stays as it was.
  The `platform_editor_editor_interactivity_slowest` experiment is no longer read.

- Updated dependencies

## 4.0.0

### Patch Changes

- Updated dependencies

## 3.0.2

### Patch Changes

- [`d9ff5475c7537`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d9ff5475c7537) -
  Drop interactions the user started before the session from the `editor interactivity` event. Event
  Timing produces the entry for an event after the paint that presented it, so the click on Edit
  whose handler mounts the editor is reported to an observer that only subscribed while that handler
  ran, and `buffered: false` does not keep it out. Nothing of the session saw that event, so it was
  counted in `page` with no group and no target, and it set `page.maxMs` of half of the classic edit
  sessions to the time the editor took to mount rather than to an interaction of the session.
- Updated dependencies

## 3.0.1

### Patch Changes

- [`83f3f6b294471`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/83f3f6b294471) -
  Name the `target` of the `slowest` records in the `editor interactivity` event from the path of
  the event as it was dispatched, rather than from the Event Timing entry, whose `target` is `null`
  once the handlers of the interaction have removed the element. Behind the
  `platform_editor_editor_interactivity_slowest` experiment.
- Updated dependencies

## 3.0.0

### Patch Changes

- Updated dependencies

## 2.0.0

### Patch Changes

- Updated dependencies

## 1.3.0

### Minor Changes

- [`49ec73019afa7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/49ec73019afa7) -
  Add an `editor` group to the `editor interactivity` event: the three editor groups as one, in the
  same shape, so the session p98 of the editor as a whole can be read from `editor.percentilesMs`.

### Patch Changes

- [`58e0ed4f4c98f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/58e0ed4f4c98f) -
  Rank `percentilesMs` in the `editor interactivity` event over `totalCount` rather than
  `observedCount`, so the interactions below the Event Timing reporting threshold count towards the
  percentile as they do for INP. A percentile that falls among them is reported as the
  threshold, 16.

## 1.2.1

### Patch Changes

- [`f1f320e43a22e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f1f320e43a22e) -
  Ignore untrusted events in the `editor interactivity` collector, so events a script dispatched are
  no longer counted as interactions with the editor.
- Updated dependencies

## 1.2.0

### Minor Changes

- [`1b78d9e80b1bd`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1b78d9e80b1bd) -
  Say where the latency of the slowest interactions went in the `editor interactivity` event, from
  the Long Animation Frames they ran in and the way `web-vitals` attributes INP. `longestScriptMs`,
  `functionName`, `scriptName`, `invokerType` and `scriptSubpart` describe the script that ran the
  longest while the user waited, and `totalScriptDurationMs`, `totalStyleAndLayoutDurationMs`,
  `totalPaintDurationMs` and `totalUnattributedDurationMs` divide the latency between script, style
  and layout, paint, and what the frames explain nothing about. Behind the
  platform_editor_editor_interactivity_slowest experiment.

### Patch Changes

- Updated dependencies

## 1.1.0

### Minor Changes

- [`ccd1b52723728`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ccd1b52723728) -
  Report the slowest interactions of the session in the `editor interactivity` event — their group,
  event type, latency, timing phases and a sanitised target — so a regression the histograms show
  can be traced to what was interacted with. Behind the platform_editor_editor_interactivity_slowest
  experiment.

## 1.0.0

### Patch Changes

- Updated dependencies

## 0.3.0

### Minor Changes

- [`355d6f13eb8b4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/355d6f13eb8b4) -
  Report the `editorTyping`, `editorPointer` and `editorOther` interaction histograms in the
  `editor interactivity` event, so a responsiveness regression in the editor can be told apart from
  one elsewhere on the page.

### Patch Changes

- Updated dependencies

## 0.2.0

### Minor Changes

- [`fc88b1544be96`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fc88b1544be96) -
  Report the `editor interactivity` operational event: how interaction latencies were spread over an
  editor session, as bucketed counts, for the Confluence full page editor. Behind the
  platform_editor_editor_interactivity experiment.

### Patch Changes

- Updated dependencies

## 0.1.0

### Minor Changes

- [`40071c3a1e51d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/40071c3a1e51d) -
  Add the interactivity plugin package and register it in the Confluence full page presets behind
  the platform_editor_editor_interactivity experiment. The plugin is a stub for now — it collects
  nothing.

### Patch Changes

- Updated dependencies
