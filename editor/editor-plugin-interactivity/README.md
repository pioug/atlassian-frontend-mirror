# Editor Plugin Interactivity

Interactivity plugin for @atlaskit/editor-core

**Note:** This component is designed for internal Atlassian development. External contributors will
be able to use this component but will not be able to submit issues.

## Overview

The Interactivity plugin reports the `editor interactivity` operational event: session-to-date
interaction latency distributions for full page editor sessions, per
[RFC 095](https://hello.atlassian.net/wiki/spaces/EDITOR/pages/7527607488/Editor+RFC+095+Confluence+editor+responsiveness+bucketed+INP+telemetry).
Signals that report one value per session cannot answer how many interactions were slow, so this
plugin keeps bucketed counts instead.

## What it reports

- `page` — every interaction on the page, as `totalCount`, `observedCount`, `sumMs`, `maxMs`,
  `buckets` and `percentilesMs`. `totalCount` comes from `performance.interactionCount` and includes
  interactions below the 16 ms Event Timing reporting threshold, so `totalCount - observedCount` is
  the sub-threshold count. `percentilesMs` ranks over `totalCount`, as INP does, so a percentile that
  falls among the sub-threshold interactions reads as 16.
- `editorTyping`, `editorPointer` and `editorOther` — the interactions with the editor, in the same
  shape as `page`. Event Timing observes the whole document, so `page` alone cannot say whether a
  regression is in the editor or elsewhere on the page; these can. Every interaction with the editor
  is in exactly one of them, and in `page` as well.
- `editor` — the three editor groups as one, in the same shape: the per-session p98 of the editor as
  a whole, which theirs cannot give.
- `percentilesMs` — percentiles of the same interactions, keyed by percentile and exact to the 8 ms
  Event Timing reports durations at; a per-session metric reads these rather than `buckets`.
- Bucket keys are the upper boundary of the bucket in milliseconds and count only interactions above
  the previous boundary. Buckets are not cumulative and empty buckets are omitted, so a missing
  bucket means zero. The boundaries are versioned by `schema`.
- Snapshots are session-to-date, so a cohort query takes the highest `seq` per
  `interactivitySessionId` and then sums bucket counts.

## The editor groups

An interaction is the editor's when it happened inside the element the editor renders itself into,
which editor-core hands to the plugin's hook as `wrapperElement`. A second observer reports the
events of those interactions from that element, alongside the Event Timing observer that reports the
latencies, and the tracker makes interactions out of both.

The editor's events are what count the interactions, because there is no
`performance.interactionCount` per group and the 16 ms reporting threshold is the lowest the spec
allows. An interaction is several events, so it is counted on one of them: typing on `keydown`,
because a held key repeats and the browser counts every repeat; pointing on `pointerup`, because a
press taken over by a scroll never gets one — and the browser counts no interaction for it either.
The group comes from the same events, and the one table in `interaction-events.ts` is read for both
counting and grouping, so the two cannot disagree.

An entry lands in the group of the event it measured, matched by that event's type and timestamp. An
interaction whose events the editor never reported stays in `page` only.

Known gaps, all of which only move interactions out of the editor groups and never between them:

- What the editor renders outside that element — a dropdown or a dialog in a portal — is counted in
  `page` only, as is everything before the element arrives, a render after the editor first paints.
- `editorOther` is the remainder slot: the browser counts only keyboard and pointer interactions
  today, so it reads zero until that changes.
- While an IME composes, the browser can group key presses into fewer interactions than we count, so
  `editorTyping.totalCount` can run ahead of it.

## Cadence

Snapshots are taken 10 s, 30 s and 60 s after the session starts, then every 60 s, plus on every
transition of the tab to hidden, on `pagehide` and on editor unmount. A snapshot that would repeat
the previous one is skipped, and signals from one lifecycle transition are coalesced into a single
snapshot.

## Sessions

A session covers one document in one mode, so its latencies are always comparable with each other.
It normally lasts an editor mount, but it also ends while the editor stays mounted when either of
those changes — Confluence live pages navigate and switch between reading and editing without
remounting the editor. That is reported as `reason: 'navigation'` or `reason: 'modeChange'`, and the
next session starts with a new `interactivitySessionId`. Sessions of one editor mount share an
`editorSessionId`, which is what stitches them back together.

## Install

---

- **Install** - _yarn add @atlaskit/editor-plugin-interactivity_
- **npm** -
  [@atlaskit/editor-plugin-interactivity](https://www.npmjs.com/package/@atlaskit/editor-plugin-interactivity)
- **Source** -
  [Bitbucket](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/editor/editor-plugin-interactivity)
- **Bundle** - [unpkg.com](https://unpkg.com/@atlaskit/editor-plugin-interactivity/dist/)

## Usage

---

**Internal use only**

@atlaskit/editor-plugin-interactivity is intended for internal use by the @atlaskit/editor-core and
as a plugin dependency of the Editor within your product.

Direct use of this component is not supported.

Please see
[Atlaskit - Editor plugin interactivity](https://atlaskit.atlassian.com/packages/editor/editor-plugin-interactivity)
for documentation and examples for this package.

## Support

---

For internal Atlassian, visit the slack channel
[#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit
[go/editor-help](https://go/editor-help) to submit a bug.

## License

---

Please see
[Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License)
for more licensing information.
