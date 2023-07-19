# @atlaskit/smart-card

## 26.9.12

### Patch Changes

- Updated dependencies

## 26.9.11

### Patch Changes

- [`3fb20c4aeba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3fb20c4aeba) - Add postinstall check to enforce internal peer dependencies

## 26.9.10

### Patch Changes

- [`74c892f10de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/74c892f10de) - [ux] Hover card will open closer to the mouse position, but with a slight offset of 10px to the right and to the top.

## 26.9.9

### Patch Changes

- [`4e254433494`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4e254433494) - [ux] Remove 'open in new tab' button in Hover Cards

## 26.9.8

### Patch Changes

- [`4d66cb26fcb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4d66cb26fcb) - Bump jsdom to ^17.0.0
- [`2a6ebbbfdf1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a6ebbbfdf1) - [ux] Hover Preview: Hide hover preview on scrolling (wheel event)
- Updated dependencies

## 26.9.7

### Patch Changes

- [`68880de5ecb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/68880de5ecb) - [ux] Closing hover card on right click (open of context menu)

## 26.9.6

### Patch Changes

- [`e0a2c926e63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0a2c926e63) - [ux] Flexible Smart Links: Fix hover preview shows on mouse leave

## 26.9.5

### Patch Changes

- [`7b08013b112`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b08013b112) - Clean up use of showAuthTooltip FF. Switch to being fully reliant on the showAuthTooltip prop.
- Updated dependencies

## 26.9.4

### Patch Changes

- [`2a4926aa20a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a4926aa20a) - [ux] Flexible Smart Links: Add hover preview show/hide delay when mouse moves inside the card

## 26.9.3

### Patch Changes

- [`1e7190077d4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1e7190077d4) - Move off deprecated @atlaskit/linking-common/extractors to @atlaskit/link-extractors
- Updated dependencies

## 26.9.2

### Patch Changes

