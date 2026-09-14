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
- `slowest` — up to five of the slowest interactions of the session, slowest first. See below.

## The slowest interactions

The histograms count how many interactions were slow. They cannot say what was interacted with, so
a regression they show cannot be diagnosed from telemetry alone. Each record carries the group and
the event type, the latency, the phases it divides into — input delay, processing, presentation
delay — a name for the target, and what the frame it ran in says about it.

Only interactions above 200 ms, the Google INP "good" threshold, are candidates, and `slowest` is
left out of the event when none crossed it, which is the common case. That is also what keeps the
cost down: a target is named only for the few interactions slow enough to be recorded, never for
every one the browser reports.

Records are kept per interaction, because an interaction's latency grows as later entries arrive:
one that is already recorded is replaced by its slower self instead of taking a second place. Its
attribution comes from the entry that measured it at its slowest, read as that entry arrives.

The target comes from the event that entry measured, not from the entry: `entry.target` is `null`
once the element has left the document, and the handlers of a slow pointer interaction have usually
replaced the element under the pointer by the time the entry arrives. So a capture listener on the
document keeps `event.composedPath()` of the last few dozen interaction events — a copy of the path
the browser built for the dispatch, with no reading of the DOM — and the entry finds it by the
event's type and timestamp, the same way it finds its editor group. The references stay valid after
the nodes are detached, so the DOM is still read only for a record.

The target is a short path of tag names plus the first allow-listed attribute above it, such as
`div[data-vc="editor"] > p > span`. Nothing in it is document content: a tag name comes from the
schema, and the only attributes read are ones we put there ourselves. Ids, roles, class names, text
and accessibility labels are all left out, and the path is bounded in both depth and length.

The rest of a record comes from the Long Animation Frames of the interaction, attributed the way
[`web-vitals` attributes INP](https://github.com/GoogleChrome/web-vitals/blob/main/src/attribution/onINP.ts):
every frame overlapping the interaction counts, and the script that counts is the one with the
longest part inside it.

- `longestScriptMs`, `functionName`, `scriptName`, `invokerType` and `scriptSubpart` describe that one
  script — how much of it fell inside the interaction, the function it ran in, the file it came from
  as the browser named it without its origin or query, what ran it, and which phase of the
  interaction it ran in. The phase is what keeps a script named for an interaction that waited on the
  main thread from being mistaken for one its handlers ran.
- `totalScriptDurationMs`, `totalStyleAndLayoutDurationMs`, `totalPaintDurationMs` and
  `totalUnattributedDurationMs` divide the latency itself across every frame of the interaction. The
  time a script forced into style and layout counts as style and layout rather than as script, the
  same split DevTools shows. `totalUnattributedDurationMs` is what the frames explain nothing about,
  and it is not idle time: the browser reports no frame under 50 ms, so the work of those lands here
  as well.

A record is attributed as soon as a frame of it is known, and worked out again on every batch of
frames after that. The browser reports a frame in no fixed order — it can deliver one after the entry
measuring the interaction that ran in it, and the frames of one interaction in several batches — so a
record can go out without these fields, or with what one frame said, and be corrected in a later
snapshot of the same session. That is another reason a query takes the highest `seq`. All of them are
absent when the browser reported no frame at all, which it does for frames under 50 ms and outside
Chromium, and the fields describing one script are absent when no script of those frames overlapped
the interaction.

The phases are the gaps between four moments: the user acted, the interaction's handlers started
running, they finished, the screen updated. The first and the last come from the entry that measured
the interaction at its slowest. The two in between come from the paint that presented that entry,
which is every event whose `startTime + duration` agrees within 8 ms — the rounding Event Timing
applies to `duration`, and the only thing it says about which paint presented an event. So a
`pointerover` handler that was still running when the user clicked reads as processing of the click
rather than as time the click waited for nothing, which is also the split `web-vitals` reports. The
four are clamped as it clamps them, so they stay in order whatever the browser reported.

A paint keeps growing while the browser reports the rest of the events it presented, so an
interaction is reported again whenever its paint grew — including when what grew it was another
interaction presented by the same paint, or an event that is no interaction at all. The last handlers
of a paint are usually reported after the event that measured the interaction, so the phases of a
record are corrected in a later snapshot of the same session.

One thing we do not copy: their style and layout total takes the frame's render phase unguarded; we
report zero for a frame the browser said did none, which their formula would otherwise turn into an
absolute timestamp.

An interaction that is not the editor's is recorded as `group: 'outsideEditor'`, so the records also
answer whether the slow interactions of a session were the editor's at all. That group is not the
`page` histogram: `page` counts the editor's interactions as well, `outsideEditor` counts only the
ones that are not.

Collecting them is its own experiment, `platform_editor_editor_interactivity_slowest`, read where a
session decides whether to keep them rather than where the plugin is added to a preset: the plugin
only exists when the experiment reporting the histograms is on, so the exposure lands on the
sessions that already send the event, and the cost of the records stays separable from the cost of
the event carrying them. Nothing is collected, named or sent when it is off.

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
