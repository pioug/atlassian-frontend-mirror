# Our path forward for layering

> **What is _layering_?** Layering is when elements on a page sit visually on top of other elements
> to create a new UI surface. It includes tooltip, popup, modal, spotlight, dropdown menu, and
> select options.

> **Note:** Plug: if you have run into friction with our layering system, or thoughts on what the
> user experience should be, we are keen to capture it!
>
> →
> [We want your thoughts about layering](https://hello.atlassian.net/wiki/spaces/DST/pages/6408837085/We+want+your+thoughts+about+layering)

> We plan on implementing this new stack soon
>
> →
> [Project poster: Holistic layering stack refresh](https://hello.atlassian.net/wiki/spaces/DST/pages/6395729303/Project+poster+Holistic+layering+stack+refresh)

### Goal of this page

The goal of this page is to decide whether we can use new browser APIs for layering in the Design
System, and to capture that decision as a critical input into how we move forward in the layering
space.

### Summary

- We can move our layering system to Top layer and CSS Anchor Position. A light and limited
  JavaScript fallback will be needed for Anchor Positioning for a small and shrinking amount of
  users

---

## Current state

### Background

_Our layering system is weak_

Our layering system is a regular source of visual bugs, accessibility problems and challenges for
our makers. Historically, layering is a difficult problem to solve well in browsers, which has been
amplified by a lack of ongoing deep iteration on our layering system.

_Mounting technical issues_

The library we rely on for layering: [Popper.js](https://popper.js.org/docs/v2/) appears to be "soft
deprecated". It has not been updated in 3 years and has been replaced by
[Floating UI](https://floating-ui.com/docs/migration). At some point we would likely need to migrate
from Popper.js to Floating UI or some other layering library

_Volt_

The upcoming
[Volt](https://hello.atlassian.net/wiki/spaces/DevInfra/pages/5543757032/Volt+as+a+World+Class+Platform)
program heavily discourages the usage of third party dependencies and wants to drive them down. We
would likely need to insource Popper.js and then own all its code.

Layering in
[Volt](https://hello.atlassian.net/wiki/spaces/DevInfra/pages/5543757032/Volt+as+a+World+Class+Platform)
should be "entry point only" (ie forces lazy loading). It would be good to have entry point friendly
APIs for all our layering outputs.

_Browsers have evolved_

Over the last year or so, browsers have continued to ship new functionality that allow the web
platform to handle more of the layering problem space, without requiring third party libraries.

By using the platform™ we could unlock faster and more resilient experiences; while also driving
down our maintenance costs.

### Existing layering stack

> [Podcast of mine about layering](https://podcasts.apple.com/us/podcast/layering-with-popovers/id1869810765?i=1000745509546)
> if you want to listen to find out

_Overview:_

| _Rendering_   | We use `@atlaskit/portal` to render layered UI at the end of `<body>`, avoiding parent styling issues (e.g., `overflow: hidden`) |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| _Stacking_    | We use z-index to control layer order (e.g., tooltips at 9999 appear above modals at 510)                                        |
| _Positioning_ | We use Popper.js (`@atlaskit/popper`) to position layers relative to their triggers, with automatic flipping at viewport edges.  |
| _Behavior_    | We use `@atlaskit/layering` to coordinate escape-to-close and click-outside behaviors across nested layers.                      |

---

## Browser based layering

### New platform pieces for layering

Layering can now be achieved natively in browsers using the **Top layer** and **CSS Anchor
Positioning**

_Overview:_

| _Rendering_   | `<dialog>` and `popover` render content in the browser's native **top layer** (no portals, not impacted by parent styling)             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| _Stacking_    | Last inserted is on top. See → [Top layer algorithm](https://hello.atlassian.net/wiki/spaces/DST/pages/6383663933/Top+layer+algorithm) |
| _Positioning_ | CSS Anchor Positioning to position a popover relative to some other element                                                            |
| _Behavior_    | Built in focus management and light dismissal; or can do it yourself (eg with `@atlaskit/layering`)                                    |

> [**Vibe coded demos of Top layer + CSS Anchor Positioning**](https://anchor-position-fallback-test.vercel.app/)

### Top layer

If you put an element in the _top layer_ it will be placed visually on top of everything else, no
matter where it is in the DOM. No more need for portals.

To put something in the _top layer,_ you can use:

- `<dialog>`: for statically positioned elements layers, designed to draw attention: eg modals
- popover: a general tool to show any element in the top layer. Popovers can also be linked to
  trigger elements using CSS anchoring (eg tooltips, popups, dropdown menus, select, spotlight)

It is possible to have multiple elements in the top layer at the same time (eg with
`popover="manual"` or nested `popover="auto"` elements). When there are multiple elements being
displayed in the top layer, the one that was inserted last will be displayed on top. It's a "first
in, first out" stack. In practice this works out **_extremely nicely_**.

_[Image: image-20260128-034502.png]_

### CSS Anchor Positioning

CSS Anchor Positioning enables the declarative linking of an element in the top layer to another
element on the page (eg showing a tooltip next to an icon button).

There are a few CSS features that make up CSS anchoring:

- `position-area`: declare where the popover should be in relation to the trigger
- `position-try-fallback`: fallback(s) for `position-area` when there is not enough room for the
  popover
- `@position-try`: a fallback aware selector used to know what placement the popover is currently
  in. This is needed to support directional arrows on popovers (which spotlight currently uses)

## Browser support

Atlassian currently doesn't have a strong unified story around what versions of browsers we actually
support (our public one is that we
[only support latest majors](https://support.atlassian.com/atlassian-account/docs/supported-browsers-for-atlassian-cloud-products/)).
So we are in nuanced territory.

> **Note:** More details:
>
> - [What is Atlassian's browser support, actually?](https://hello.atlassian.net/wiki/spaces/DST/pages/6395039711/What+is+Atlassian+s+browser+support+actually)
> - [Browser support for Top layer and CSS Anchor Position](https://hello.atlassian.net/wiki/spaces/DST/pages/6356848365/Browser+support+for+Top+layer+and+CSS+Anchor+Position)

### Top layer support

Top layer has been widely supported since April 2024
([Baseline 2025](https://caniuse.com/wf-popover)).

Based on [global browser usage data](https://gs.statcounter.com/), 100% of users on our
[computed Atlassian browser support matrix](https://hello.atlassian.net/wiki/spaces/DST/pages/6395039711/What+is+Atlassian+s+browser+support+actually)
support top layer.

According to
[Jira usage data](https://app.amplitude.com/analytics/atlassian/chart/v7scbmw4?sharingId=2DB7A_v_),
top layer (dialog and popover) is supported by 99.8% browsers of Jira users.

#### Support for Top layer (popover and dialog)

- **Supported:** 99.8%
- **Unsupported**: 0.2%
- **Unknown:** ~6% (Traffic labeled `(none)` or generic bots, excluded from the percentage above).

#### Unsupported Group

The 0.2% of unsupported traffic is fragmented across very old browser versions.

The top offenders are:

1. **Yandex Browser (v25):** ~5,300 users. (Yandex often lags in Chromium updates).
2. **Chrome 109:** ~2,500 users. (This was the last version to support Windows 7/8. These users are
   stuck on an OS from 2009).
3. **Safari 16:** ~1,300 users. (Released 2022. Most users have auto-updated to Safari 17/18/26).
4. **Firefox 115 ESR:** ~900 users. (Extended Support Release for older enterprise environments).

#### Risk Assessment

- **High Risk:** None.
- **Low Risk:** **Chrome on iOS**.
  - _Context:_ Chrome on iOS uses Apple's WebKit engine. Support depends on the user's **iOS
    version**, not the Chrome App version.
  - _Data:_ Logs show users on "Chrome iOS 144" (the latest App version). It is highly probable
    (>95%) that users keeping their apps this up-to-date are also on a reasonably modern iOS (iOS
    17+), which supports Popover.
  - _Conclusion:_ We count these users as "Supported". Even in the worst-case scenario where half of
    them are on old iOS versions (unlikely), your total support would only drop to ~99.5%.

### Recommendation

Ship it.

- I am confident that we can start leveraging the top layer due to it's near universal support

### CSS Anchor Positioning support

An important consideration is that if CSS anchoring is _not_ supported in a browser, then the impact
is **catastrophic**: layering is totally broken (layers can be who knows where, including
offscreen). CSS Anchor Positioning is a capability and not a progressive enhancement.

Based on [global browser usages statistics](https://gs.statcounter.com/browser-version-market-share)
for 23 Jan 2026 → 30 Jan 2026 94.8% of people are
[Atlassian supported](https://hello.atlassian.net/wiki/spaces/DST/pages/6395039711/What+is+Atlassian+s+browser+support+actually)
browsers that support CSS Anchor Positioning (5.2% unsupported). 25% of _global_ Safari users and
13% of global Firefox users are currently on browser versions that don't support CSS Anchor
Positioning.

<details>
<summary>Data about unsupported browsers</summary>

| Browser Version | Global Market Share | **% of Users on that Browser** | Why is this high?                                                                                                                                                             |
| --------------- | ------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Safari 18**   | **~4.8%**           | **~25%**                       | Safari adoption is tied to OS updates. Roughly 1 in 4 Safari users globally are still on the previous major version (Safari 18) due to hardware limits or delayed OS updates. |
| **Firefox 146** | **~0.4%**           | **~13%**                       | Firefox users update quickly. While ~13% are momentarily on the previous version, most will migrate to v147 within weeks.                                                     |

</details>

Based on
[Jira usage data](https://app.amplitude.com/analytics/atlassian/chart/v7scbmw4?sharingId=2DB7A_v_)
21 Jan 2026 → 28 Jan 2026, 94% of Jira customers are already on browsers that support CSS Anchor
Positioning (6% unsupported). This is skewed by Chrome and Edge users (which make up 86.7% of
users). ~30% of Jira Safari and Firefox users are on versions that don't support CSS Anchoring.

<details>
<summary>Jira user data breakdown</summary>

Here is a breakdown of browsers and their major versions that are being used in Jira today →
[https://app.amplitude.com/analytics/atlassian/chart/v7scbmw4?sharingId=2DB7A*v*](https://app.amplitude.com/analytics/atlassian/chart/v7scbmw4?sharingId=2DB7A_v_).
If we cross reference this the
[browser support for CSS anchoring](https://hello.atlassian.net/wiki/spaces/DST/pages/6356848365/Browser+support+for+Top+layer+and+CSS+Anchor+Position),
this is what we learn:

**Overall CSS Anchoring support: 94%**

Browsers being used by Jira customers:

- **Chrome:** 61.3%
- **Edge:** 25.4%
- **Firefox:** 4.1%
- **Safari:** 2.7%
- **Other / Unknown:** ~6.5%

**CSS Anchoring Support grouped by Browser**

| **Vendor**  | **Users on versions with CSS anchoring** | **Users on versions without CSS anchoring** |
| ----------- | ---------------------------------------- | ------------------------------------------- |
| **Chrome**  | **99.7%**                                | 0.3%                                        |
| **Edge**    | **99.9%**                                | 0.1%                                        |
| **Safari**  | **72.6%**                                | 27.4%                                       |
| **Firefox** | **69.4%**                                | 30.6%                                       |

</details>

- I don't think we can **_exclusively_** lean on CSS Anchor Positioning in production, **_just
  yet_**

### Proposed approach to Anchor Positioning

Preliminary thoughts:

- Having no fallback for CSS Anchor Positioning will result in broken experiences for a non-trivial
  amount of users in production today
- Browser support for CSS Anchor Positioning is super high and will grow over time
- We don't want to rebuild features that already exist in the platform, and that we won't need in a
  year or two. I think we need to "skate to where the puck is going" and embrace solutions that are
  forward facing.

I think we need to provide a **super light** JavaScript fallback for CSS Anchor Positioning. The
goal is **not** to polyfill CSS Anchor Positioning, but to provide a **_functional experience_**
**(non-broken)** for the small (and shrinking) group of users who are on browsers without CSS Anchor
Positioning. It doesn't need to be glamorous, and it can have rough edges.

The approach to this will likely evolve as we get into implementation, but here is my current
thinking:

> _When a popover opens and anchor positioning is needed, run the placement algorithm:_
>
> **Placement algorithm:**
>
> - Measure dimensions of trigger and its screen placement
> - "inline" popover placement: show the popover on the left / right of trigger that has the most
>   available space on the screen
> - "block" popover placement: show the popover the bottom / top of the trigger that has the most
>   available space on the screen
> - If an "auto" placement is needed: show the popover on the edge (top, right, bottom, left) that
>   has the most available space on the screen
>
> The _Placement algorithm_ will need to re-run while the popover is open, when:
>
> - Any `"scroll"` event (we can listen to them all using a `capture` listener on the `window`).
> - Page `"resize"` events
>
> _The placement algorithm stops being re-run when the popover closes._

Recalculating the placement on `"resize"` and `"scroll"` will ensure the popover follows the trigger
as it moves around on the screen. There might be some minor visual stuttering with this approach,
but it will work (non-broken).

We _might_ consider also adding a `MutationObserver` to the open popup to re-run the placement
algorithm if there are any changes in the popup. However, I think it's fine to not do that and
potentially have some bad experiences in some cases.

As a minor alternative, we could explore recalculating the _Placement algorithm_ on _every frame_
(`requestAnimationFrame` loop) rather than in response to update events (eg `"scroll"` and
`"resize"`). However, initial testing showed no experience improvement and recalculating on each
_frame_ is a lot more expensive than just recalculating when needed.

> [**Working demo of algorithm**](https://anchor-position-fallback-test.vercel.app/) (it's pretty
> decent!)

- Use CSS Anchor Positioning, and have a _basic_ JavaScript fallback when it's not supported

### Animations

We use CSS `@starting-style` for entry animations and `allow-discrete` on `display`/`overlay` for
exit animations. This is the CSS spec's intended mechanism for animating top-layer entry/exit (CSS
Transitions Level 2).

- **Entry:** `@starting-style` defines the initial values the element transitions _from_ when it
  enters the top layer (via `showPopover()` or `showModal()`). The browser transitions from these
  starting values to the element's resting state automatically.
- **Exit:** `transition-behavior: allow-discrete` keeps the element visible in the top layer while
  CSS transitions play after `hidePopover()` or `close()`, even though `display` would normally snap
  to `none` instantly.

Animation is treated as a **progressive enhancement**: browsers without `@starting-style` support
show/hide content instantly. The UI is functional, just not animated. All presets include
`@media (prefers-reduced-motion: reduce)` to disable animations for users who prefer reduced motion.

The `isOpen` prop on `Popover` and `Dialog` owns the full animation lifecycle — the consumer sets
`isOpen={false}` and the primitive handles `hidePopover()`, the CSS exit transition, and cleanup
internally. No glue code needed.

> **Note:** We are using CSS-native animation mechanisms, not `@atlaskit/motion` (which uses
> JS-driven keyframe animations) or View Transitions.

#### Why not View Transitions?

View Transitions were initially considered but rejected in favour of `@starting-style` +
`allow-discrete`:

1. **Lifecycle ownership:** View Transitions require the _caller_ to wrap state changes in
   `document.startViewTransition(() => flushSync(...))`. This pushes animation lifecycle to every
   consumer — silent failure if forgotten. With `isOpen`, the primitive owns the lifecycle.
2. **Single system:** `@starting-style` handles entry and `allow-discrete` handles exit — one
   CSS-native mechanism for both directions. View Transitions would only help with exit, and entry
   would still need `@starting-style`, resulting in two systems.
3. **Platform alignment:** `@starting-style` + `allow-discrete` is the CSS spec's _intended_
   mechanism for animating top-layer entry/exit. View Transitions are designed for document-level
   content transitions (page navigations, layout changes).

See [animations.md](../architecture/animations.md) for the full analysis and alternatives
considered.

### Design Constraints

The only design constraint I ran into was for popovers that leverage arrows. Having a popover with
an arrow that points to the trigger
[is possible with CSS Position Anchoring, but it's complex](https://gist.github.com/alexreardon/2008517fcbebe03f1e41e10b4104174c).
It looks like adding a border shadow to a popover that also leverages the known technique for doing
arrows doesn't work well and the shadow looks bad.

- Only one package (Spotlight) uses pointing arrows, and it doesn't use a box shadow
- There _might_ be a way to get box shadows working well with arrows after more investigation
- None of the future facing layering designs that I have seen include usage of arrows on popovers
- After discussion with Deborah Lindberg, neither of us are concerned about this constraint

It looks like there is a proposal to improve how easy it is to do pointing arrows with CSS Anchor
Positioning, and I would be super surprised if it did not work with box shadows:
[anchored container queries](https://developer.chrome.com/blog/anchored-container-queries) (thanks
Declan Warn!)

- This _minor_ decision constraint is super reasonable to accept in order to use the platform

### Compiled support for CSS Anchor Positioning

<details>
<summary>Support breakdown</summary>

| **CSS Feature**                         | **Type**       | **Support Status in Compiled**    |
| --------------------------------------- | -------------- | --------------------------------- |
| `anchor-name`                           | Property       | Supported (See Warning 1)         |
| `position-anchor`                       | Property       | Supported                         |
| `position-area` (formerly `inset-area`) | Property       | Supported                         |
| `position-try` (Shorthand)              | Property       | Supported                         |
| `position-try-fallbacks`                | Property       | Supported                         |
| `position-try-order`                    | Property       | Supported                         |
| `position-visibility`                   | Property       | Supported                         |
| `anchor()`                              | Value Function | Supported                         |
| `anchor-size()`                         | Value Function | Supported                         |
| `@position-try`                         | At-Rule        | Not built in, but can work around |

</details>

[@position-try](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@position-try)
is the only feature not currently supported in [Compiled](https://compiledcssinjs.com/).

```css
@position-try --try-option-name {
  descriptor-list
}
```

@position-try allows you to specify styles that apply in particular fallback scenarios. Generally
you don't need it as you can do most fallback behaviour declaratively (eg spacing from the trigger).
So far in my detailed explorations, `@position-try` has only really been useful for arrows coming
from popovers.

We have super reasonable options if we want to use `@position-try`:

- Add formal support to Compiled for `@position-try`
- Create our own global style (eg via an inline `<style>` element) when if we _really_ need it

### Focus locking

The new Top layer primitives (`dialog` and popover) have some new opinions around focus management
which the accessibility folks are keen to embrace. I won't weigh into the specifics, but it's worth
being clear that moving to Top layer doesn't mean that we have to change how we do focus management
today. The Top layer primitives are flexible enough for you to bring your own opinions regarding
focus management.

Moving to Top layer has some cool potential upshots around focus management, but doesn't preclude us
from doing our own focus management, even if it's only for a transitional period of time.

### Migration

I will do this in a separate page as it warrants a detailed investigation. A big challenge to
overcome is that you cannot interlace top layer and non-top layers. Anything in the Top layer, will
be on top of everything else, including all layered components that are not in the Top layer.

See
[Top layer algorithm](https://hello.atlassian.net/wiki/spaces/DST/pages/6383663933/Top+layer+algorithm)

What we will likely either need to do _(behind feature flags)_:

- Start from the top most visual layers and work inwards (eg start with tooltip and work inwards)
- Change over all the existing layer packages at once to a new package (eg `@atlaskit/popover`)

Some challenges _(much more to be explored)_:

- Handling custom layer components that other teams have built (including direct usage of
  `@atlaskit/popper` and `@atlaskit/portal`)
- Ensuring that our product experiences use of layering works well with the
  [Top layer algorithm](https://hello.atlassian.net/wiki/spaces/DST/pages/6383663933/Top+layer+algorithm)
- Full assistive technology implications; but I'm not concerned as assistive technology is one of
  the core reasons to move to using the top layer (eg you can co-locate content that goes in the top
  layer in the DOM rather than using a portal which separates them) —
  [We need Popover!](https://hello.atlassian.net/wiki/spaces/~639985edf3c3dfd71fe85b7e/pages/5405651324/We+need+Popover)

### Platform patterns

As we embrace the web platform, I think it is important that we prioritize leaning into the codified
patterns and algorithms that it has established for layering (eg light dismissal, focus management,
no re-stacking etc)

If we can leverage these patterns:

- We need to handle less cases ourselves (less code to users, less for us to maintain)
- Better experience consistency with the rest of the web platform and assistive technologies

We can deviate from that position if it becomes desirable to do so (eg for migration purposes), but
I think it's worth embracing platform patterns as a _strong default_.

---

## Volt

### Streamlined lazy loading practices for layers

_"Layer entry points"_

Big idea:

- Make the _content within layers_ lazy (don't need to load the code or data for a layer if it isn't
  immediately visible to a user)
- Load in the code and or data for the layer content when it's needed
- Streamline this practice for Atlassian by making opinionated exports that lean into the Atlassian
  tech stack ([Relay](https://relay.dev/))

For clarity, the code to power layering would need to be immediately available. The lazy part of the
equation is the content within the layer. This way we can immediately show a layer in the right
spot, and then within the layer, show a loading indication where the loading content will be. If we
don't do this approach, then the user can be given no immediate feedback when a layer is supposed to
open, which can look super broken.

I cannot see anything that would prevent us from using Top layer (`dialog` and `popover`) and CSS
Anchor Positioning to achieve layer entry points. Using Top layer and Anchor Positioning would make
our lazy layer content story even stronger as the amount of code to show the shell for a layer would
be dramatically less — we would no longer need `Popper.js` (`~19.7 kB` minified), our popper wrapper
(`@atlaskit/popper`), our portal code (`@atlaskit/portal`) and all the functionality we could get
for free by using the platform.

We still need to explore what the assistive technology story will be for layers with lazy loaded
content. We will need to have a strong understanding of how we should handle and communicate
situations where the layered content is not yet ready. We would need to solve this problem
regardless of if we were using the existing and future layering stack.