- [`99643bdd534`](https://bitbucket.org/atlassian/atlassian-frontend/commits/99643bdd534) - Fix flexible smart links onclick event not bubble up when hover preview is enabled

## 26.9.1

### Patch Changes

- [`88cc5a0088c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/88cc5a0088c) - [ux] Flexible Smart Links: Hover preview to follow mouse position
- Updated dependencies

## 26.9.0

### Minor Changes

- [`7811ab546b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7811ab546b9) - Cleans up FF platform.linking-platform.smart-card.enable-analytics-context introduced in 26.2.2 — resolved attributes now provided to all events fired within Smart Card by default.

## 26.8.1

### Patch Changes

- [`0b148ef0a04`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b148ef0a04) - [ux] Updated fade in delay for hover card to be 500ms

## 26.8.0

### Minor Changes

- [`a1b70608039`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a1b70608039) - [ux] Adds editor toolbar to link datasource component

## 26.7.0

### Minor Changes

- [`c5a897eb81d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c5a897eb81d) - add statusDetails attribute

### Patch Changes

- Updated dependencies

## 26.6.3

### Patch Changes

- [`fc0fa5ca4e7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fc0fa5ca4e7) - [ux] Fix for a hover card issue introduced in 25.6.17

## 26.6.2

### Patch Changes

- Updated dependencies

## 26.6.1

### Patch Changes

- [`ebb6750a97d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ebb6750a97d) - [ux] Flexible Smart Links: Change hover preview show/hide behavior. Hover preview should not show when hovering over metadata elements and actions.
- Updated dependencies

## 26.6.0

### Minor Changes

- [`04295e9d5bc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04295e9d5bc) - [ux] Updating ORS response to include datasources and facilitating pasting JQL links turning into datasource tables

### Patch Changes

- Updated dependencies

## 26.5.18

### Patch Changes

- Updated dependencies

## 26.5.17

### Patch Changes

- [`b3ed4f7f776`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3ed4f7f776) - [ux] Fix for Hover Card unmount - added a clean up function that will clearTimeouts. Additionally changed the trigger of HoverCard from onMouseEnter to onMouseOver and added a function that after 100ms of hover starts fetching the data for the url to reduce the loading state experienced on standalone HoverCards.

## 26.5.16

### Patch Changes

- Updated dependencies

## 26.5.15

### Patch Changes

- [`7b2d54a82d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7b2d54a82d0) - Cleans up a FF introduced in 26.3.3 & Fixes HoverCard component providing hover card analytics context to the wrapped trigger component

## 26.5.14

### Patch Changes

- [`fd2375e6f26`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd2375e6f26) - [ux] Prevent skipping of warning modal when onClick callback programatically opens a window. OnClick function is no longer called if the warning modal is shown. This will prevent link click analytics from firing but there is no easy way to distinguish the effects of what happens within onClick. Additionally, clicking continue in the warning modal will always open the link in a new tab.

## 26.5.13

### Patch Changes

- [`2d2b6b23bec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d2b6b23bec) - Updated dependencies

## 26.5.12

### Patch Changes

- [`472882f9947`](https://bitbucket.org/atlassian/atlassian-frontend/commits/472882f9947) - fix analytics display to be flexible when it is a flex ui

## 26.5.11

### Patch Changes

- [`0dd86b5573c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0dd86b5573c) - Small refactoring to move lozenge action to lozenge element

## 26.5.10

### Patch Changes

- [`70f573b2c44`](https://bitbucket.org/atlassian/atlassian-frontend/commits/70f573b2c44) - Internal change to use space tokens for spacing properties. There is no visual change.

## 26.5.9

### Patch Changes

- [`d394a5db254`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d394a5db254) - Fixes display analytics attribute provided by analytics context when the apperance is flexible

## 26.5.8

### Patch Changes

- [`27f4aa34132`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27f4aa34132) - [ux] Fix for Hover Card in Flexible UI links: it will show only supported states, such as resolved and unauthorized based on the corresponding featureFlag ('showHoverPreview' and 'showAuthTooltip')

## 26.5.7

### Patch Changes

- [`5b5d7b22e80`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5b5d7b22e80) - [ux] Update feature discovery on lozenge action to display for 2s before marking it as discovered

## 26.5.6

### Patch Changes

- [`625aad4d6f8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/625aad4d6f8) - [ux] Change block card link clicks to open in the same tab by default unless overriden with onclick behaviour.

## 26.5.5

### Patch Changes

- [`8f456366d7b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f456366d7b) - Clean up actionable element experiment

## 26.5.4

### Patch Changes

- [`2660603c726`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2660603c726) - [ux] A hover card loading state improvement is implemented: all elements except for actions would have a loading skeleton
- Updated dependencies

## 26.5.3

### Patch Changes

- Updated dependencies

## 26.5.2

### Patch Changes

- [`c77f4d24dee`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c77f4d24dee) - [ux] Show feature discovery (pulse) on lozenge action

## 26.5.1

### Patch Changes

- [`61cb5313358`](https://bitbucket.org/atlassian/atlassian-frontend/commits/61cb5313358) - Removing unused dependencies and dev dependencies
- Updated dependencies

## 26.5.0

### Minor Changes

- [`ce79111f98f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ce79111f98f) - Card component will stop throwing any uncaught errors. Any existing consumer relying on this behaviour should start using `fallbackComponent` to provide fallback ui and `onError` to act on such errors. See CardProps type for more docs.
  Reason this is a minor bump and not a major version is because the previous behaviour of error propagation was actually a bug and was not a public contract with clients. This minor version fixes this bug and requires the client to update their code.

## 26.4.1

### Patch Changes

- Updated dependencies

## 26.4.0

### Minor Changes

- [`2b7f0f3b158`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2b7f0f3b158) - [ux] Fix issue with metadata alignment of Title Block component in Confluence Web links.

## 26.3.10

### Patch Changes

- [`d8263ae659f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d8263ae659f) - [ux] Small css fix for avatar alignment in smart links
- [`438b90799c4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/438b90799c4) - Removes urlHash from linking platform events.

## 26.3.9

### Patch Changes

- [`d476c6d5223`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d476c6d5223) - Add an optional err?:Error property to OnErrorCallback for upcoming changes

## 26.3.8

### Patch Changes

- Updated dependencies

## 26.3.7

### Patch Changes

- [`b270cd7542b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b270cd7542b) - Updates internal analytics for link clicked events in Smart Card and adds more attributes to link clicked event fired by LinkUrl (blue links) that are rendered in editor.

## 26.3.6

### Patch Changes

- Updated dependencies

## 26.3.5

### Patch Changes

- [`36b440f8c7f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/36b440f8c7f) - Disable prop-drilling of analytics dispatch function

## 26.3.4

### Patch Changes

- [`d86bc75af82`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d86bc75af82) - Internal change to enforce token usage for spacing properties. There is no expected visual or behaviour change.

## 26.3.3

### Patch Changes

- [`6d9a4d28d94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d9a4d28d94) - Fixes HoverCard component providing hover card analytics context to the wrapped trigger component.
- Updated dependencies

## 26.3.2

### Patch Changes

- [`f10ed88032c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f10ed88032c) - With the renaming of Jira Roadmaps to Timeline, we are updating the regex rules to match timeline in conjunction to roadmaps
- Updated dependencies

## 26.3.1

### Patch Changes

- Updated dependencies

## 26.3.0

### Minor Changes

- [`8406b471923`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8406b471923) - [ux] Update analytics tracking events for lozenge action

## 26.2.2

### Patch Changes

- [`374da8b159a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/374da8b159a) - Include additional attributes (urlHash, display, id) and resolved attributes for link clicked analytics events (Originally introduced in 25.8.0, reverted in 25.9.1 due to regression)
- [`c6d962997a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6d962997a7) - [ux] Changed the text of the button from 'Full screen view' to 'Open preview' and also changed the color of a button in the hover cards
- Updated dependencies

## 26.2.1

### Patch Changes

- [`f27eb952289`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f27eb952289) - [ux] This fixes a bug which is caused when some text including a newline is linked and clicked, which incorrectly triggers a warning.

## 26.2.0

### Minor Changes

- [`877b4f8f7fc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/877b4f8f7fc) - Remove iframe dwell tracking feature flag. Smart card embedded iframes will always track dwell events.

### Patch Changes

- Updated dependencies

## 26.1.6

### Patch Changes

- [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8
- Updated dependencies

## 26.1.5

### Patch Changes

- [`6fa208a0d81`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6fa208a0d81) - Fixes internal useSmartCardState to internally use useSyncExternalStore to fix bugs relating to syncronous updates to the store in the same phase that the store is subscribed to.

## 26.1.4

### Patch Changes

- [`cee3699d4a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cee3699d4a8) - [ux] Minor style updates for a Smart Link Error Lozenge

## 26.1.3

### Patch Changes

- [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`
- Updated dependencies

## 26.1.2

### Patch Changes

- [`f50bead1f15`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f50bead1f15) - Added firing an analytics event on action lozenge error modal opening

## 26.1.1

### Patch Changes

- [`04a2ca5dffb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/04a2ca5dffb) - [ux] Changed zIndex for hover card

## 26.1.0

### Minor Changes

- [`68562365142`](https://bitbucket.org/atlassian/atlassian-frontend/commits/68562365142) - Add analytics for quick actions

## 26.0.1

### Patch Changes

- [`6341b726715`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6341b726715) - Fix of the request body of the invoke update request

## 26.0.0

### Minor Changes

- [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 25.9.5

### Patch Changes

- [`e241a5dda48`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e241a5dda48) - Add 'keyboard' clickType for link clicked analytics events when user interacts with links using keyboard

## 25.9.4

### Patch Changes

- [`025d2c69562`](https://bitbucket.org/atlassian/atlassian-frontend/commits/025d2c69562) - [ux] Restrict maximum height on lozenge action

## 25.9.3

### Patch Changes

- [`607168dad64`](https://bitbucket.org/atlassian/atlassian-frontend/commits/607168dad64) - [ux] Update lozenge action with selected item on action success.

## 25.9.2

### Patch Changes

- [`845816bac34`](https://bitbucket.org/atlassian/atlassian-frontend/commits/845816bac34) - [ux] Added a link to open preview modal on action error

## 25.9.1

### Patch Changes

- [`b76602c1619`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b76602c1619) - Revert 25.8.0 changes "Include additional attributes (urlHash, display, id) and resolved attributes for link clicked analytics events" due to regression
- [`1aedc244e41`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1aedc244e41) - [ux] Smart Links Internal Grey theme is now more specific to prevent Confluence override

## 25.9.0

### Minor Changes

- [`7f248766888`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f248766888) - [ux] Add container names which mark the location in which the linked resource sits within. This funtionality will be used to show the container names for Trello links.

  FlexUI: Reduced gap between title and subtitle in TitleBlock.

## 25.8.0

### Minor Changes

- [`44b76af1d5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/44b76af1d5f) - Include additional attributes (`urlHash`, `display`, `id`) and resolved attributes for `link clicked` analytics events

## 25.7.3

### Patch Changes

- [`878dc4e5239`](https://bitbucket.org/atlassian/atlassian-frontend/commits/878dc4e5239) - Enable lozenge action by using showServerActions opt-in OR using feature flag useLozengeAction for experiment

## 25.7.2

### Patch Changes

- Updated dependencies

## 25.7.1

### Patch Changes

- [`7a58d99e333`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7a58d99e333) - [ux] Added error handling for smart link action
- Updated dependencies

## 25.7.0

### Minor Changes

- [`9c49eef4c87`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c49eef4c87) - [ux]

  - Add lozenge action to hover preview (wip, opt-in, feature flag)
  - Fix hover preview's action dropdown menu showing behind container
  - Allow setting z-index for portal component inside flexible smart links

## 25.6.1

### Patch Changes

- [`72a99128d3e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/72a99128d3e) - Enables CardSSR component to send analytics events.

## 25.6.0

### Minor Changes

- [`eceb32a564f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eceb32a564f) - [ux] This adds a new Flexible UI attribute, `OwnedBy`, which represents who owns a resource.

### Patch Changes

- Updated dependencies

## 25.5.7

### Patch Changes

- [`4c046475c1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c046475c1b) - Fix LinkUrl component: it should not show warning for many cases when it does right now (like relative path comparasion)

## 25.5.6

### Patch Changes

- Updated dependencies

## 25.5.5

### Patch Changes

- [`4b396e5d7eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b396e5d7eb) - [ux] Add lozenge action to block card (wip, opt-in, feature flag)

## 25.5.4

### Patch Changes

- [`19622f395b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19622f395b0) - Connect `showServerActions` prop to flexible smart links, surfacing the lozenge dropdown action behind feature flag.

## 25.5.3

### Patch Changes

- [`da5d5b2dbef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/da5d5b2dbef) - Fire link clicked analytics event for LinkUrl component

## 25.5.2

### Patch Changes

- [`c2aab8ee44b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2aab8ee44b) - Add lozenge dropdown action to Flexible Smart Link based element lozenge

## 25.5.1

### Patch Changes

- [`bcc645691c5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bcc645691c5) - Add lozenge action feature flag and extract server action for state lozenge from JSON-LD response
- Updated dependencies

## 25.5.0

### Minor Changes

- [`5329942b8aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5329942b8aa) - Deprecates analyticsHandler argument of useSmartLinkActions and useSmartLinkReload hooks.

## 25.4.4

### Patch Changes

- [`2e01c9c74b5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e01c9c74b5) - DUMMY remove before merging to master; dupe adf-schema via adf-utils
- Updated dependencies

## 25.4.3

### Patch Changes

- Updated dependencies

## 25.4.2

### Patch Changes

- [`1d38688106e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d38688106e) - [ux] Moved out the implementation of the resolve function from useSmartCardActions into a separate internal hook useResolve. Added reload functionality for LozengeAction on a successful update
- [`0ee9370595a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ee9370595a) - Update json-ld-types
- Updated dependencies

## 25.4.1

### Patch Changes

- [`ae2cba07a9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae2cba07a9a) - Removes prevented as a clickOutcome analytics attribute value and adds defaultPrevented as a replacement attribute.

## 25.4.0

### Minor Changes

- [`65b0490a5dc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65b0490a5dc) - Deprecates the export of useSmartLinkAnalytics hook and analyticsEvents prop.

## 25.3.3

### Patch Changes

- [`b57c925587f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b57c925587f) - Migrated use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 25.3.2

### Patch Changes

- [`fab186f135b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fab186f135b) - Add load and update functionality to lozenge action
- Updated dependencies

## 25.3.1

### Patch Changes

- [`fa2fb550e4b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa2fb550e4b) - [ux] This makes Flexible Block Cards have the same onClick behaviour as the older block card, where the passed in onClick behaviour will cause the Smart Card to use `e.preventDefault()`.

## 25.3.0

### Minor Changes

- [`4a1604ce132`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a1604ce132) - Adds a new themeMode query param to preview links url from 1P integrators that support different theme modes.

## 25.2.1

### Patch Changes

- [`03394282a26`](https://bitbucket.org/atlassian/atlassian-frontend/commits/03394282a26) - The change migrates `Shimmer` component to use the `Skeleton` component from the common package
- Updated dependencies

## 25.2.0

### Minor Changes

- [`aeaf58d2384`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aeaf58d2384) - Change adds a new prop on Smart Card `embedIframeUrlType` which allows a user of a Smart Card with the `embed` appearance to specify whether the Smart Card embed should use `href` or `interactiveHref` in the JSON-LD response.

## 25.1.1

### Patch Changes

- [`a3b9ef40d09`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a3b9ef40d09) - [ux] Adds white-space style to FlexUI text element

## 25.1.0

### Minor Changes

- [`b811f263575`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b811f263575) - Add new "showServerActions" prop to SmartCard to show available server actions on inline and block Smart Links. This will be used in conjunction with feature flags on the duration of the experiment.

### Patch Changes

- [`32b4bcce640`](https://bitbucket.org/atlassian/atlassian-frontend/commits/32b4bcce640) - Replace box-shadow based focus to instead apply outline.
- Updated dependencies

## 25.0.7

### Patch Changes

- [`0af4a6b6426`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0af4a6b6426) - Dependency update json-ld-types@3.4.0
- Updated dependencies

## 25.0.6

### Patch Changes

- [`c85ee838eae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c85ee838eae) - [ux] Added analytics event 'appAccount authStarted' for inline smart card

## 25.0.5

### Patch Changes

- Updated dependencies

## 25.0.4

### Patch Changes

- [`de8c6e88424`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de8c6e88424) - flexible block card metadata all left aligned

## 25.0.3

### Patch Changes

- [`7ae310c744a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7ae310c744a) - [ux] Updated Flex UI CollaboratorGroup extractor to return list of collaborators

## 25.0.2

### Patch Changes

- [`14363bff579`](https://bitbucket.org/atlassian/atlassian-frontend/commits/14363bff579) - Formatting change for i18n translations

## 25.0.1

### Patch Changes

- [`c687cc0de52`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c687cc0de52) - Add lozenge action component (WIP)

## 25.0.0

### Patch Changes

- Updated dependencies

## 24.3.2

### Patch Changes

- [`12223b3ee04`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12223b3ee04) - Move EditorCardProvider to new package instead of using imports from Link Provider and Smart Card
- Updated dependencies

## 24.3.1

### Patch Changes

- [`d0c67f1cc2b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0c67f1cc2b) - Prettier-ignore added to i18n translations

## 24.3.0

### Minor Changes

- [`9f903aa9c4e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f903aa9c4e) - Fixes rethrow logic in flex ui to not rely on reference to APIError constructor.

## 24.2.0

### Minor Changes

- [`ef5f28bfbcb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ef5f28bfbcb) - [ux] Support to hide the full screen view button in hover previews was added. A new prop 'hideHoverCardPreviewButton' was added to FlexibleUiOptions which allows for not showing the button in the hover preview shown on flexui cards. A new prop was also added to standlone hover card called 'hidePreviewButton' which allows for removing the same button when directly consuming hover card.

## 24.1.3

### Patch Changes

- Updated dependencies

## 24.1.2

### Patch Changes

- Updated dependencies

## 24.1.1

### Patch Changes

- [`ffa4b8db98b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ffa4b8db98b) - Bugfix: Hide a vertical scroll bar for a flex UI card in case it's a clickable container and has one line title with no paddings

## 24.1.0

### Minor Changes

- [`2d2bfdfb0eb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d2bfdfb0eb) - [ux] A support for borderless embed was added. A new prop 'frameStyle' was added which allows user to choose one of three styles: 'show', 'hide', 'showOnHover'. The prop isFrameVisible was made deprecated and replaced by the new prop.

## 24.0.3

### Patch Changes

- [`9e7d94da3cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9e7d94da3cd) - [ux] Fix hover preview background colour in dark mode

## 24.0.2

### Patch Changes

- [`134bac37edc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/134bac37edc) - [ux] Adds the ChecklistProgress element to Flexible Block View's secondary section

## 24.0.1

### Patch Changes

- [`4661d4f7f7b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4661d4f7f7b) - Add `link clicked` UI event to Smart Card.
- Updated dependencies

## 24.0.0

### Patch Changes

- Updated dependencies

## 23.14.2

### Patch Changes

- Updated dependencies

## 23.14.1

### Patch Changes

- [`4ee60bafc6d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ee60bafc6d) - ED-16603: Remove tooltips from VR tests and make them opt in. To opt-in, add `allowedSideEffects` when loading the page.

## 23.14.0

### Minor Changes

- [`eb2e7a0e762`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eb2e7a0e762) - Add new "showAuthTooltip" prop to SmartCard which shows Auth Tooltip on unauthorised inline Smart Links. This allows us to remove product feature flags in the future

### Patch Changes

- Updated dependencies

## 23.13.3

### Patch Changes

- [`e5b8a41f4da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e5b8a41f4da) - Hover Preview: Reduce hover content re-rendering

## 23.13.2

### Patch Changes

- [`465e0f001fb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/465e0f001fb) - Operational analytics event added to the LinkUrl component. It fires when Link Safety Warning message shown.

## 23.13.1

### Patch Changes

- [`02d341ecf63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02d341ecf63) - [ux] Fix copy button tooltip to show Copy link, not Download

## 23.13.0

### Minor Changes

- [`67cfd8e13d0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/67cfd8e13d0) - LinkUrl component with built-in link safety check added

## 23.12.3

### Patch Changes

- [`27b8d8e0b4b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/27b8d8e0b4b) - [ux] This adds tooltip messages to custom Flexible UI actions.
  Now, when hovering over custom actions, the "content" prop will be displayed in the tooltip.
  This also affects hover preview actions, which now show the tooltip message when hovering over actions inside of the hover preview card.

  Additionally, some changes have been made to Flexible UI block card actions so that the analytics fired have the same attribute action type as hover preview's.

## 23.12.2

### Patch Changes

- [`2c80995745e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2c80995745e) - Embed Preview Modal: Fix title alignment causing by global override (margin-bottom)

## 23.12.1

### Patch Changes

- [`59104c1e92f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/59104c1e92f) - [ux] Fix message shown in unauthorised Smart Link appearances as per design decision

## 23.12.0

### Minor Changes

- [`d5a9fd04c02`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d5a9fd04c02) - Analytics to track dwell time and focus on smart links embedded iframes

### Patch Changes

- Updated dependencies

## 23.11.3

### Patch Changes

- [`08ef315c46d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08ef315c46d) - [ux] Add a copy url button to hover cards.

## 23.11.2

### Patch Changes

- [`6455cf006b3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6455cf006b3) - Builds for this package now pass through a tokens babel plugin, removing runtime invocations of the tokens() function and improving performance.

## 23.11.1

### Patch Changes

- [`44f83adace3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/44f83adace3) - Add documentation for the standalone hover cards on atlaskit.

## 23.11.0

### Minor Changes

- [`32aa136af5c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/32aa136af5c) - Hover Preview: Add actionable element experiment reload analytics

## 23.10.3

### Patch Changes

- [`bca078a37af`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bca078a37af) - Bump to @emotion v11

## 23.10.2

### Patch Changes

- [`cb819660949`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb819660949) - [ux] Add a lonzenge to restricted links.

## 23.10.1

### Patch Changes

- [`d88eda329c1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d88eda329c1) - seperate chunk load errors into it's own analytics event and do retries when lazy loading smartcard-urlcardcontent fails

## 23.10.0

### Minor Changes

- [`aa44d74bf40`](https://bitbucket.org/atlassian/atlassian-frontend/commits/aa44d74bf40) - Expose a new entry point to hover cards at @atlaskit/smart-card/hover-card

## 23.9.3

### Patch Changes

- Updated dependencies

## 23.9.2

### Patch Changes

- Updated dependencies

## 23.9.1

### Patch Changes

- [`484be3ed430`](https://bitbucket.org/atlassian/atlassian-frontend/commits/484be3ed430) - This adds onResolve back to Flexible Block Card

## 23.9.0

### Minor Changes

- [`5c7c532de88`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c7c532de88) - [ux] Add showHoverPreview as a ui parameter to allow hover cards on flex ui links.

## 23.8.2

### Patch Changes

- [`f3aa608f0ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3aa608f0ba) - Update i18n translations from Traduki

## 23.8.1

### Patch Changes

- [`af251caa485`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af251caa485) - Push div from hoverCardComponent into hoverCardContent to allow conditional rendering from inside hoverCardContent.

## 23.8.0

### Minor Changes

- [`d739aa7120c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d739aa7120c) - [ux] Analytics is added for Unauthorised view of Hover Card & to Unauthorised view of an Embed card & to Unauthorised view of a Block Card

## 23.7.3

### Patch Changes

- [`b795ce86cf7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b795ce86cf7) - split single underline into two for unauthorized inline smart links

## 23.7.2

### Patch Changes

- [`ee1c940ea18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ee1c940ea18) - Update unauth message across all Smart Card appearances

## 23.7.1

### Patch Changes

- [`33e0b942925`](https://bitbucket.org/atlassian/atlassian-frontend/commits/33e0b942925) - [ux] Flexible Card: Update unauthorised view text messages and connect button

## 23.7.0

### Minor Changes

- [`3cae92db2b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3cae92db2b6) - [ux] Introduces ChecklistProgress element, adds to Trello Hover Cards

## 23.6.7

### Patch Changes

- [`9110a0daf0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9110a0daf0e) - [ux] Added support of different forbidden views for Block Card with Flexible UI

## 23.6.6

### Patch Changes

- [`b86cebed4a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b86cebed4a3) - Hover Preview: Update actionable element hover state

## 23.6.5

### Patch Changes

- [`0540b6c16a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0540b6c16a4) - Hover Preview: Update action experiment analytics

## 23.6.4

### Patch Changes

- [`e402b41fc94`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e402b41fc94) - [ux] This change removes the icons on flexible block card actions, and also adds analytics for each of the flexible block card actions to maintain parity with the older block card.

## 23.6.3

### Patch Changes

- [`b3c2a297df4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3c2a297df4) - Hover Preview: Actionable element experiment: Reload link after embed view modal is closed

## 23.6.2

### Patch Changes

- [`ac756b23886`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ac756b23886) - Added tooltip for open link in new tab button in hover card

## 23.6.1

### Patch Changes

- [`55429f504d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/55429f504d6) - [ux] Change the 'Preview' button text to 'Full screen view' with a matching icon

## 23.6.0

### Minor Changes

- [`3626f0cc5c0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3626f0cc5c0) - [ux] An unauthorised view was implemented for Hover Card. It will show up if the link is in 'unauthorized' state and it will offer a way for a user to connect their account.

### Patch Changes

- Updated dependencies

## 23.5.2

### Patch Changes

- [`0b8bfb1a2d9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b8bfb1a2d9) - Force http call (and not use cache) when reload action is called
- Updated dependencies

## 23.5.1

### Patch Changes

- [`1070e536838`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1070e536838) - [ux] Hover Preview: Add experiment for actionable element
- Updated dependencies

## 23.5.0

### Minor Changes

- [`9dd3377f9bb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd3377f9bb) - [ux] This adds support for the new Flexible UI Block Card, added behind a feature flag "useFlexibleBlockCard"

### Patch Changes

- Updated dependencies

## 23.4.8

### Patch Changes

- [`ca2b5b1a999`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca2b5b1a999) - [ux] fix Safari opening downloads in the same tab

## 23.4.7

### Patch Changes

- Updated dependencies

## 23.4.6

### Patch Changes

- [`efa366b6ed6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/efa366b6ed6) - Upgrade json-ld-types from 3.1.0 to 3.2.0
- Updated dependencies

## 23.4.5

### Patch Changes

- [`d2d705badea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2d705badea) - [ux] Small fix for the Footer Block that will be used in unresolved states of Block Card with Flexible UI.

## 23.4.4

### Patch Changes

- [`655a52b4c06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/655a52b4c06) - [ux] Update Flex-UI unauthorised views to include provider name

## 23.4.3

### Patch Changes

- [`85de18a2d79`](https://bitbucket.org/atlassian/atlassian-frontend/commits/85de18a2d79) - [ux] Enable text wrapping in contents of unresolved views and allow scrolling in when embed size is small.

## 23.4.2

### Patch Changes

- [`306c81c6551`](https://bitbucket.org/atlassian/atlassian-frontend/commits/306c81c6551) - [ux] Added unresolved views for a Flexible Block card. At the moment these views are not exposed, but they will be used when a Block Card is replaced with Flexible UI.

## 23.4.1

### Patch Changes

- [`9dd78d9e76e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd78d9e76e) - [ux] Update button text on inline card unauthorised view to include provider name

## 23.4.0

### Minor Changes

- [`a86403e5e0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a86403e5e0e) - [ux] This PR adds more actions for use in Flexible UI Smart Links. These are PreviewAction, ViewAction and DownloadAction, and correspond to their Block card counterparts.

  These, unlike the existing actions, will only render when the data for them is available. Therefore, the onClick for these actions are optional.

  Usage:

  ```TSX
  const actions = [
    {
      name: ActionName.PreviewAction,
      onClick: () => console.log('Preview action!'), // will run in addition to normal Preview Action
      ...options,
    },
    {
      name: ActionName.ViewAction,
      onClick: () => console.log('View action!'), // will run in addition to normal View Action
      ...options,
    },
    {
      name: ActionName.DownloadAction,
      onClick: () => console.log('Download action!'), // will run in addition to normal Download Action
      ...options,
    },
  ]

  <Card>
    <TitleBlock actions={actions}>
  </Card>
  ```

## 23.3.1

### Patch Changes

- [`6533e448c53`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6533e448c53) - [ux] Embed: Update unauthorised view text messages and use provider image if available
- Updated dependencies

## 23.3.0

### Minor Changes

- [`be7ac1e0d9b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be7ac1e0d9b) - Add `hideRetry` optional prop to TitleBlock element to allow customers to optout from any retry buttons to be shown (like "connect to preview" or "Can't find link" or "Restricted link, try another account")

## 23.2.0

### Minor Changes

- [`5a2432bf917`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a2432bf917) - [ux] Adds metadata to hover smart cards resolved by trello-object-provider

## 23.1.4

### Patch Changes

- [`e6d8d32e33e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6d8d32e33e) - [ux] Update token usages in the loading shimmer effect to be smoother for inline cards. Updated appearances only visible in applications configured to use the new Tokens API (currently in alpha).

## 23.1.3

### Patch Changes

- [`558e0af2263`](https://bitbucket.org/atlassian/atlassian-frontend/commits/558e0af2263) - Embed Preview: Clean up experiment

## 23.1.2

### Patch Changes

- [`5bdea3e4375`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5bdea3e4375) - Re register card when redux store is recreated

## 23.1.1

### Patch Changes

- [`d2cde0ebdfd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2cde0ebdfd) - fix editor cypress tests and delete media cypress tests
- [`8f95d913495`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f95d913495) - Smart Link: Add default view to inline/block/embed appearance

## 23.1.0

### Minor Changes

- [`b3ba198b928`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b3ba198b928) - [ux] Adds attachment count widget to metadata section

## 23.0.2

### Patch Changes

- [`6af519d2a17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6af519d2a17) - Upgrade json-ld-types from 3.0.2 to 3.1.0
- Updated dependencies

## 23.0.1

### Patch Changes

- [`3b30fc47274`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b30fc47274) - Smart Link card state fix relating to an issue with returning old state if url changes to the one already present in the store.

## 23.0.0

### Patch Changes

- Updated dependencies

## 22.4.0

### Minor Changes

- [`b5278b469b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5278b469b8) - [ux] Allow rendering custom preview of embeds in forbidden view

## 22.3.2

### Patch Changes

- [`d4f3f7afbe4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d4f3f7afbe4) - [ux] Smart Links: Change date format of the Flexible Smart Links' CreatedOn and ModifiedOn element to short month to better accommodate smaller space, including but not limited to Hover Preview.

## 22.3.1

### Patch Changes

- [`829baeda46d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/829baeda46d) - [ux] Update token usages in the loading shimmer effect on inline cards.

## 22.3.0

### Minor Changes

- [`b31cdf70f6e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b31cdf70f6e) - Updates `@emotion/core` v10 to `@emotion/react` v11. There is no expected behaviour change.

### Patch Changes

- Updated dependencies

## 22.2.1

### Patch Changes

- [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`
- Updated dependencies

## 22.2.0

### Minor Changes

- [`9a0c1c39d27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9a0c1c39d27) - Rethrow errors from child component of smart-card so all non API errors will be handed to parent of smart-card

## 22.1.2

### Patch Changes

- [`46059beebbf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/46059beebbf) - - include **tests_external** in build
  - replace usage of @local-cypress package with @cypress
  - bump @cypress from ^6.4.0 to ^7.7.0
  - import cypress types into @atlaskit/in-product-testing tsconfig

## 22.1.1

### Patch Changes

- [`9c7cc4139ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9c7cc4139ec) - Partially remove Lozenge CSS override which conflicts with updated Lozenge styling.
- Updated dependencies

## 22.1.0

### Minor Changes

- [`c908307ef8e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c908307ef8e) - Embed Preview: Update embed preview modal analytics

## 22.0.0

### Major Changes

- [`e2bd5c50884`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e2bd5c50884) - This PR changes how Smart Link Analytics events are defined.
  Analytics events now use object args rather than inline arguments.

  Previously:

  ```
      const analytics = useSmartLinkAnalytics(
          url,
          analyticsHandler,
          undefined,
          location,
      );
      analytics.ui.cardClickedEvent(
          id,
          'block',
          'resolved',
          'this-is-a-test-definition-id',
          'this-is-a-test-extension-key',
      );
  ```

  After change:

  ```
      const analytics = useSmartLinkAnalytics(
          url,
          analyticsHandler,
          undefined,
          location,
      );
      analytics.ui.cardClickedEvent({
          id,
          display: 'block',
          status: 'resolved',
          definitionId: 'this-is-a-test-definition-id',
          extensionKey: 'this-is-a-test-extension-key',
      });
  ```

## 21.3.0

### Minor Changes

- [`1c76ddcd2f3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1c76ddcd2f3) - [ux] Flex-UI: - Add props to generic block: - onRender - onTransitionEnd - blockRef
  HoverCard: - use the above properties in Hover Card to apply transition to preview block and fallback to snippet

## 21.2.0

### Minor Changes

- [`d2439a3c65d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2439a3c65d) - [ux] Embed Preview Modal: Add experiment modal with new UX and resize functionality (behind feature flag)

### Patch Changes

- [`6dd64ce82a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6dd64ce82a8) - [ux] This changes icon loading for Flexible Smart Links. Previously, all `@atlaskit/icon-file-type/glyph/` icons in Flexible Smart Links would be loaded asynchronously. This change makes it so that the `@atlaskit/icon-file-type/glyph/blog` and `@atlaskit/icon-file-type/glyph/document`icons load synchronously in order to better support SSR use cases.
- Updated dependencies

## 21.1.4

### Patch Changes

- [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.
- Updated dependencies

## 21.1.3

### Patch Changes

- [`d0b3a262e03`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d0b3a262e03) - [ux] Embed Preview: Update the new embed preview modal UX

  - Make title smaller
  - Reduce gap between element
  - Hide resize button on smaller screen

## 21.1.2

### Patch Changes

- [`a024e3c77ec`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a024e3c77ec) - Embed Preview: Add embed preview modal (WIP)

## 21.1.1

### Patch Changes

- [`e6a3654a137`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e6a3654a137) - Fix bug where smart cards used `elevation.surface` instead of `elevation.surface.raised` design tokens for card backgrounds.

## 21.1.0

### Minor Changes

- [`fa7f42de6c0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa7f42de6c0) - Flexible UI: Add onActionMenuOpenChange on TitleBlock to detect action dropdown menu open/close

## 21.0.4

### Patch Changes

- [`4347099f4ba`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4347099f4ba) - [ux] Blue highlight is removed for when a user right-clicks on a Flex UI Smart Link

## 21.0.3

### Patch Changes

- [`a657fbfe5e1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a657fbfe5e1) - [ux] Flexible UI: Fix action menu and its tooltip not disappear after an action is clicked

## 21.0.2

### Patch Changes

- [`0a08e95af20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0a08e95af20) - fix bug where scrolling onto an inline link opens hover card in unexpected locations

## 21.0.1

### Patch Changes

- [`919a3124eb8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/919a3124eb8) - turn off autofocus for hover card

## 21.0.0

### Patch Changes

- Updated dependencies

## 20.1.4

### Patch Changes

- [`8df009f4313`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8df009f4313) - fix metadata status for prefetching

## 20.1.3

### Patch Changes

- [`7c0644e5daf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c0644e5daf) - fix on mouse hover functionality for hover cards

## 20.1.2

### Patch Changes

- [`0fb4cccede9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0fb4cccede9) - add on mouse hover to hover card

## 20.1.1

### Patch Changes

- [`59469f2ed1c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/59469f2ed1c) - Add loading state for hover previews

## 20.1.0

### Minor Changes

- [`58eb89c70f5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/58eb89c70f5) - Add onError callback on Card component.
  The callback is triggered when Card component unable to resolve the link.

  Return statuses are errored, fallback, forbidden, not_found and unauthorized.

  Usage

  ```typescript
  const onError = (data: { status: string; url: string }) => {};

  <Card appearance="inline" onError={onError} url="https://link-url" />;
  ```

### Patch Changes

- [`e15410365b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e15410365b2) - - export types/functions in linking common to be used in smart card

  - add flag to card action to override re-using previous 'resolved' state

  - add prop to cardState which reflects the metadata state, can be pending, resolved or errored

  - modified reducer and dispatchers to handle these new props

- Updated dependencies

## 20.0.6

### Patch Changes

- [`afb579e5778`](https://bitbucket.org/atlassian/atlassian-frontend/commits/afb579e5778) - Flexible UI: Fix styling on MetadataBlock and FooterBlock in Firefox and Safari browser

## 20.0.5

### Patch Changes

- [`6e4810f82c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e4810f82c3) - wrap hover preview in error boundary and emit failure event

## 20.0.4

### Patch Changes

- [`2a5cc0d4297`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2a5cc0d4297) - Block: Update pull request link avatar to author (attributedTo)

## 20.0.3

### Patch Changes

- [`4c2c26ca270`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c2c26ca270) - Fix regression in logos in BlockCard footers in preview mode cuased by the `appearance` prop.
- [`d4133fe0edc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d4133fe0edc) - Fix regression in logos in BlockCard footers caused by inheriting ProseMirror styles after a change in @atlaskit/logo internals.
- Updated dependencies

## 20.0.2

### Patch Changes

- [`12950ccea1b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12950ccea1b) - Hover Preview: Stop hover preview from propagating click event to parent element

## 20.0.1

### Patch Changes

- [`3e4f8e1490a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e4f8e1490a) - Hover Preview: Fix Hover Preview shows on top of Preview modal

## 20.0.0

### Patch Changes

- Updated dependencies

## 19.2.0

### Minor Changes

- [`cd5e63258cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd5e63258cd) - Moved extractors to linking-common/extractors

### Patch Changes

- Updated dependencies

## 19.1.31

### Patch Changes

- [`34d17437062`](https://bitbucket.org/atlassian/atlassian-frontend/commits/34d17437062) - Flexible UI: Add DueOn element
  Hover Preview: Update Atlas metadata

## 19.1.30

### Patch Changes

- [`3a2bc5af606`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a2bc5af606) - Flexible UI: Add pull request source and target branch element (text)
  Hover Preview: Update Bitbucket metadata for pull request link

## 19.1.29

### Patch Changes

- [`acfb4cbb01f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/acfb4cbb01f) - set hover card z-index to 511 to go over issue view modal

## 19.1.28

### Patch Changes

- [`455538b6a3f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/455538b6a3f) - use useFeatureFlag hook to get hover preview FF

## 19.1.27

### Patch Changes

- [`98d3f88e428`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98d3f88e428) - This PR adds external element typings for Flexible UI metadata.
  This means code completion will now be available when an element has a prop that can be overridden.
  As of this PR, these are the `CreatedOn` and `ModifiedOn` elements, which now accept some `text` which will override the existing text.

  This PR also exposes the overrideCss prop, allowing integrators to supply any CSS for their elements.

## 19.1.26

### Patch Changes

- [`00c79cca5b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00c79cca5b0) - hover card white space changes

## 19.1.25

### Patch Changes

- [`de8de71a806`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de8de71a806) - Hover Preview: Fix Hover Preview analytics event details get applied to other Smart Links analytics
- [`ae023956743`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ae023956743) - Smart Links Analytics types are exported to allow their usage from outside of the package

## 19.1.24

### Patch Changes

- [`cd729a0a41b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd729a0a41b) - [ux][ed-15030] Set the background color of smart cards properly in dark mode

## 19.1.23

### Patch Changes

- [`f538640e3a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f538640e3a5) - fix: Previously the .reload() action would not propagate changes through to the smart-card state in some scenarios. This has been amended by making it an explicit Redux action.
- Updated dependencies

## 19.1.22

### Patch Changes

- [`c6978e3a40c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c6978e3a40c) - This update adds Destination product and subproduct (core, servicedesk, software, etc.) analytics now available in the Smart Link ui card clicked event. At the time of writing, only Jira links have this functionality.

## 19.1.21

### Patch Changes

- [`b39f43e68c3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b39f43e68c3) - [ux] Hover Preview: Add CreatedBy to 3P link metadata

  [ux] Flexible UI: Text based elements now wrap and truncate within metadata group.

## 19.1.20

### Patch Changes

- [`0b7abdcf058`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0b7abdcf058) - Flexible UI: Fix PreviewBlock not showing image loading skeleton

## 19.1.19

### Patch Changes

- [`f7aedc6cf7d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7aedc6cf7d) - [ux] A new element 'LatestCommit' was added in FlexibleUI for Smart Links. It displays the latest commit of a repository. Version of package 'json-ld-types' was upgraded to 2.4.2
- Updated dependencies

## 19.1.18

### Patch Changes

- [`b26dd70a1e6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b26dd70a1e6) - This PR adds the ability for an integrator to provide a string via `placeholder` which will be displayed instead of the url while the CardWithURLContent component is not mounted (i.e. not currently being observed). This should help with performance use cases where some text is required to be displayed before the full Smart Link component is rendered.

  Usage:

  ```Typescript
  // This will render the string "spaghetti" before the Smart Link is loaded.
  <Card url={url} appearance='inline' placeholder='spaghetti'/>
  ```

## 19.1.17

### Patch Changes

- [`46f6c1a70e3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/46f6c1a70e3) - Hover Preview: Improve analytics and update Flexible UI usage within Hover Preview

## 19.1.16

### Patch Changes

- [`47058879f49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47058879f49) - [ux] Text customisation made possible for Flexible UI fields “ModifiedOn“ & “CreatedOn" (example: <TitleBlock metadata={[ { name: ElementName.CreatedOn, text: 'Last commit on' }]} />)

## 19.1.15

### Patch Changes

- [`23445a4d2ca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/23445a4d2ca) - Hover Preview: Update analytics details

## 19.1.14

### Patch Changes

- [`9d57264a033`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d57264a033) - This update adds an exposed analytics hook, which will pave the way for future usage of Smart Link analytics outside of the smart-card component.

  # Usage of `useSmartLinkAnalytics`

  You can now use `useSmartLinkAnalytics` to create and modify a set of analytics events for the `Card` component to consume.

  ```Typescript

  const CardComponentWithDifferentAnalytics = () => {

    // You can now supply a location, and this will be used in all events.
    const location = 'this-is-a-test-product';

    // id is optional, but with CRUD operations, you can persist this to keep analytics events related to one link.
    const id = 'test-id';

    // By default, all events will be supplied with location and id as a fallback.
    // Calling an event will send it with the default Smart Links analytics channel
    const analytics = useSmartLinkAnalytics(
      url,
      analyticsHandler,
      id,
      location,
    );

    // You can now use all the analytics that Smart Links uses like so:
    analytics.ui.cardClickedEvent(id, "block", "resolved");

    // You can also override an existing event:
    // WARNING: Please reach out to #help-linking-platform before modifying events!
    analytics.ui.renderSuccessEvent = () => {console.log("spaghetti rendered!")};

    // Finally, pass your props in as below!
    return (
      <Card id={id} url={url} appearance="block" analyticsEvents={analytics} />
    );
  }

  ```

  This update also contains a minor update regarding `location` and `status` for two events. They are now as follows:

  #### `ui.cardClickedEvent`

  - Now contains `location` as described by the `useSmartLinkAnalytics` hook.
  - Now is fired in `unauthorized`, `errored` and `forbidden` states, with the `status` attribute representing the state of the event.

  #### `ui.renderSuccessEvent`

  - Now contains the `status` attribute, representing the state of the event (`unauthorized`, `errored`, `resolved`, etc.)

## 19.1.13

### Patch Changes

- [`a575379772a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a575379772a) - Hover Preview: Update z-index

## 19.1.12

### Patch Changes

- [`b68e80d658f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b68e80d658f) - add hover previews feature flag
- Updated dependencies

## 19.1.11

### Patch Changes

- [`7833a526777`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7833a526777) - - Transfer i18n from @atlaskit/media-ui to @atlaskit/smart-card
  - Remove @atlaskit/media-ui dependency

## 19.1.10

### Patch Changes

- [`009e3475b29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/009e3475b29) - Duplicate isIntersectionObserverSupported from media-ui to smart-card

## 19.1.9

### Patch Changes

- [`003ac36263e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/003ac36263e) - Flexible UI: Fix preview block showing white space below image in Safari

## 19.1.8

### Patch Changes

- [`81968c216ce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/81968c216ce) - Flexible UI: Fix clickableContainer not triggering analytics event

## 19.1.7

### Patch Changes

- [`08bdfa654e2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08bdfa654e2) - Flexible UI: Add option to hide link tooltip on TitleBlock.

## 19.1.6

### Patch Changes

- [`28410ec919d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/28410ec919d) - Flexible UI: Passing JsonLD response on authFlow disabled
- Updated dependencies

## 19.1.5

### Patch Changes

- [`db78a813922`](https://bitbucket.org/atlassian/atlassian-frontend/commits/db78a813922) - Add error handling to smart-card ssr component

## 19.1.4

### Patch Changes

- [`cd2e7183aa5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd2e7183aa5) - Flexible UI: Fix action tooltips not displayed on hover

## 19.1.3

### Patch Changes

- [`3de372f6670`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3de372f6670) - Hover Previews: use black flex-ui theme

## 19.1.2

### Patch Changes

- [`3a0fdf3c651`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a0fdf3c651) - change hover previews to show preview over snippet when its available

## 19.1.1

### Patch Changes

- Updated dependencies

## 19.1.0

### Minor Changes

- [`6b7ba46a96b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b7ba46a96b) - [MEX-1456] Remove unused infinite scroll from Media-UI and Remove lodash from Media package

### Patch Changes

- [`7c926026ca3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c926026ca3) - Adds testId to FlexibleCard test.
- Updated dependencies

## 19.0.4

### Patch Changes

- [`3eea7c153d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3eea7c153d6) - Handle onResolve prop from smart-card in flexible-card and use the prop inside hover-card to dynamically update popup positioning

## 19.0.3

### Patch Changes

- [`cae40e59c49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cae40e59c49) - Show relative date for dates less then 7 days away (flexible ui)

## 19.0.2

### Patch Changes

- [`f3026520fc6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3026520fc6) - Fix long tti times for UFO smart-link-rendered experience

## 19.0.1

### Patch Changes

- [`49f905e71e5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49f905e71e5) - Flexible UI: Add API document and update prop types.

## 19.0.0

### Major Changes

- [`6ee499cbb73`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ee499cbb73) - - Add @atlaskit/link-provider as peerDependency.

  - Use Provider/Client from @atlaskit/link-provider and remove local version.
  - Re export moved things from @atlaskit/link-provider to make adoption easier

  These changes are needed in order to make future adoption of smart-card easier from consumers and to mitigate breaking changes.

  ### Before

  ```
  import { Provider, Client, Card } from '@atlastkit/smart-card'

  <Provider client={new Client()}>
    <Card />
  </Provider>
  ```

  ### Before

  ```
  import { Provider, Client } from '@atlastkit/link-provider'
  import { Card } from '@atlastkit/smart-card'

  <Provider client={new Client()}>
    <Card />
  </Provider>
  ```

### Patch Changes

- Updated dependencies

## 18.0.22

### Patch Changes

- [`8b9f08cbc1c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b9f08cbc1c) - [ux] Default representation for Slack links was changed from 'block' to 'inline'
- [`f4811ca8c6a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4811ca8c6a) - add provider based metadata to hover previews

## 18.0.21

### Patch Changes

- [`ffaf122189e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ffaf122189e) - Flexible UI: TitleBlock is now composory to display Flexible UI on Smart Links

## 18.0.20

### Patch Changes

- [`451f99db28a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/451f99db28a) - Flexible UI: Improve link title truncate to support url string

## 18.0.19

### Patch Changes

- [`c09b670ffa1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c09b670ffa1) - Flexible UI: Add container clickable option and improve keyboard navigation

## 18.0.18

### Patch Changes

- [`63f6330be06`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63f6330be06) - [ux] Flexible UI: Change loading spinner on resolving view to loading skeleton

## 18.0.17

### Patch Changes

- [`79b365c3757`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79b365c3757) - [ux] If the "authFlow: disabled" prop is provided on the Smart Card Provider, then the call to action to authenticate forbidden links will also be disabled (in addition to the existing behaviour where only unauthenticated links have the call to action disabled).

## 18.0.16

### Patch Changes

- [`63d05619104`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63d05619104) - [ux] Instrumented `@atlaskit/smart-card` with the new theming package, `@atlaskit/tokens`.

  New tokens will be visible only in applications configured to use the new Tokens API (currently in alpha).
  These changes are intended to be interoperable with the legacy theme implementation. Legacy dark mode users should expect no visual or breaking changes.

## 18.0.15

### Patch Changes

- [`c2a240de738`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2a240de738) - Add inline documentation for Flexible UI
- [`6976489a51a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6976489a51a) - Flexible UI: Enable css override for actions
- [`7d4e18ffddb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d4e18ffddb) - instrument analytics events for hover card
- [`a123e96fc62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a123e96fc62) - expose prop on smart card
- [`5af3b7aba2a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5af3b7aba2a) - Flexible UI: Fix icon-only action padding
- [`3e19e206713`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3e19e206713) - Flexible UI: Enable css override on elements
- [`750cb867124`](https://bitbucket.org/atlassian/atlassian-frontend/commits/750cb867124) - Flexible UI: Enable css override on blocks

## 18.0.14

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4
- Updated dependencies

## 18.0.13

### Patch Changes

- Updated dependencies

## 18.0.12

### Patch Changes

- [`b90896c18cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90896c18cd) - move helpers and types to @atlaskit/linking-common and import them

## 18.0.11

### Patch Changes

- [`ec98e2d8ebc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ec98e2d8ebc) - feat: Expose `useSmartLinkReload` hook.

  ### Example Usage

  As a consumer if you want to be able to reload the data backing a Smart Link, you may do:

  ```tsx
  export const MyComponent = () => {
    const reloader = useSmartLinkReload(url, analytics);

    return (
      <MyInterfaceItem>
        <Card />
        <Button text="Retry" onClick={reloader} />
      </MyInterfaceItem>
    );
  };
  ```

## 18.0.10

### Patch Changes

- [`b687926f768`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b687926f768) - Fix bug where individual action item was not hidden by default with showActionOnHover flag

## 18.0.9

### Patch Changes

- [`6adaa6b5c18`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6adaa6b5c18) - Updated default renderer onClick to not fire on a Flexible UI link to prevent links from being openned twice

## 18.0.8

### Patch Changes

- [`d9b55e7cd29`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9b55e7cd29) - Add classname for placeholder element that is shown while we load js module

## 18.0.7

### Patch Changes

- [`1f377bd17a4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f377bd17a4) - Added open in new tab action to titleblock and refactored tests

## 18.0.6

### Patch Changes

- [`9945f8983f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9945f8983f0) - TitleBlock now has "anchorTarget" property

## 18.0.5

### Patch Changes

- [`54d8579fe05`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54d8579fe05) - Flexible UI: Reduce link title font weight

## 18.0.4

### Patch Changes

- [`dd4ae8205d1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd4ae8205d1) - Add actions for non-resolved view of flexible ui

## 18.0.3

### Patch Changes

- [`7dc2fb8eb8b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7dc2fb8eb8b) - Handle exceptions coming from client

## 18.0.2

### Patch Changes

- [`cff21812950`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cff21812950) - add smart link actions to footer of hover card, plus small styling changes

## 18.0.1

### Patch Changes

- [`75c16ae4964`](https://bitbucket.org/atlassian/atlassian-frontend/commits/75c16ae4964) - refactor code to use atlaskit/popup instead of atlaskit/tooltip as a base component

## 18.0.0

### Major Changes

- [`dd429d9fdca`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dd429d9fdca) - [ux] EDM-2822: Fix smart link wraps just after the icon

### Patch Changes

- [`fb1cf506701`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb1cf506701) - [ux] ED-14487: polyfill ResizeObserver and IntersectionObserver for unit tests, but mock isIntersectionObserverSupported() for tests related to smart-cards
- Updated dependencies

## 17.7.12

### Patch Changes

- [`f9bbe6d0a56`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f9bbe6d0a56) - Add View, Vote and React badge elements

## 17.7.11

### Patch Changes

- [`ca8c8db1440`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ca8c8db1440) - Flexible UI: Add separator between text/date-time elements

## 17.7.10

### Patch Changes

- [`e04b58c623e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e04b58c623e) - Add EditAction

## 17.7.9

### Patch Changes

- [`63d4f963f72`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63d4f963f72) - Flexible UI: Set PreviewBlock image aspect ratio to 16:9

## 17.7.8

### Patch Changes

- [`d75ce5b847d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d75ce5b847d) - Add link click analytics to flexible ui title block component

## 17.7.7

### Patch Changes

- [`c01f6404d0c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c01f6404d0c) - Add ability to trigger actions for a Smart Link from outside of the Smart Link card.

  Example usage:

  ```tsx
  import { useSmartLinkActions } from '@atlaskit/smart-card/hooks';

  const ExampleToolbar = () => {
    const actions = useSmartLinkActions({
      url,
      appearance: 'block',
      analyticsHandler: analytics,
    });

    return (
      <ExampleToolbarWrapper>
        {actions.map((action) => (
          <Tooltip content={action.text}>
            <ExampleToolbarItem key={action.id} onClick={action.invoke}>
              {idToIcon[action.id] ?? action.id}
            </ExampleToolbarItem>
          </Tooltip>
        ))}
      </ExampleToolbarWrapper>
    );
  };
  ```

## 17.7.6

### Patch Changes

- [`0e5c8b501d6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e5c8b501d6) - add test for when hover preview prop is not provided to inline card

## 17.7.5

### Patch Changes

- [`b89ef291fb9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b89ef291fb9) - EDM-2902: Move common component out of BlockCard

## 17.7.4

### Patch Changes

- [`ff7b1126682`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff7b1126682) - Set up base component and relevant tests for hover previews

## 17.7.3

### Patch Changes

- [`474d69913ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/474d69913ef) - Title block can have an action visible only on hover

## 17.7.2

### Patch Changes

- [`9066a1e8154`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9066a1e8154) - EDM-2926: Add title override for title block

## 17.7.1

### Patch Changes

- [`123201c5105`](https://bitbucket.org/atlassian/atlassian-frontend/commits/123201c5105) - Add ability to add custom action item

## 17.7.0

### Minor Changes

- [`924aa854655`](https://bitbucket.org/atlassian/atlassian-frontend/commits/924aa854655) - Replaced deprecated dependency with @atlaskit/droplist and @atlaskit/item with @atlaskit/dropdown-menu in block card actions list
- [`fb15a8a421c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fb15a8a421c) - move smart-card views and helpers from media-ui into smart-card

### Patch Changes

- Updated dependencies

## 17.6.0

### Minor Changes

- [`0cab291e19e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0cab291e19e) - Add "more" and dopdown for actions when there is more then 2

## 17.5.3

### Patch Changes

- [`e68f0f554fa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e68f0f554fa) - remove mousedown handler for inline links and add a vr test for the logic

## 17.5.2

### Patch Changes

- [`0fb7e85e70a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0fb7e85e70a) - Flexible UI: Add PreviewBlock

## 17.5.1

### Patch Changes

- [`238facb8e1a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/238facb8e1a) - Flexible UI: Add Preview element

## 17.5.0

### Minor Changes

- [`be8dc55e85d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be8dc55e85d) - [ux] Add Footer block

## 17.4.3

### Patch Changes

- [`5a50882a528`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5a50882a528) - Flexible UI: Remove safeToken function

## 17.4.2

### Patch Changes

- [`c8285bdcde4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c8285bdcde4) - Flexible UI: Add SnippetBlock

## 17.4.1

### Patch Changes

- [`ecf130ca7d8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ecf130ca7d8) - Flexible UI: Remove check on Smart Links appearance

## 17.4.0

### Minor Changes

- [`392b7d2b98f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/392b7d2b98f) - Add Provider element

## 17.3.2

### Patch Changes

- [`02ed34221ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/02ed34221ef) - Flexible UI: Add Snippet element

## 17.3.1

### Patch Changes

- [`66dc86e0331`](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dc86e0331) - Flexible UI: Check for null element

## 17.3.0

### Minor Changes

- [`dab29fc6697`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dab29fc6697) - [ux] Flexible UI: AvatarGroup sizing updated for small and medium size

### Patch Changes

- [`25408fac413`](https://bitbucket.org/atlassian/atlassian-frontend/commits/25408fac413) - Flexible UI: Add MetadataBlock example

## 17.2.1

### Patch Changes

- [`1d701660954`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1d701660954) - Refactored deleteAction into a re-usable action component

## 17.2.0

### Minor Changes

- [`3200ce3abc5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3200ce3abc5) - Flexible UI: Add MetadataBlock

## 17.1.0

### Minor Changes

- [`c73cde16d49`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c73cde16d49) - [ux] Jira Work Management (JWM) List and Board view links will be converted into smart link embed by default
- [`948a410185b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/948a410185b) - [ux] New elements were added ModifiedOn and CreatedOn
- [`6648e62bbfe`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6648e62bbfe) - ### Expose smart-card SSR component

  There is a new entry point in place for SSR which keeps the same API as the existing one, and can be used like:

  ```
  import { CardSSR } from '@atlaskit/smart-card/ssr'

  <CardSSR
    url="http://atlassian.com"
    appearance="inline"
  />
  ```

- [`7f0d83f7a05`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7f0d83f7a05) - Remove Styled Components from smart-card

### Patch Changes

- [`3c4e3cf2bd3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c4e3cf2bd3) - Flexible UI: Update sizing and styling
- [`15b67162087`](https://bitbucket.org/atlassian/atlassian-frontend/commits/15b67162087) - Flexible UI: Add LinkIcon element
- [`a53d41a0d93`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a53d41a0d93) - Flexible UI: Add TitleBlock error views
- [`12943538dde`](https://bitbucket.org/atlassian/atlassian-frontend/commits/12943538dde) - Flexible UI: Add element - Title
- [`a46aabfcc71`](https://bitbucket.org/atlassian/atlassian-frontend/commits/a46aabfcc71) - Flexible UI: TitleBlock metadata
- [`8e1979f21ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e1979f21ef) - Flexible UI: Update action styling and sizing
- [`be56b069142`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be56b069142) - Flexible UI: Add element type Text
- [`6b6fa61b644`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b6fa61b644) - Flexible UI: Add mock data to examples
- [`140f262c0c6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/140f262c0c6) - Flexible UI: Add icon custom render function to support emoji renderer
- [`856b888358b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/856b888358b) - Added a lozenge element for Smart Links Flexible UI
- [`dc0752db477`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc0752db477) - Flexible UI: Fix icon size not showing properly
- [`d499df97cbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d499df97cbb) - Flexible UI: Fix empty element group showing
- [`6d50e8c688e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d50e8c688e) - Flexible UI: Add priority badge element
- [`76851a3b80f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76851a3b80f) - Flexible UI: Add resolved view
- [`29fab08e186`](https://bitbucket.org/atlassian/atlassian-frontend/commits/29fab08e186) - Flexible UI: Fix icon/badge positioning
- [`121361e494b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/121361e494b) - Flexible UI: Convert css object style to string style
- [`7c2030d8ee6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c2030d8ee6) - use @atlaskit/media-test-helpers/smart-card-state
- [`e528d830cda`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e528d830cda) - Flexible UI: Update design token
- [`45d97511958`](https://bitbucket.org/atlassian/atlassian-frontend/commits/45d97511958) - Flexible UI: Add badge element
- [`4f8e3da4bbf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4f8e3da4bbf) - Added AvatarGroup for flexible ui
- [`cb7bcebb612`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb7bcebb612) - Flexible UI: Add error views
- [`8b39fd95409`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8b39fd95409) - Flexible UI: Update badge colour
- [`b38f4e08b8a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b38f4e08b8a) - Flexible UI: Add TitleBlock
- [`5d20795553e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5d20795553e) - Flexible UI: Update forbidden messages
- [`31dc57d1a21`](https://bitbucket.org/atlassian/atlassian-frontend/commits/31dc57d1a21) - Flexible UI: Fix badge size
- [`63993a75a59`](https://bitbucket.org/atlassian/atlassian-frontend/commits/63993a75a59) - Flexible UI: Update badge element to support image icon
- [`919e2b13299`](https://bitbucket.org/atlassian/atlassian-frontend/commits/919e2b13299) - Flexible UI: Add tooltip to link element
- [`1f9c5bddeb9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f9c5bddeb9) - Flexible UI: TitleBlock resolving view
- [`7613398d13a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7613398d13a) - Added DeleteAction to flexible UI
- [`f56022576da`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f56022576da) - Flexible UI: Update design token
- [`d764e29dd17`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d764e29dd17) - update docs to include staging login url
- Updated dependencies

## 17.0.1

### Patch Changes

- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Flexible UI: Add base element - Icon
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Flexible UI: Add base element - Link
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Update doc
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Flexible UI: Add base block and container
- Updated dependencies

## 17.0.0

### Major Changes

- [`47f58da5946`](https://bitbucket.org/atlassian/atlassian-frontend/commits/47f58da5946) - ED-13322, ED-13324, ED-13326, ED-13323, ED-13204: Upgrade and support react-intl@^5.18.1 including breaking API changes, types and tests in atlassian-frontend packages

  What changed: Upgraded our react-intl support from ^2.6.0 to ^5.18.1. This means editor packages now rely on consumers installing ^5.18.1, otherwise editor usage of react-intl will mismatch with actual installed react-intl APIs.
  Why change was made: As part of a coordinated upgrade effort across AF packages, as react-intl v2 is quite dated.
  How consumer should update their code: Ensure react-intl ^5.18.1 is installed in consuming applications.

  Upgrade guide: To consume atlassian-frontend packages that use react-intl5 setup a second provider for the new version, using an npm alias

  ```js
  "react-intl": "^2.6.0",
  "react-intl-next": "npm:react-intl@^5.18.1",
  ```

  ```js
  import { IntlProvider } from 'react-intl';
  import { IntlProvider as IntlNextProvider } from 'react-intl-next';

  return (
    <IntlProvider
      key={locale}
      data-test-language={locale}
      locale={locale}
      defaultLocale={DEFAULT_LOCALE}
      messages={messages}
    >
      <IntlNextProvider
        key={locale}
        data-test-language={locale}
        locale={locale}
        defaultLocale={DEFAULT_LOCALE}
        messages={messages}
      >
        {children}
      </IntlNextProvider>
    </IntlProvider>
  );
  ```

### Patch Changes

- Updated dependencies

## 16.3.0

### Minor Changes

- [`af29def3dac`](https://bitbucket.org/atlassian/atlassian-frontend/commits/af29def3dac) - expose missing smart-card classnames

  ```
  import {
    blockCardResolvedViewByClassName,
    blockCardForbiddenViewLinkClassName,
    blockCardContentClassName,
    blockCardContentHeaderClassName,
    blockCardContentHeaderNameClassName,
    blockCardNotFoundViewClassName,
    blockCardErroredViewClassName,
  } from '@atlaskit/smart-card'

  css`
    .${blockCardContentHeaderNameClassName} {
      background-color: red;
    }
  `
  ```

- [`e7b325a766c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e7b325a766c) - [ux] Jira Work Management (JWM) Calendar view links will be converted into smart link embed by default
- [`b2664acc865`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b2664acc865) - [ux] Jira Work Management (JWM) Timeline view links will be converted into smart link embed by default

### Patch Changes

- [`bea1d5c0a96`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bea1d5c0a96) - Add UFO instrumentation for action invocation. Send extensionKey for client actions as intended, instead of definitionId
- [`89aa3e3f314`](https://bitbucket.org/atlassian/atlassian-frontend/commits/89aa3e3f314) - Update dependency of dropdown menu to the lite mode version. Update all usages to cater to the new API. The padding within dropdown menu items is 8px more, which makes the menu look bigger.
- Updated dependencies

## 16.2.1

### Patch Changes

- [`d7f743bbbdd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7f743bbbdd) - useCallback for dispatchAnalytics to prevent multiple events firing on hover

## 16.2.0

### Minor Changes

- [`0448db49f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0448db49f68) - Implement UFO instrumentation events pattern

### Patch Changes

- [`df4e03438f2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df4e03438f2) - Add post render authentication experience using UFO
- [`7d13155a61c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7d13155a61c) - Updated smart links to UFO with perf metrics
- [`572581a2ae3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/572581a2ae3) - Polaris (Jira Product Discovery) anonymous views unfurling embed by default.
- Updated dependencies

## 16.1.1

### Patch Changes

- Updated dependencies

## 16.1.0

### Minor Changes

- [`978e9280610`](https://bitbucket.org/atlassian/atlassian-frontend/commits/978e9280610) - add support for platform in BlockCard component

### Patch Changes

- [`b90c0237824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b90c0237824) - Update package.jsons to remove unused dependencies.
- Updated dependencies

## 16.0.0

### Major Changes

- [`86aeb07cae3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/86aeb07cae3) - EDM-2264: allow embed resize events from all domains

  **Note:**

  The breaking change in this commit is a rename from `IframelyResizeMessageListener` to `EmbedResizeMessageListener`. The functionality of the component itself remains the same for all consumers.

### Minor Changes

- [`b6aabf0bfe4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b6aabf0bfe4) - Expose useSmartLinkEvents hook from smart-card
- [`00de5482a5a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/00de5482a5a) - # expose smart-link selectors

  Documentation with visual examples: https://hello.atlassian.net/wiki/spaces/~hzarcogarcia/pages/1250247546/How+to+use+smart+link+classnames

  ```
  import {
    contentFooterClassName,
    metadataListClassName,
    blockCardResolvingViewClassName,
    blockCardResolvedViewClassName,
    blockCardForbiddenViewClassName,
    blockCardIconImageClassName,
    loadingPlaceholderClassName
  } from '@atlaskit/smart-card';

  // Example usage:

  css`
    .${contentFooterClassName} {
      background-color: red;
    }
  `
  ```

- [`17776bda189`](https://bitbucket.org/atlassian/atlassian-frontend/commits/17776bda189) - - Improve Smart Links providers and batch requests mechanism
  - Remove non-functional props that impact reloading
- [`8e6a1034cfd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8e6a1034cfd) - EDM-1730: added in-product Cypress tests for Smart Links

### Patch Changes

- [`5c5f3cccdd0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5c5f3cccdd0) - Revert changes to fix a regression CEMS-2063
- [`ab8f0df38a0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ab8f0df38a0) - Replacing bottleneck library with p-throttle
- [`c0d4f38bf63`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0d4f38bf63) - Fix regexp for Polaris (Jira Product Discovery) View links.
- Updated dependencies

## 15.5.0

### Minor Changes

- [`96b6fb1c6b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96b6fb1c6b9) - Add sandbox property to Smart Links embed
- [`c0fa45830e1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0fa45830e1) - Add sandbox prop to Smart Links block card preview iframe

### Patch Changes

- Updated dependencies

## 15.4.0

### Minor Changes

- [`3c79bfd15b4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c79bfd15b4) - Add sideEffects false for better tree-shaking support

### Patch Changes

- Updated dependencies

## 15.3.1

### Patch Changes

- [`d9cfa5c45dc`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9cfa5c45dc) - Render Polaris (Jira Product Discovery) view as an embed by default
- Updated dependencies

## 15.3.0

### Minor Changes

- [`f7ff2c84451`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f7ff2c84451) - bump json-ld-types from 2.2.2 to ^2.3.0"
- [`c9dd0243320`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c9dd0243320) - [ux] prepend page title with emoji icon for smart link and block card

### Patch Changes

- Updated dependencies

## 15.2.1

### Patch Changes

- [`277ed9667b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/277ed9667b2) - Fixed media bundle names following atlassian-frontend linting rules
- Updated dependencies

## 15.2.0

### Minor Changes

- [`e494a28d544`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e494a28d544) - New exported member `embedHeaderHeight` is added. Also all the instances of `onResolve` callback now return an object that contains optional extra property `aspectRatio`.

### Patch Changes

- Updated dependencies

## 15.1.0

### Minor Changes

- [`dfbb0a86959`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dfbb0a86959) - [ux] Add ability for avatars to be shown in card view through adding the extractBlockUsers method
- [`203e4021ada`](https://bitbucket.org/atlassian/atlassian-frontend/commits/203e4021ada) - [ux] Add support of .docx, .xlsx, .pptx, .rar mime types and folder; fix .doc and .ppt

### Patch Changes

- [`77cb0c11652`](https://bitbucket.org/atlassian/atlassian-frontend/commits/77cb0c11652) - Fix person avatar in block view
- [`9f46fd1bdc5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f46fd1bdc5) - EDM-1835: Slack message links will now be rendered as block by default
- Updated dependencies

## 15.0.1

### Patch Changes

- [`845dee52a4a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/845dee52a4a) - [ux] Adds additional request access metadata to forbidden urls if avalible
- [`8d6a82191ab`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d6a82191ab) - Removes unused props from icon usage.
- [`695ce4fe717`](https://bitbucket.org/atlassian/atlassian-frontend/commits/695ce4fe717) - Adds additional request access metadata to forbidden urls if avalible
- Updated dependencies

## 15.0.0

### Major Changes

- [`08c624ac7b8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/08c624ac7b8) - [ux] `inlinePreloaderStyle` prop was added to SmartCard. It can be either `'on-left-with-skeleton'` or a `'on-right-without-skeleton'`

### Patch Changes

- [`5fb017ec308`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5fb017ec308) - feat: EDM-1692, add Smart Links showcase
- [`5216ebed3b6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5216ebed3b6) - Expose and use atlassian-icon, jira-icon entry points
- [`8f0196da8a2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f0196da8a2) - NO-ISSUE opimtise bottleneck import for size
- Updated dependencies

## 14.8.5

### Patch Changes

- [`e604c297faf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e604c297faf) - Prevent resolveUnsupported errors being sent as unresolved events to stop SLO pollution.

## 14.8.4

### Patch Changes

- [`d9d5322b260`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d9d5322b260) - [ux] Render as a blue link in adf when there is a fatal error on smartcard
- Updated dependencies

## 14.8.3

### Patch Changes

- [`eda409bf20`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eda409bf20) - Handle network errors in smart-card client
- Updated dependencies

## 14.8.2

### Patch Changes

- [`965c783580`](https://bitbucket.org/atlassian/atlassian-frontend/commits/965c783580) - add override references for Trello only

## 14.8.1

### Patch Changes

- [`fae156831b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fae156831b) - Removed unused devDependency (was only used in one example, which has been refactored)
- [`df97510b77`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df97510b77) - handle backend errors in smart-link dataloader
- [`b4cd19ad66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b4cd19ad66) - To allow jira roadmap link with query param to convert to embed view
- Updated dependencies

## 14.8.0

### Minor Changes

- [`6bef7adf66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6bef7adf66) - `Card` component expects optional `embedIframeRef` iframe ref. New `IframelyResizeMessageListener` HOC component export is introduced.

### Patch Changes

- [`c66e17de46`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c66e17de46) - Add CDN version of Iframely domain names for validation
- [`be5153bf8d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/be5153bf8d) - dont access status of undefined responses
- Updated dependencies

## 14.7.0

### Minor Changes

- [`48995f73b2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48995f73b2) - Create entry points to export internal API isolated from UI changes.

### Patch Changes

- Updated dependencies

## 14.6.1

### Patch Changes

- [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 14.6.0

### Minor Changes

- [`950ed4f24c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/950ed4f24c) - [ux] The embed card will now fallback to a inlineCard instead of blockCard in mobile

### Patch Changes

- [`09394e2986`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09394e2986) - EDM-668: exporting types for better typings support in Editor Core
- [`f5f91bc98d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f5f91bc98d) - ED-10417 Unskip smart link hooks tests
- Updated dependencies

## 14.5.0

### Minor Changes

- [`09de4533b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09de4533b0) - Make findPattern available to consumers
- [`3ae1d5929f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3ae1d5929f) - [ux] Jira roadmap of classic projects will now be an embedCard by default

### Patch Changes

- Updated dependencies

## 14.4.4

### Patch Changes

- [`676241b24e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/676241b24e) - HOT-93133: fix analytics for Smart Links

## 14.4.3

### Patch Changes

- [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 14.4.2

### Patch Changes

- Updated dependencies

## 14.4.1

### Patch Changes

- [`2ac834240e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2ac834240e) - Undo analytics-next file restructure to allow external ts definitions to continue working

## 14.4.0

### Minor Changes

- [`22105274d2`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22105274d2) - Only render smart-card when context.value is available
- [`c2e573479c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c2e573479c) - EDM-937: added prefetching to Smart Links rendering path.

  As of this version of `@atlaskit/smart-card`, when a Smart Link is initially rendered, one of two things will take place:

  - The link will be considered as within the viewport, and a `fetch` and `render` path will be taken, or;
  - The link will be considered as outside of the viewport, and a `prefetch` and `render` later path will be taken.

  In the latter, the approach taken has been to separate the rendering of the UI of Smart Links from the data backing the Smart Link. This is important, as, otherwise, the browser will become extremely busy even though Smart Links are not in the viewport. Thus, instead, the data for Smart Links is fetched in the background, and persisted to the store.

  A few additional points here are:

  - The prefetching logic has been implemented as a hook which can be used in other components, `usePrefetch`;
  - The prefetching logic is error-safe, in that, if errors take place whilst replacing there should be no repercussions (this has been tested);
  - The prefetching logic and fetching logic peacefully co-exist, in that, if a link is scrolled into view whilst it is being prefetched, subject to prior logic in the Smart Links reducers, either one or the other is taken as the canonical source of truth for representation of the link's metadata (whichever finishes first, to benefit the customer experience).

  Tests have been added to verify associated functionality, with an integration test added to ensure the number of network requests at two points, (1) on initial page load and, (2) after scrolling to the end of the page are the same.

  **Note**: Prefetching is enabled by default. This is deliberate to minimise the UI reflow and associated 'jank' in the Smart Links experience. If required, opt-out behaviour will be provided in the future.

### Patch Changes

- [`595078d4ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/595078d4ea) - Fix allowing color of text for card/block view to be changed for undefined links.
- [`14fd36bb89`](https://bitbucket.org/atlassian/atlassian-frontend/commits/14fd36bb89) - chore: move from `exponential-backoff` to `async-retry` - package already part of mono-repo
- [`43154333ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/43154333ff) - Add Extensionkey to Analytics events
- Updated dependencies

## 14.3.0

### Minor Changes

- [`bc754bab5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc754bab5f) - expose SmartCardContext from @atlaskit/smart-card

## 14.2.3

### Patch Changes

- [`6e5372dcda`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6e5372dcda) - **Ticket:** EDM-1121

  **Changes:**

  Added integration tests across the board, asserting that a new window is opened to kick off the 3LO flow.

  - Added integration test for account connection and try another account flows for Inline Links;
  - Added integration test for account connection and try another account flows for Card Links;
  - Added integration test for account connection and try another account flows for Embed Links;
  - Aligned `data-testid`s across all buttons for all unauthenticated views for each of the above to be - `button-connect-account` for connecting account, and `button-connect-other-account` for trying with another account.

  Further, added an `AuthorizationWindow` method to the `@atlaskit/media-integration-test-helpers`, with the following methods:

  - `AuthorizationWindow.open()` - to open a window to authorize, dependent on which card state it is being activated from;
  - `AuthorizationWindow.checkUrl()` - to check if the window URL when redirected is the same as the `MOCK_URL_AUTH_PROVIDER` inside of the package for assertions which ship with our mocks;
  - `AuthorizationWindow.close()` - to close the window opened for authorization.

- [`fae131be3b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fae131be3b) - Improve frontend batching logic and timing by using 'bottleneck'
- Updated dependencies

## 14.2.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 14.2.1

### Patch Changes

- [`76165ad82f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/76165ad82f) - Bump required because of conflicts on wadmal release

## 14.2.0

### Minor Changes

- [`fae1f71b0f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fae1f71b0f) - Implement caching of duplicate URLs

### Patch Changes

- [`6262f382de`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6262f382de) - Use the 'lodash' package instead of single-function 'lodash.\*' packages
- [`fa6fb5dfbb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fa6fb5dfbb) - Removing unused code to be published
- [`fae15b52ef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fae15b52ef) - Implement a delay queue between batch requests to the backend, to avoid flooding the backend with too many requests at once.
- [`889a2d9486`](https://bitbucket.org/atlassian/atlassian-frontend/commits/889a2d9486) - fix: updated error views for all Inline and Block links
- [`de5ee48f89`](https://bitbucket.org/atlassian/atlassian-frontend/commits/de5ee48f89) - fix: added icon prop on media-ui, InlineCardForbiddenView - moving to updated link framework for fforbidden view of Inline Smart Links.
- Updated dependencies

## 14.1.0

### Minor Changes

- [`4311cf9bf1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4311cf9bf1) - Add additional connectFailedEvent reasons for smartcards

### Patch Changes

- [`d035bea822`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d035bea822) - chore: add integration tests for Smart Links lazy rendering
- [`9fb8fb388d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9fb8fb388d) - Include resourceType in instrumentation
- [`38322cbf9a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/38322cbf9a) - EDM-134: perform patterns check on front-end, remove unneeded loading complexity
- [`8f2f2422a1`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8f2f2422a1) - EDM-955: Fix error state height for embeds
- Updated dependencies

## 14.0.0

### Major Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 13.5.1

### Patch Changes

- [`cd9c2500a8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cd9c2500a8) - EDM-834: Jira Roadmap embeds will now be an embedCard by default and also wide
- [`b17d1c437a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/b17d1c437a) - EDM-920: add required className to intersection observer loader

## 13.5.0

### Minor Changes

- [`0ae829a4ea`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0ae829a4ea) - EDM-648: Adds resizing and alignment to embed cards
- [`62269a3e45`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62269a3e45) - Added undefined links
- [`996e045cc4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/996e045cc4) - EDM-776: add platform prop to @atlaskit/smart-card for rendering fallback on mobile (embed -> block)

### Patch Changes

- [`4360fd6cd4`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4360fd6cd4) - fix: performance for Smart Links to same URL (exponential) and different (extraneous re-renders).
- [`1508cc97c9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1508cc97c9) - fix: lazy-rendering, React key, isFrameVisible in @atlaskit/renderer and click handlers for EmbedCard components.
- [`328902687e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/328902687e) - Remove stack traces from media analytic events
- Updated dependencies

## 13.4.1

### Patch Changes

- [`455e383cda`](https://bitbucket.org/atlassian/atlassian-frontend/commits/455e383cda) - Use IntersectionObserver in smart-card to detect when a link enters the viewport
- Updated dependencies

## 13.4.0

### Minor Changes

- [`50c333ab3a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/50c333ab3a) - EDM-216: Adds EmbedCards in the Editor under the flag - allowEmbeds in the UNSAFE_cards prop

### Patch Changes

- [`567df106ff`](https://bitbucket.org/atlassian/atlassian-frontend/commits/567df106ff) - fix: generate id internal to smart-card
- [`9961ccddcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9961ccddcf) - EDM-665: fix error handling of Smart Links
- [`6d83e76a4f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6d83e76a4f) - Add performance tracking to analytics events
- [`2e751e2a5b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2e751e2a5b) - EDM-688: add error messages to Smart Link unresolved events.
- Updated dependencies

## 13.3.0

### Minor Changes

- [`9848dca5c7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9848dca5c7) - Updated json-ld-types to 2.1.0

### Patch Changes

- Updated dependencies

## 13.2.0

### Minor Changes

- [minor][d6eb7bb49f](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6eb7bb49f):

  Add support for embed cards- [minor][acc12dba75](https://bitbucket.org/atlassian/atlassian-frontend/commits/acc12dba75):

  fix: refactor of extractor logic in smart-card

### Patch Changes

- [patch][3b776be426](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b776be426):

  Change appearance of unauthorised inline cards- Updated dependencies [443bb984ab](https://bitbucket.org/atlassian/atlassian-frontend/commits/443bb984ab):

- Updated dependencies [3b776be426](https://bitbucket.org/atlassian/atlassian-frontend/commits/3b776be426):
- Updated dependencies [dc3bade5f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/dc3bade5f1):
- Updated dependencies [6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):
- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):
- Updated dependencies [f6667f2909](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6667f2909):
- Updated dependencies [acc12dba75](https://bitbucket.org/atlassian/atlassian-frontend/commits/acc12dba75):
- Updated dependencies [57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):
- Updated dependencies [68ff159118](https://bitbucket.org/atlassian/atlassian-frontend/commits/68ff159118):
- Updated dependencies [1b3a41f3ea](https://bitbucket.org/atlassian/atlassian-frontend/commits/1b3a41f3ea):
- Updated dependencies [0059d26429](https://bitbucket.org/atlassian/atlassian-frontend/commits/0059d26429):
- Updated dependencies [68e206c857](https://bitbucket.org/atlassian/atlassian-frontend/commits/68e206c857):
- Updated dependencies [91e6b95599](https://bitbucket.org/atlassian/atlassian-frontend/commits/91e6b95599):
  - @atlaskit/page@11.0.13
  - @atlaskit/media-ui@12.2.0
  - @atlaskit/button@13.3.11
  - @atlaskit/icon@20.1.1
  - @atlaskit/logo@12.3.4
  - @atlaskit/checkbox@10.1.11
  - @atlaskit/form@7.2.1
  - @atlaskit/inline-message@10.1.6
  - @atlaskit/table-tree@8.0.3

## 13.1.0

### Minor Changes

- [minor][17cc5dde5d](https://bitbucket.org/atlassian/atlassian-frontend/commits/17cc5dde5d):

  EDM-200: instrument metrics for preview mode- [minor][6641c9c5b5](https://bitbucket.org/atlassian/atlassian-frontend/commits/6641c9c5b5):

  Update the previewAction to add more rich detail- [minor][f061ed6c98](https://bitbucket.org/atlassian/atlassian-frontend/commits/f061ed6c98):

  EDM-199: add analytics for action invocations on Block links- [minor][49dbcfa64c](https://bitbucket.org/atlassian/atlassian-frontend/commits/49dbcfa64c):

  Implement actions in SmartCard component- [minor][318a1a0f2f](https://bitbucket.org/atlassian/atlassian-frontend/commits/318a1a0f2f):

  EDM-454: Actions in block cards are now behind the flag: showActions- [minor][8c8f0099d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c8f0099d8):

  fix: copy for block links, added not found view to match spec

### Patch Changes

- [patch][9b2570e7f1](https://bitbucket.org/atlassian/atlassian-frontend/commits/9b2570e7f1):

  fix: blue links on error state- [patch][af10890541](https://bitbucket.org/atlassian/atlassian-frontend/commits/af10890541):

  fix: tests for i18n in media-ui- [patch][a81ce649c8](https://bitbucket.org/atlassian/atlassian-frontend/commits/a81ce649c8):

  fix: root extractor for object in block links- [patch][4070d17415](https://bitbucket.org/atlassian/atlassian-frontend/commits/4070d17415):

  Handle errors in SmartCard and report analytics event- [patch][e9d555132d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9d555132d):

  fix: ui for block links- [patch][9691bb8eb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/9691bb8eb9):

  Implement SmartLink actions- [patch][9dd4b9088b](https://bitbucket.org/atlassian/atlassian-frontend/commits/9dd4b9088b):

  EDM-563: Adding onClick handlers to BlockCard to Renderer handling- [patch][ba8c2c4129](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba8c2c4129):

  fix: icons for jira block links- [patch][0376c2f4fe](https://bitbucket.org/atlassian/atlassian-frontend/commits/0376c2f4fe):

  Pass display to anlytics attributes in SmartLinks- Updated dependencies [f459d99f15](https://bitbucket.org/atlassian/atlassian-frontend/commits/f459d99f15):

- Updated dependencies [17cc5dde5d](https://bitbucket.org/atlassian/atlassian-frontend/commits/17cc5dde5d):
- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):
- Updated dependencies [3aedaac8c7](https://bitbucket.org/atlassian/atlassian-frontend/commits/3aedaac8c7):
- Updated dependencies [f061ed6c98](https://bitbucket.org/atlassian/atlassian-frontend/commits/f061ed6c98):
- Updated dependencies [49dbcfa64c](https://bitbucket.org/atlassian/atlassian-frontend/commits/49dbcfa64c):
- Updated dependencies [e9d555132d](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9d555132d):
- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [d7b07a9ca4](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7b07a9ca4):
- Updated dependencies [318a1a0f2f](https://bitbucket.org/atlassian/atlassian-frontend/commits/318a1a0f2f):
- Updated dependencies [fd4b237ffe](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd4b237ffe):
- Updated dependencies [9691bb8eb9](https://bitbucket.org/atlassian/atlassian-frontend/commits/9691bb8eb9):
- Updated dependencies [5550919b98](https://bitbucket.org/atlassian/atlassian-frontend/commits/5550919b98):
- Updated dependencies [b5f17f0751](https://bitbucket.org/atlassian/atlassian-frontend/commits/b5f17f0751):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
- Updated dependencies [e9044fbfa6](https://bitbucket.org/atlassian/atlassian-frontend/commits/e9044fbfa6):
- Updated dependencies [050781f257](https://bitbucket.org/atlassian/atlassian-frontend/commits/050781f257):
- Updated dependencies [4635f8107b](https://bitbucket.org/atlassian/atlassian-frontend/commits/4635f8107b):
- Updated dependencies [aff1210e19](https://bitbucket.org/atlassian/atlassian-frontend/commits/aff1210e19):
- Updated dependencies [ba8c2c4129](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba8c2c4129):
- Updated dependencies [d3547279dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3547279dd):
- Updated dependencies [67bc25bc3f](https://bitbucket.org/atlassian/atlassian-frontend/commits/67bc25bc3f):
- Updated dependencies [f3587bae11](https://bitbucket.org/atlassian/atlassian-frontend/commits/f3587bae11):
- Updated dependencies [8c8f0099d8](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c8f0099d8):
  - @atlaskit/media-ui@12.1.0
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/analytics-next@6.3.6
  - @atlaskit/button@13.3.10
  - @atlaskit/textarea@2.2.7
  - @atlaskit/icon-file-type@5.0.4

## 13.0.0

### Major Changes

- [major][77474b6821](https://bitbucket.org/atlassian/atlassian-frontend/commits/77474b6821):

  ### The one with a new block card view

  For a long time, smart cards have had rumours of a new view, a block 'card' view that shows more information. This is the time to see it live! Cards in smart card are here.

  For now, integrating this is being managed by the editor-media team.

### Patch Changes

- [patch][d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):

  Remove export \* from media components- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):

- Updated dependencies [dda84ee26d](https://bitbucket.org/atlassian/atlassian-frontend/commits/dda84ee26d):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [196500df34](https://bitbucket.org/atlassian/atlassian-frontend/commits/196500df34):
- Updated dependencies [77474b6821](https://bitbucket.org/atlassian/atlassian-frontend/commits/77474b6821):
- Updated dependencies [d7ed7b1513](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7ed7b1513):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
  - @atlaskit/docs@8.4.0
  - @atlaskit/media-ui@12.0.0
  - @atlaskit/icon-file-type@5.0.3
  - @atlaskit/icon-object@5.0.3
  - @atlaskit/icon@20.1.0
  - @atlaskit/table-tree@8.0.2
  - @atlaskit/button@13.3.9
  - @atlaskit/checkbox@10.1.10
  - @atlaskit/form@7.1.5
  - @atlaskit/inline-message@10.1.5
  - @atlaskit/radio@3.1.11
  - @atlaskit/textarea@2.2.6
  - @atlaskit/textfield@3.1.9

## 12.7.0

### Minor Changes

- [minor][f709e92247](https://bitbucket.org/atlassian/atlassian-frontend/commits/f709e92247):

  Adding an optional prop testId that will set the attribute value data-testid. It will help products to write better integration and end to end tests.

### Patch Changes

- Updated dependencies [8c7f68d911](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c7f68d911):
- Updated dependencies [eaad41d56c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eaad41d56c):
- Updated dependencies [f709e92247](https://bitbucket.org/atlassian/atlassian-frontend/commits/f709e92247):
- Updated dependencies [0e562f2a4a](https://bitbucket.org/atlassian/atlassian-frontend/commits/0e562f2a4a):
- Updated dependencies [c12ba5eb3e](https://bitbucket.org/atlassian/atlassian-frontend/commits/c12ba5eb3e):
- Updated dependencies [0603860c07](https://bitbucket.org/atlassian/atlassian-frontend/commits/0603860c07):
- Updated dependencies [91a1eb05db](https://bitbucket.org/atlassian/atlassian-frontend/commits/91a1eb05db):
- Updated dependencies [c1992227dc](https://bitbucket.org/atlassian/atlassian-frontend/commits/c1992227dc):
  - @atlaskit/media-ui@11.9.0
  - @atlaskit/form@7.1.3
  - @atlaskit/icon@20.0.2
  - @atlaskit/textfield@3.1.7
  - @atlaskit/checkbox@10.1.8

## 12.6.5

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/button@13.3.7
  - @atlaskit/checkbox@10.1.7
  - @atlaskit/form@7.1.2
  - @atlaskit/icon-file-type@5.0.2
  - @atlaskit/icon-object@5.0.2
  - @atlaskit/icon@20.0.1
  - @atlaskit/inline-message@10.1.3
  - @atlaskit/page@11.0.12
  - @atlaskit/radio@3.1.9
  - @atlaskit/table-tree@8.0.1
  - @atlaskit/textarea@2.2.4
  - @atlaskit/textfield@3.1.6
  - @atlaskit/theme@9.5.1
  - @atlaskit/analytics-gas-types@4.0.13
  - @atlaskit/media-ui@11.8.3
  - @atlaskit/outbound-auth-flow-client@2.0.9

## 12.6.4

### Patch Changes

- [patch][5181c5d368](https://bitbucket.org/atlassian/atlassian-frontend/commits/5181c5d368):

  Disable flaky tests- [patch][555818c33a](https://bitbucket.org/atlassian/atlassian-frontend/commits/555818c33a):

  EDM-237: fix wrapping for inline Smart Links- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):

- Updated dependencies [555818c33a](https://bitbucket.org/atlassian/atlassian-frontend/commits/555818c33a):
  - @atlaskit/icon@20.0.0
  - @atlaskit/table-tree@8.0.0
  - @atlaskit/media-ui@11.8.2
  - @atlaskit/form@7.1.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/button@13.3.6
  - @atlaskit/checkbox@10.1.6
  - @atlaskit/inline-message@10.1.2
  - @atlaskit/radio@3.1.8
  - @atlaskit/textfield@3.1.5
  - @atlaskit/page@11.0.11

## 12.6.3

### Patch Changes

- [patch][3002c015cc](https://bitbucket.org/atlassian/atlassian-frontend/commits/3002c015cc):

  Attempt to fix landkid errors- [patch][e0f0654d4c](https://bitbucket.org/atlassian/atlassian-frontend/commits/e0f0654d4c):

  EM-93: added support for pull request lozenge colours.- Updated dependencies [ff32b3db47](https://bitbucket.org/atlassian/atlassian-frontend/commits/ff32b3db47):

- Updated dependencies [d2b8166208](https://bitbucket.org/atlassian/atlassian-frontend/commits/d2b8166208):
  - @atlaskit/form@7.1.0
  - @atlaskit/docs@8.3.0
  - @atlaskit/media-ui@11.8.1

## 12.6.2

### Patch Changes

- [patch][24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

  Form has been converted to Typescript. TypeScript consumers will now get static type safety. Flow types are no longer provided. No API changes.- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):

- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
- Updated dependencies [24865cfaff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/24865cfaff):
  - @atlaskit/analytics-next@6.3.3
  - @atlaskit/form@7.0.0
  - @atlaskit/checkbox@10.1.4
  - @atlaskit/radio@3.1.5
  - @atlaskit/textfield@3.1.4
  - @atlaskit/media-ui@11.7.2
  - @atlaskit/textarea@2.2.3

## 12.6.1

### Patch Changes

- [patch][5b8a074ce6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b8a074ce6):

  ED-7848: Stop re-creating smart card's redux store on every render

- Updated dependencies [c1d4898af5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c1d4898af5):
- Updated dependencies [3c0f6feee5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3c0f6feee5):
- Updated dependencies [f9c291923c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9c291923c):
  - @atlaskit/icon@19.0.11
  - @atlaskit/theme@9.3.0

## 12.6.0

### Minor Changes

- [minor][2f5306772c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2f5306772c):

  Updated analytics events and changed error handling to better support fallback onto blue links

## 12.5.11

### Patch Changes

- [patch][47ff615517](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/47ff615517):

  Ensure smartlinks client handles errors batched with JsonLd- [patch][ae4f336a3a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ae4f336a3a):

**FABDODGEM-13 Editor Damask Release** - [Internal post](http://go.atlassian.com/damask-release)

**BREAKING CHANGES**

- **Media:** Removed deprecated "context" property from media components in favor of "mediaClientConfig". This affects all public media UI components.
  - https://product-fabric.atlassian.net/browse/MS-2038
- **Tasks & Decisions:** Removed containerAri for task-decisions components.
  - https://product-fabric.atlassian.net/browse/ED-7631
- **Renderer:** Adapts to task-decision changes.
- **Editor Mobile Bridge:** Adapts to task-decision changes.
- **Util Data Test:** Adapts to task-decision changes.

---

**Affected Editor Components:**

tables, media, mobile, emoji, tasks & decisions, analytics

**Editor**

- Support nested actions in stage-0 schema; Change DOM representation of actions
  - https://product-fabric.atlassian.net/browse/ED-7674
- Updated i18n translations
  - https://product-fabric.atlassian.net/browse/ED-7750
- Improved analytics & crash reporting (via a new error boundary)
  - https://product-fabric.atlassian.net/browse/ED-7766
  - https://product-fabric.atlassian.net/browse/ED-7806
- Improvements to heading anchor links.
  - https://product-fabric.atlassian.net/browse/ED-7849
  - https://product-fabric.atlassian.net/browse/ED-7860
- Copy/Paste improvements
  - https://product-fabric.atlassian.net/browse/ED-7840
  - https://product-fabric.atlassian.net/browse/ED-7849
- Fixes for the selection state of Smart links.
  - https://product-fabric.atlassian.net/browse/ED-7602?src=confmacro
- Improvements for table resizing & column creation.
  - https://product-fabric.atlassian.net/browse/ED-7698
  - https://product-fabric.atlassian.net/browse/ED-7319
  - https://product-fabric.atlassian.net/browse/ED-7799

**Mobile**

- GASv3 Analytics Events are now relayed from the web to the native context, ready for dispatching.
  - https://product-fabric.atlassian.net/browse/FM-2502
- Hybrid Renderer Recycler view now handles invalid ADF nodes gracefully.
  - https://product-fabric.atlassian.net/browse/FM-2370

**Media**

- Improved analytics
  - https://product-fabric.atlassian.net/browse/MS-2036
  - https://product-fabric.atlassian.net/browse/MS-2145
  - https://product-fabric.atlassian.net/browse/MS-2416
  - https://product-fabric.atlassian.net/browse/MS-2487
- Added shouldOpenMediaViewer property to renderer
  - https://product-fabric.atlassian.net/browse/MS-2393
- Implemented analytics for file copy
  - https://product-fabric.atlassian.net/browse/MS-2036
- New `media-viewed` event dispatched when media is interacted with via the media card or viewer.
  - https://product-fabric.atlassian.net/browse/MS-2284
- Support for `alt` text attribute on media image elements.
  - https://product-fabric.atlassian.net/browse/ED-7776

**i18n-tools**

Bumped dependencies.

## 12.5.10

### Patch Changes

- [patch][666464508d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/666464508d):

  handle undefined meta

## 12.5.9

- Updated dependencies [f9b5e24662](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f9b5e24662):
  - @atlaskit/icon-file-type@5.0.0
  - @atlaskit/icon-object@5.0.0
  - @atlaskit/icon@19.0.8

## 12.5.8

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 12.5.7

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 12.5.6

- Updated dependencies [97bab7fd28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bab7fd28):
  - @atlaskit/button@13.3.1
  - @atlaskit/form@6.2.3
  - @atlaskit/radio@3.0.18
  - @atlaskit/media-ui@11.6.7
  - @atlaskit/checkbox@10.0.0
  - @atlaskit/docs@8.1.7

## 12.5.5

### Patch Changes

- [patch][fc79969f86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fc79969f86):

  Update all the theme imports in media to use multi entry points

## 12.5.4

### Patch Changes

- [patch][b8fd0f0847](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8fd0f0847):

  hot-88372: fix css props breaking in layoutNG.

## 12.5.3

### Patch Changes

- [patch][07dd73fa12](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/07dd73fa12):

  FM-2240 Fix issue where smart links would cause hybrid renderer to crash in Android

## 12.5.2

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 12.5.1

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 12.5.0

### Minor Changes

- [minor][bdee736f14](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdee736f14):

  ED-7175: unify smart link and hyperlink toolbars

  Also updates the toDOM and parseDOM on ADF nodes, making `url` optional.

  Smart cards can now optionally be passed an onResolve callback, of the shape:

      onResolve?: (data: { url?: string; title?: string }) => void;

  This gets fired when the view resolves a smart card from JSON-LD, either via the client or the `data` prop.

### Patch Changes

- [patch][32a88ae6b7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/32a88ae6b7):

  SL-365: link target for smart link should come from props rather than JSON-LD

  This also reduces the possibility of XSS attacks. Implementors should still verify they're not passing invalid URLs to the `smart-card` components.- [patch][7f1bab3c93](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f1bab3c93):

  SL-359: pass onClick props to pending and error states

## 12.4.4

### Patch Changes

- [patch][926b43142b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/926b43142b):

  Analytics-next has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No behavioural changes.

  **Breaking changes**

  - `withAnalyticsForSumTypeProps` alias has been removed, please use `withAnalyticsEvents`
  - `AnalyticsContextWrappedComp` alias has been removed, please use `withAnalyticsContext`

  **Breaking changes to TypeScript annotations**

  - `withAnalyticsEvents` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - `withAnalyticsContext` now infers proptypes automatically, consumers no longer need to provide props as a generic type.
  - Type `WithAnalyticsEventProps` has been renamed to `WithAnalyticsEventsProps` to match source code
  - Type `CreateUIAnalyticsEventSignature` has been renamed to `CreateUIAnalyticsEvent` to match source code
  - Type `UIAnalyticsEventHandlerSignature` has been renamed to `UIAnalyticsEventHandler` to match source code
  - Type `AnalyticsEventsPayload` has been renamed to `AnalyticsEventPayload`
  - Type `ObjectType` has been removed, please use `Record<string, any>` or `[key: string]: any`
  - Type `UIAnalyticsEventInterface` has been removed, please use `UIAnalyticsEvent`
  - Type `AnalyticsEventInterface` has been removed, please use `AnalyticsEvent`
  - Type `CreateAndFireEventFunction` removed and should now be inferred by TypeScript
  - Type `AnalyticsEventUpdater` removed and should now be inferred by TypeScript

## 12.4.3

- Updated dependencies [84887b940c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/84887b940c):
  - @atlaskit/form@6.1.7
  - @atlaskit/icon@19.0.2
  - @atlaskit/textfield@3.0.0

## 12.4.2

### Patch Changes

- [patch][77b09e36eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/77b09e36eb):

  fix: provide the correct url for the edge proxy to api-private.atlassian.com

## 12.4.1

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 12.4.0

### Minor Changes

- [minor][b19bf68c22](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b19bf68c22):

  fix: when environment is not provided then default to using the edge proxy instead

## 12.3.5

### Patch Changes

- [patch][6695dbd447](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6695dbd447):

  fix: ensure smartlinks render a not found view when the link resource isn't found

## 12.3.4

### Patch Changes

- [patch][19a83a0c7e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/19a83a0c7e):

  fixed issues with cards not updating after authentication

## 12.3.3

### Patch Changes

- [patch][8903a232f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8903a232f7):

  fix: fallback to blue links when resolve is unsupported

## 12.3.2

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 12.3.1

### Patch Changes

- [patch][6742fbf2cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6742fbf2cc):

  bugfix, fixes missing version.json file

## 12.3.0

### Minor Changes

- [minor][602ab89822](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/602ab89822):

  SL-345 add property for disabling auth flow of Smart Links (for Mobile).

## 12.2.8

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 12.2.7

### Patch Changes

- [patch][b346bb2963](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b346bb2963):

  added support for batching of link resolve requests in Smart Card client.

## 12.2.6

### Patch Changes

- [patch][c95713b660](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c95713b660):

  fix lazy rendering offset to be more portable between devices

## 12.2.5

- Updated dependencies [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/button@13.0.10
  - @atlaskit/form@6.1.2
  - @atlaskit/radio@3.0.7
  - @atlaskit/media-ui@11.4.2
  - @atlaskit/checkbox@9.0.0

## 12.2.4

### Patch Changes

- [patch][aed5ccba18](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aed5ccba18):

  SL-343 fix behaviour when using middle-click or clicking inside of iframes for inline Smart Links.

## 12.2.3

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/button@13.0.9
  - @atlaskit/checkbox@8.0.5
  - @atlaskit/form@6.1.1
  - @atlaskit/inline-message@10.0.7
  - @atlaskit/radio@3.0.6
  - @atlaskit/table-tree@7.0.6
  - @atlaskit/textfield@2.0.3
  - @atlaskit/media-ui@11.4.1
  - @atlaskit/icon@19.0.0

## 12.2.2

### Patch Changes

- [patch][4258086c0d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4258086c0d):

  fix: some smartlinks with sourcecode artifacts were being incorrectly rendered

## 12.2.1

### Patch Changes

- [patch][b5eb352152](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5eb352152):

  SL-336: fix page crash when state is undefined.

## 12.2.0

### Minor Changes

- [minor][09f094a7a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/09f094a7a2):

  SL-259: bump react-lazily-render, remove react-lazily-render-scroll-parent.

## 12.1.1

### Patch Changes

- [patch][8e50d00fc6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e50d00fc6):

  SL-331: fix edit handler for smart-card.

## 12.1.0

### Minor Changes

- [minor][86bf524679](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86bf524679):

  ED-7117, ED-7087: Fix copy pasting smart links out of editor. Fallback to HTML anchor tag if errors occur during rendering (e.g. no provider found).

## 12.0.0

### Major Changes

- [major][393fb6acd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/393fb6acd2):

  refactor @atlaskit/smart-card front-end: simplification. BREAKING CHANGE: Client no longer accepts configuration options as first argument; deprecated in favour of new state management layer.

## 11.1.6

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/button@13.0.8
  - @atlaskit/checkbox@8.0.2
  - @atlaskit/form@6.0.5
  - @atlaskit/inline-message@10.0.3
  - @atlaskit/radio@3.0.3
  - @atlaskit/table-tree@7.0.4
  - @atlaskit/textfield@2.0.1
  - @atlaskit/media-ui@11.2.8
  - @atlaskit/icon@18.0.0

## 11.1.5

### Patch Changes

- [patch][1347760307](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1347760307):

  - fix pull request, branch and commit name formatting

## 11.1.4

- Updated dependencies [70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):
  - @atlaskit/button@13.0.6
  - @atlaskit/form@6.0.4
  - @atlaskit/radio@3.0.2
  - @atlaskit/media-ui@11.2.7
  - @atlaskit/checkbox@8.0.0
  - @atlaskit/icon@17.2.0
  - @atlaskit/theme@9.1.0

## 11.1.3

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 11.1.2

- Updated dependencies [66af32c013](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66af32c013):
- Updated dependencies [1da5351f72](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1da5351f72):
  - @atlaskit/inline-message@10.0.0
  - @atlaskit/form@6.0.3
  - @atlaskit/radio@3.0.0

## 11.1.1

- Updated dependencies [3af5a7e685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3af5a7e685):
  - @atlaskit/media-ui@11.2.4
  - @atlaskit/page@11.0.0

## 11.1.0

- [minor][4969df0716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4969df0716):

  - fix lazy rendering bugs in Smart Links.

## 11.0.5

- [patch][27f666ed85](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27f666ed85):

  - Fixed example.

## 11.0.4

- [patch][94ffb3b638](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/94ffb3b638):

  - check for taskType icon in the json payload

## 11.0.3

- [patch][6a52b3d258](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a52b3d258):

  - fix for clicking behaviour in view/edit mode for Inline Smart Links.

## 11.0.2

- [patch][7e18a6398b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e18a6398b):

  - improve type safety when defining smart-card environment

## 11.0.1

- [patch][b7687b9981](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b7687b9981):

  - Changed smart link functionality so that it will open in the same tab if clicked.

## 11.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 10.5.0

- [minor][593404cba8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/593404cba8):

  - add status lozenge to source code issue references.

## 10.4.2

- Updated dependencies [dd95622388](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd95622388):
- Updated dependencies [6cdf11238d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6cdf11238d):
  - @atlaskit/form@5.2.10
  - @atlaskit/textarea@1.0.0
  - @atlaskit/textfield@1.0.0

## 10.4.1

- [patch][3e4c4d7e2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e4c4d7e2d):

  - fix: send 'Origin' header in resolve requests

## 10.4.0

- [minor][da5a7f3390](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da5a7f3390):

  - fix third-party link extractors to resolve URLs more accurately.

## 10.3.1

- Updated dependencies [6c4e41ff36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c4e41ff36):
  - @atlaskit/form@5.2.9
  - @atlaskit/radio@1.0.0

## 10.3.0

- [minor][ce985861c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ce985861c3):

  - Added analytics for UI actions, and updated existing operational analytics events

## 10.2.4

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/button@12.0.3
  - @atlaskit/checkbox@6.0.4
  - @atlaskit/form@5.2.7
  - @atlaskit/icon@16.0.9
  - @atlaskit/icon-file-type@3.0.8
  - @atlaskit/icon-object@3.0.8
  - @atlaskit/inline-message@8.0.3
  - @atlaskit/radio@0.5.3
  - @atlaskit/textarea@0.4.4
  - @atlaskit/textfield@0.4.4
  - @atlaskit/media-ui@10.1.5
  - @atlaskit/theme@8.1.7

## 10.2.3

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 10.2.2

- Updated dependencies [1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):
  - @atlaskit/docs@7.0.2
  - @atlaskit/analytics-next@4.0.3
  - @atlaskit/checkbox@6.0.3
  - @atlaskit/form@5.2.5
  - @atlaskit/icon@16.0.8
  - @atlaskit/icon-file-type@3.0.7
  - @atlaskit/icon-object@3.0.7
  - @atlaskit/inline-message@8.0.2
  - @atlaskit/page@9.0.3
  - @atlaskit/radio@0.5.2
  - @atlaskit/textarea@0.4.1
  - @atlaskit/textfield@0.4.3
  - @atlaskit/theme@8.1.6
  - @atlaskit/media-ui@10.1.3
  - @atlaskit/button@12.0.0

## 10.2.1

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 10.2.0

- [minor][9b0dd21ce7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b0dd21ce7):

  - allow the appearance of lozenges within smart link tasks to be configured

## 10.1.2

- [patch][aa117f5341](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aa117f5341):

  - fix alignment and UI for inline Smart Links.

## 10.1.1

- Updated dependencies [f504850fe2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f504850fe2):
  - @atlaskit/form@5.2.4
  - @atlaskit/textarea@0.4.0

## 10.1.0

- [minor][11a6c98707](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11a6c98707):

  - refactor Smart Links frontend directory structure.

## 10.0.2

- Updated dependencies [8eff47cacb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8eff47cacb):
  - @atlaskit/form@5.2.3
  - @atlaskit/textfield@0.4.0

## 10.0.1

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 10.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 9.11.4

- [patch][8ed53a1cbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ed53a1cbb):

  - fix padding, wrapping for inline smart links.

## 9.11.3

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/button@10.1.3
  - @atlaskit/icon@16.0.4
  - @atlaskit/icon-file-type@3.0.4
  - @atlaskit/icon-object@3.0.4
  - @atlaskit/textarea@0.2.5
  - @atlaskit/analytics-gas-types@3.2.5
  - @atlaskit/media-ui@9.2.1
  - @atlaskit/outbound-auth-flow-client@1.0.4
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/checkbox@6.0.0
  - @atlaskit/form@5.1.8
  - @atlaskit/inline-message@8.0.0
  - @atlaskit/page@9.0.0
  - @atlaskit/radio@0.5.0
  - @atlaskit/textfield@0.3.0
  - @atlaskit/theme@8.0.0

## 9.11.2

- Updated dependencies [e9b824bf86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9b824bf86):
  - @atlaskit/form@5.1.7
  - @atlaskit/textfield@0.2.0

## 9.11.1

- [patch][2cb8c44165](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2cb8c44165):

  - Fix environments mix-up

## 9.11.0

- [minor][41147bbc4c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/41147bbc4c):

  - Fix for links in editor

## 9.10.0

- [minor][ea423a619f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ea423a619f):

  - Fixed the call to the /check endpoint

## 9.9.0

- [minor][7f70e97f98](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f70e97f98):

  - Added environments to client

## 9.8.0

- [minor][1594f351d9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1594f351d9):

  - added inline extractors for Bitbucket and Github.

## 9.7.1

- Updated dependencies [d5bce1ea15](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5bce1ea15):
  - @atlaskit/media-ui@9.0.0

## 9.7.0

- [minor][1c62bcce7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c62bcce7d):

  - Fix a problem with smart cards not appearing sometimes when lazy rendered and lazy loaded after code-split.

## 9.6.8

- [patch][af3918bc89](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/af3918bc89):

  - The url part of the unauthorized link is now grey

## 9.6.7

- [patch][abce6949c0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abce6949c0):

  - fix icon sizing and url key.

## 9.6.6

- [patch][5ae645d661](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ae645d661):

  - Fixing analytics in smart-cards

## 9.6.5

- [patch][2035bef8fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2035bef8fb):

  - Fix inline extractor priority preventing @type arrays in some cases.

## 9.6.4

- [patch][56c5a4b41f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/56c5a4b41f):

  - Fix "try again" should not be showing when there are no auth methods

## 9.6.3

- [patch][63e6f7d420](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/63e6f7d420):

  - Fix missing attributes for link view

## 9.6.2

- [patch][cbc601aed3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cbc601aed3):

  - Added missing type of events for Confluence

## 9.6.1

- [patch][bef9abc8de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bef9abc8de):

  - added background colour to inline card views, fixed icon alignment.

## 9.6.0

- [minor][27b12fdfc6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27b12fdfc6):

  - added support for rendering of icons in Jira links

## 9.5.0

- [minor][d664fc3d49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d664fc3d49):

  - added support for rendering of icons with Confluence links

## 9.4.1

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/button@10.1.2
  - @atlaskit/checkbox@5.0.11
  - @atlaskit/form@5.1.2
  - @atlaskit/inline-message@7.0.11
  - @atlaskit/radio@0.4.6
  - @atlaskit/media-ui@8.2.5
  - @atlaskit/icon@16.0.0

## 9.4.0

- [minor][8ff07c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8ff07c1):

  - Analytics, first attempt, validate the idea

- [minor][7777442](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7777442):

  - More analytics for smart links

- [minor][7302ea6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7302ea6):

  - Analytics for smart cards

## 9.3.0

- [minor][150626e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/150626e):

  - add support for source code repository urls (currently Bitbucket and Github) in smart-cards.

## 9.2.2

- Updated dependencies [647a46f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/647a46f):
  - @atlaskit/radio@0.4.5
  - @atlaskit/textfield@0.1.5
  - @atlaskit/form@5.0.0

## 9.2.1

- [patch][9c50550](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c50550):

  - Do not show connect button if there are no auth methods.

## 9.2.0

- [minor][95f98cc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95f98cc):

  - User can click on a smart card to open a new window/tab

## 9.1.0

- [minor][1175616](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1175616):

  - Simplified error state in inline cards: no red state anymore, just blue link

## 9.0.4

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/button@10.1.1
  - @atlaskit/checkbox@5.0.9
  - @atlaskit/field-range@5.0.12
  - @atlaskit/field-text@7.0.18
  - @atlaskit/field-text-area@4.0.14
  - @atlaskit/form@4.0.21
  - @atlaskit/icon@15.0.2
  - @atlaskit/icon-file-type@3.0.2
  - @atlaskit/icon-object@3.0.2
  - @atlaskit/inline-message@7.0.10
  - @atlaskit/page@8.0.12
  - @atlaskit/radio@0.4.4
  - @atlaskit/theme@7.0.1
  - @atlaskit/media-ui@8.1.2
  - @atlaskit/outbound-auth-flow-client@1.0.2
  - @atlaskit/docs@6.0.0

## 9.0.3

- Updated dependencies [5de3574](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5de3574):
  - @atlaskit/media-ui@8.0.0

## 9.0.2

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/button@10.0.4
  - @atlaskit/checkbox@5.0.8
  - @atlaskit/field-range@5.0.11
  - @atlaskit/field-text@7.0.16
  - @atlaskit/field-text-area@4.0.13
  - @atlaskit/form@4.0.20
  - @atlaskit/icon@15.0.1
  - @atlaskit/icon-file-type@3.0.1
  - @atlaskit/icon-object@3.0.1
  - @atlaskit/inline-message@7.0.9
  - @atlaskit/radio@0.4.3
  - @atlaskit/media-ui@7.8.2
  - @atlaskit/theme@7.0.0

## 9.0.1

- [patch][4c0c2a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4c0c2a0):

  - Fix Cards throwing Error when client is not provided.

## 9.0.0

- [major][df32968](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df32968):

  - Introduced pending state (which is represented as a link) and a race between resolving state and the data fetch.

## 8.8.5

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/button@10.0.1
  - @atlaskit/checkbox@5.0.7
  - @atlaskit/form@4.0.19
  - @atlaskit/inline-message@7.0.8
  - @atlaskit/radio@0.4.2
  - @atlaskit/media-ui@7.6.2
  - @atlaskit/icon-file-type@3.0.0
  - @atlaskit/icon-object@3.0.0
  - @atlaskit/icon@15.0.0

## 8.8.4

- Updated dependencies [6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):
  - @atlaskit/docs@5.2.1
  - @atlaskit/checkbox@5.0.6
  - @atlaskit/field-text@7.0.15
  - @atlaskit/field-text-area@4.0.12
  - @atlaskit/form@4.0.18
  - @atlaskit/icon@14.6.1
  - @atlaskit/icon-file-type@2.0.1
  - @atlaskit/icon-object@2.0.1
  - @atlaskit/inline-message@7.0.7
  - @atlaskit/page@8.0.11
  - @atlaskit/radio@0.4.1
  - @atlaskit/theme@6.2.1
  - @atlaskit/media-ui@7.6.1
  - @atlaskit/field-range@5.0.9
  - @atlaskit/button@10.0.0

## 8.8.3

- Updated dependencies [b42680b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b42680b):
  - @atlaskit/form@4.0.17
  - @atlaskit/radio@0.4.0

## 8.8.2

- [patch][b859e08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b859e08):

  - Update dependent versions

## 8.8.1

- Updated dependencies [8199088](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8199088):
  - @atlaskit/form@4.0.16
  - @atlaskit/radio@0.3.0

## 8.8.0

- [minor][93b31fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93b31fa):

  - Add support for nested <SmartCardProvider />

## 8.7.1

- [patch][00cd9a8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/00cd9a8):

  - Add tag support for inline task card.

## 8.7.0

- [minor][e89e244](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e89e244):

  - Implemented time-based caching for the client.

## 8.6.3

- [patch][4b989c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b989c3):

  - Fix inline cards crashing after change to the format.

## 8.6.2

- [patch][a567cc9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a567cc9):

  - Improve rendering of Smart Cards.

## 8.6.1

- [patch][7bc4461](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7bc4461):

  - ED-5565: support connecting external React.Context to nodeviews

## 8.6.0

- [minor][1aa57ab](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1aa57ab):

  Clean up for media up and new task converter for smart cards

- [minor][d310628](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d310628):

  Added a converter for atlassian:task type

## 8.5.2

- [patch] ED-5439: add block smart cards, toolbar switcher [5f8bdfe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f8bdfe)

## 8.5.1

- [patch] fix cards being reloaded with the same definition id [b4b6a45](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b4b6a45)

## 8.5.0

- [minor] Added task converter [8678076](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8678076)

## 8.4.1

- [patch] Update blockcard and inline card exports to be compatible with tree shaking. Preperation for asyncloading parts of smart card [ced32d0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ced32d0)

## 8.4.0

- [minor] Client to be extended [039c0ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/039c0ad)

## 8.3.3

- [patch] Replace @atlassian/outbound-auth-flow-client with @atlaskit/ [faff9c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/faff9c1)

## 8.3.2

- [patch] expose onClick handler for Card [3f5585c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f5585c)

## 8.3.1

- [patch] Additional test case [9b86661](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b86661)

## 8.3.0

- [minor] Refactored the rxjs set up for smart cards [026c96e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/026c96e)

## 8.2.4

- [patch] Removes usages of rxjs/Rx [d098f25](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d098f25)

## 8.2.3

- [patch] Fix rxjs and date-fns import in TS components [ab15cee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab15cee)

## 8.2.2

- [patch] Updated dependencies [dae7792](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dae7792)
  - @atlaskit/media-ui@6.0.0

## 8.2.1

- [patch] Fix rxjs imports to only import what's needed [2e0ce2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2e0ce2b)

## 8.2.0

- [minor] Added `isSelected` to the `Card` component (inline resolved view) [6666d82](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6666d82)

## 8.1.2

- [patch] Updated dependencies [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)
  - @atlaskit/form@4.0.9
  - @atlaskit/select@6.0.0

## 8.1.1

- [patch] Updated dependencies [d8d8107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d8d8107)
  - @atlaskit/select@5.0.14
  - @atlaskit/form@4.0.0

## 8.1.0

- [minor] Switched to the amerizan way of spelling unauthorized [7c223f9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c223f9)

## 8.0.1

- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/media-ui@5.1.2

## 8.0.0

- [major] fix call to ORS by switching to fetch from XHR [48b95b0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48b95b0)
- [patch] Cleaner fetch function [e9b1477](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9b1477)

## 7.0.6

- [patch] Updated dependencies [333a440](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/333a440)
  - @atlaskit/inline-message@7.0.0
- [none] Updated dependencies [1d9e75a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9e75a)
  - @atlaskit/inline-message@7.0.0
- [none] Updated dependencies [a3109d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3109d3)
  - @atlaskit/inline-message@7.0.0
- [none] Updated dependencies [87d45d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d45d3)
  - @atlaskit/inline-message@7.0.0
- [none] Updated dependencies [a08b0c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a08b0c2)
  - @atlaskit/inline-message@7.0.0

## 7.0.5

- [patch] ED-4824: added renderer support for smart cards [7cf0a78](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7cf0a78)

## 7.0.4

- [patch] ED-5222: bump react-lazily-render package [5844820](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5844820)

## 7.0.3

- [patch] Fix es5 exports of some of the newer modules [3f0cd7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f0cd7d)

## 7.0.2

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/select@5.0.7
  - @atlaskit/page@8.0.2
  - @atlaskit/media-ui@5.0.2
  - @atlaskit/field-range@5.0.2
  - @atlaskit/field-text@7.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/inline-message@6.0.2
  - @atlaskit/form@3.1.4

## 7.0.1

- [patch] Fix CORS request in Smart Card [b0e2ce3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0e2ce3)

## 7.0.0

- [major] Implemented smart cards and common views for other cards [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
- [major] Implemented smart cards and common UI elements [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
- [major] Implement smart card [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)
- [major] Smart cards implementation and moved UI elements into media-ui package [3476e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3476e01)
- [major] Updated dependencies [fa6f865](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fa6f865)
  - @atlaskit/media-ui@5.0.0
- [major] Updated dependencies [fdd03d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fdd03d8)
  - @atlaskit/media-ui@5.0.0
- [major] Updated dependencies [49c8425](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49c8425)
  - @atlaskit/media-ui@5.0.0
- [major] Updated dependencies [3476e01](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3476e01)
  - @atlaskit/media-ui@5.0.0

## 6.0.1

- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/icon@13.1.1
  - @atlaskit/dropdown-menu@6.1.1
  - @atlaskit/avatar-group@2.0.1
  - @atlaskit/avatar@14.0.1

## 6.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/inline-message@6.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/page@8.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/media-ui@4.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/badge@9.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/dropdown-menu@6.0.0
  - @atlaskit/avatar-group@2.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/page@8.0.0
  - @atlaskit/media-ui@4.0.0
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/inline-message@6.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/field-range@5.0.0
  - @atlaskit/badge@9.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/dropdown-menu@6.0.0
  - @atlaskit/avatar-group@2.0.0
  - @atlaskit/avatar@14.0.0

## 5.3.3

- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/button@8.2.5
  - @atlaskit/dropdown-menu@5.2.3
  - @atlaskit/avatar-group@1.0.2
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/button@8.2.5
  - @atlaskit/dropdown-menu@5.2.3
  - @atlaskit/avatar-group@1.0.2

## 5.3.2

- [patch] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0
  - @atlaskit/dropdown-menu@5.2.2
  - @atlaskit/avatar-group@1.0.0

## 5.3.1

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/button@8.2.3

## 5.3.0

- [minor] Error view for inline smart card [74a0d46](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74a0d46)
- [minor] Implemented auth error view for the inline card [6c6f078](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6c6f078)
- [minor] Implemented auth error view for inline SC [5bb26b4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5bb26b4)

## 5.2.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/media-ui@3.1.1
  - @atlaskit/theme@4.0.3
  - @atlaskit/spinner@7.0.1
  - @atlaskit/lozenge@5.0.3
  - @atlaskit/inline-message@5.1.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/dropdown-menu@5.0.3
  - @atlaskit/button@8.1.1
  - @atlaskit/badge@8.0.3
  - @atlaskit/avatar@11.1.1
  - @atlaskit/docs@4.1.1

## 5.2.0

- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/page@7.1.0
  - @atlaskit/tooltip@10.2.0
  - @atlaskit/dropdown-menu@5.0.2
  - @atlaskit/avatar@11.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/media-ui@3.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/lozenge@5.0.2
  - @atlaskit/field-text@6.0.2
  - @atlaskit/field-range@4.0.2
  - @atlaskit/badge@8.0.2
  - @atlaskit/inline-message@5.1.0
  - @atlaskit/button@8.1.0

## 5.1.1

- [patch] Fix UI issues with inline card resolving view [2de7ce7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2de7ce7)
- [patch] Fix for inline resolved card [97efb49](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97efb49)
- [patch] Fix the resolving view [f86d117](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f86d117)

## 5.1.0

- [minor] added the LinkView for inline cards in the resolving/errored state [823caef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/823caef)

## 5.0.0

- [major] Renamed and refactored the resolved for inline cards [732d2f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/732d2f5)

## 4.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/page@7.0.0
  - @atlaskit/media-ui@3.0.0
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/inline-message@5.0.0
  - @atlaskit/field-text@6.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/lozenge@5.0.0
  - @atlaskit/field-range@4.0.0
  - @atlaskit/badge@8.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/dropdown-menu@5.0.0
  - @atlaskit/avatar@11.0.0

## 3.0.4

- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/page@6.0.4

## 3.0.3

- [patch] fix inline smart-cards to support styled-components v1 [35d547f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d547f)

## 3.0.2

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/media-ui@2.1.1
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/page@6.0.3
  - @atlaskit/inline-message@4.0.2
  - @atlaskit/field-text@5.0.3
  - @atlaskit/dropdown-menu@4.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/badge@7.1.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4
  - @atlaskit/lozenge@4.0.1

## 3.0.1

- [patch] add @types/prop-types to dependencies of smart-card [d558d2b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d558d2b)

## 3.0.0

- [major] Renamed smart card components and exposed inline smart card views [1094bb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1094bb6)

## 2.0.2

- [patch] Implemented <InlineCardView /> for displaying a smart card inline with text. This view is NOT directly exported to consumers. [293b3a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/293b3a7)

## 2.0.1

- [patch] Added missing dependencies and added lint rule to catch them all [0672503](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0672503)

## 2.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 1.0.2

- [patch] fixed missing and inccorect versions of dependencies [7bfbb09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7bfbb09)
- [patch] fix dependencies [0e57cde](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e57cde)

## 1.0.1

- [patch] fix path for atkaskit in package.json [6ac9661](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6ac9661)
