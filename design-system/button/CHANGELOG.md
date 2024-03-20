# @atlaskit/button

## 17.7.2

### Patch Changes

- [#83116](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/83116) [`8d4e99057fe0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/8d4e99057fe0) - Upgrade Typescript from `4.9.5` to `5.4.2`

## 17.7.1

### Patch Changes

- Updated dependencies

## 17.7.0

### Minor Changes

- [#73843](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/73843) [`9a090e6e7733`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9a090e6e7733) - The new icon button incorrectly supported `spacing="none"`. This release removes support for this, leaving `"default"` and `"compact"` as the only two options.

  The icon button docs have also been updated to better reflect the intended use of the `label` prop instead of `aria-label`. The `label` prop is designed to abstract the technical implementation for accessibility requirements. The new icon button does not use the `aria-label` attribute under the hood, rather it relys on visually hidden text instead. This is done for accessibility reasons as `aria-label` is not always translated whereas visually hidden text will be.

## 17.6.2

### Patch Changes

- [#77547](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/77547) [`cce378569da1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/cce378569da1) - Migration documentation for changing from old to new button components. Documentation-only change.

## 17.6.1

### Patch Changes

- Updated dependencies

## 17.6.0

### Minor Changes

- [#58240](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58240) [`75b2ade8b254`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/75b2ade8b254) - New buttons no longer directly emit analytics tracking events to prevent duplicate events, as the underlying primitive components already have tracking. Any analytics context set on new buttons are retained through forwarding to the primitives

### Patch Changes

- Updated dependencies

## 17.5.0

### Minor Changes

- [#75714](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/75714) [`ba18e89df3d9`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/ba18e89df3d9) - Icon buttons no longer accept `aria-label` attributes to prevent possible duplicate labels being applied (the dedicated `label` prop handles this)

## 17.4.0

### Minor Changes

- [#72130](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/72130) [`b037e5451037`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b037e5451037) - Update new button text color fallback for default theme (non-token) to match that of old button current text color

## 17.3.2

### Patch Changes

- [#70231](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70231) [`e55d8295c1c1`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/e55d8295c1c1) - Changes to add a page and more specific information in link button documentation.

## 17.3.1

### Patch Changes

- [#65509](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/65509) [`9e9847bebdbe`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/9e9847bebdbe) - Fix aria-disabled not being passed to custom theme button

## 17.3.0

### Minor Changes

- [#70040](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/70040) [`d18ec4d7ce20`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d18ec4d7ce20) - [ux] Tidy up of the `platform.design-system-team.icon-button-spacing-fix_o1zc5` Platform Feature Flag which applies a small adjustment to icon spacing for buttons using `iconBefore` and `iconAfter` props. Small visual adjustment is to be expected — keep this in mind when reviewing any VR tests breaking. The spacing around the icons will be reduced.

## 17.2.1

### Patch Changes

- Updated dependencies

## 17.2.0

### Minor Changes

- [#64419](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/64419) [`6e9ab538f37b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/6e9ab538f37b) - Export ButtonGroupProps type

## 17.1.0

### Minor Changes

- [#60205](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60205) [`d8f830e29011`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d8f830e29011) - [ux] Assistive technologies now define ButtonGroup as a group. Additionally `label` and `titleId` props introduced to label the current group.

## 17.0.0

### Major Changes

- [#60024](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/60024) [`c6418d429d47`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/c6418d429d47) - New Button goes open beta!

#### Breaking changes

Removed all `UNSAFE_` exports and `/unsafe` entrypoint.

```js
import { UNSAFE_BUTTON } from '@atlaskit/button' ❌
import Button from '@atlaskit/button/new' ✅

import { UNSAFE_BUTTON } from '@atlaskit/button/unsafe' ❌
import Button from '@atlaskit/button/new' ✅
```

See new features for new exports and entrypoint ⤵

#### New features

New Button goes open beta!

Check out the exports under `@atlaskit/button/new` and the [docs](/components/button/button-new/examples) for our new approach.

##### Button

[Read the docs here.](/components/button/button-new/examples)

```js
import Button from '@atlaskit/button/new';
import { LinkButton } from '@atlaskit/button/new';
```

##### Icon button

[Read the docs here.](/components/button/icon-button/examples)

```js
import { IconButton } from '@atlaskit/button/new';
import { LinkIconButton } from '@atlaskit/button/new';
```

##### Split button

[Read the docs here.](/components/button/split-button/examples)

```js
import { SplitButton } from '@atlaskit/button/new';
```

## 16.18.1

### Patch Changes

- [#58871](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/58871) [`4c7dc39947e8`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/4c7dc39947e8) - Add code docs for icon button and update types

## 16.18.0

### Minor Changes

- [#59441](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59441) [`23a1d31d3c09`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/23a1d31d3c09) - Add entrypoint for new button work heading to open beta at `@atlaskit/button/new`

## 16.17.12

### Patch Changes

- [#59085](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59085) [`67c05dbef826`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/67c05dbef826) - Exclude medium from UNSAFE_iconBefore_size and UNSAFE_iconAfter_size types.

## 16.17.11

### Patch Changes

- [#59147](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/59147) [`f12e489f23b0`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/f12e489f23b0) - Re-build and deploy packages to NPM to resolve React/Compiled not found error (HOT-106483).

## 16.17.10

### Patch Changes

- [#55666](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/55666) [`7be116fed51b`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/7be116fed51b) - Add support for shape to IconButton

## 16.17.9

### Patch Changes

- [#57808](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57808) [`b99d50f91202`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/b99d50f91202) - Internal changes to styling on SplitButton (closed beta) to fix issues with border radius when wrapper elements are used.

## 16.17.8

### Patch Changes

- [#56967](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/56967) [`d491c321ae12`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/d491c321ae12) - Remove use of aria-busy

## 16.17.7

### Patch Changes

- [#57511](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57511) [`a3fc003a2d20`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/a3fc003a2d20) - [ux] Fixes a bug in `LinkIconButton` (in closed beta) where the `UNSAFE_size` prop did not apply

## 16.17.6

### Patch Changes

- [#57229](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/pull-requests/57229) [`dd91461d616d`](https://stash.atlassian.com/projects/CONFCLOUD/repos/confluence-frontend/commits/dd91461d616d) - [ux] Fixes a bug in new Buttons (in closed beta) that affected text alignment

## 16.17.5

### Patch Changes

- [#43918](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43918) [`d100ca42f46`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d100ca42f46) - Push model consumption configuration done for these packages

## 16.17.4

### Patch Changes

- [#43835](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43835) [`eba86990eef`](https://bitbucket.org/atlassian/atlassian-frontend/commits/eba86990eef) - Update new Button (in closed beta) API for `iconBefore` and `iconAfter` to be bounded with unsafe fallbacks for icon sizing

## 16.17.3

### Patch Changes

- [#43714](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43714) [`d4c4a73a30a`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d4c4a73a30a) - [ux] Updates supported SplitButton (closed beta) appearances to be 'default' or 'primary'. Makes dividers full height to match existing uses outside of navigation contexts.

## 16.17.2

### Patch Changes

- [#43263](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43263) [`09f29df6245`](https://bitbucket.org/atlassian/atlassian-frontend/commits/09f29df6245) - Update IconButton (in closed beta) API to be bounded with unsafe fallback for icon sizing

## 16.17.1

### Patch Changes

- [#42681](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42681) [`df138bd3900`](https://bitbucket.org/atlassian/atlassian-frontend/commits/df138bd3900) - [ux] Update to divider colors and height in SplitButton (alpha)

## 16.17.0

### Minor Changes

- [#43311](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/43311) [`8764ee956ae`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8764ee956ae) - [ux] Remove `appearance` prop options `link` and `subtle-link` from the new Button (in Alpha). They are now reserved for the new LinkButton component

## 16.16.1

### Patch Changes

- Updated dependencies

## 16.16.0

### Minor Changes

- [#42973](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42973) [`0fe0a5121a7`](https://bitbucket.org/atlassian/atlassian-frontend/commits/0fe0a5121a7) - Add missing `testId` prop to `<ButtonGroup>` to enable testing

## 16.15.0

### Minor Changes

- [#42950](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42950) [`9691abc55ce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9691abc55ce) - Restructure new Button (in Alpha) types for documentation purposes

## 16.14.0

### Minor Changes

- [#42928](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42928) [`f858870ae90`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f858870ae90) - Added new Button variants (in Alpha) unsafe exports to root entrypoint for documentation purposes

## 16.13.0

### Minor Changes

- [#42603](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42603) [`48423992847`](https://bitbucket.org/atlassian/atlassian-frontend/commits/48423992847) - Add new Link Button variants to unsafe entrypoint for internal testing purposes.

## 16.12.0

### Minor Changes

- [#42305](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/42305) [`4c9d4a7be34`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4c9d4a7be34) - - Link button variants (still in Alpha) `<LinkButton>` and `<LinkIconButton>` now support router link components through use of an app provider

### Patch Changes

- Updated dependencies

## 16.11.0

### Minor Changes

- [#41859](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41859) [`7c662f243b9`](https://bitbucket.org/atlassian/atlassian-frontend/commits/7c662f243b9) - Expose more UNSAFE exports from UNSAFE entry point for internal work. PLEASE DO NO USE ANYTHING FROM "UNSAFE" ENTRY POINT WITH "UNSAFE" PREFIX.

## 16.10.2

### Patch Changes

- [#41229](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/41229) [`22075b34cb8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/22075b34cb8) - Removing static styling violations

## 16.10.1

### Patch Changes

- [#39787](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39787) [`6900f89eb0e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6900f89eb0e) - Internal changes to use space tokens. There is no expected visual or behaviour change.

## 16.10.0

### Minor Changes

- [#39701](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39701) [`8c6ebfca290`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8c6ebfca290) - Expose temporary "unsafe" entry point for internal work. It will be removed soon. PLEASE DO NOT USE.

### Patch Changes

- Updated dependencies

## 16.9.4

### Patch Changes

- [#39579](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/39579) [`f204e4e0e55`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f204e4e0e55) - Updated dependencies

## 16.9.3

### Patch Changes

- [#38162](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38162) [`fd6bb9c9184`](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd6bb9c9184) - Delete version.json
- Updated dependencies

## 16.9.2

### Patch Changes

- [#38730](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38730) [`234448e5bb3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/234448e5bb3) - [ux] Updated inner space fix values to be -2px to cover up for 2px margins.

## 16.9.1

### Patch Changes

- [#38291](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38291) [`696e8c196a3`](https://bitbucket.org/atlassian/atlassian-frontend/commits/696e8c196a3) - Update our documentation of our CustomThemeButton export to note the impending deprecation that we have planned.

## 16.9.0

### Minor Changes

- [#38259](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/38259) [`f4aff27416d`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f4aff27416d) - [ux] We are testing icon button internal spacing fix behind a feature flag. Now the space between icons and right or left edge of the button will be optically perceived as even. If this fix is successful it will be available in a later release.

## 16.8.5

### Patch Changes

- [#37681](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37681) [`54b69a2fc03`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54b69a2fc03) - Refactor out rest props from button and make props more explicit.

## 16.8.4

### Patch Changes

- [#37682](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37682) [`4b3cfb2276b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4b3cfb2276b) - Refactor button base to remove rest props and make props more explicit.

## 16.8.3

### Patch Changes

- [#37605](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/37605) [`11cd2f83450`](https://bitbucket.org/atlassian/atlassian-frontend/commits/11cd2f83450) - Refactor loading button to use less rest props to pass props more explicitly.

## 16.8.2

### Patch Changes

- [#36754](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/36754) [`4ae083a7e66`](https://bitbucket.org/atlassian/atlassian-frontend/commits/4ae083a7e66) - Use `@af/accessibility-testing` for default jest-axe config and jest-axe import in accessibility testing.

## 16.8.1

### Patch Changes

- [#35441](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/35441) [`ba43427b3e8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/ba43427b3e8) - Internal changes to account for introduction of shape/radius tokens.

## 16.8.0

### Minor Changes

- [#34532](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34532) [`5104149700b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5104149700b) - Button no longer unnecessarily sets `tabindex` as `0` for focus when using default `<button>` or `<a>` elements, as they are already focusable. This is still set when using the `component` prop so other elements can still be be focused. (This change is feature flagged)

## 16.7.6

### Patch Changes

- [#34644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34644) [`687e9b93266`](https://bitbucket.org/atlassian/atlassian-frontend/commits/687e9b93266) - Updated dependencies

## 16.7.5

### Patch Changes

- [#34192](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34192) [`3a14ab26d19`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3a14ab26d19) - Updated dependencies

## 16.7.4

### Patch Changes

- [#34051](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/34051) [`49b08bfdf5f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49b08bfdf5f) - Migrated use of `gridSize` to space tokens where possible. There is no expected visual or behaviour change.

## 16.7.3

### Patch Changes

- [#33793](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33793) [`9d00501a414`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9d00501a414) - Ensure legacy types are published for TS 4.5-4.8

## 16.7.2

### Patch Changes

- [#33771](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33771) [`96b5112590b`](https://bitbucket.org/atlassian/atlassian-frontend/commits/96b5112590b) - Updated dependencies

## 16.7.1

### Patch Changes

- [#33649](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33649) [`41fae2c6f68`](https://bitbucket.org/atlassian/atlassian-frontend/commits/41fae2c6f68) - Upgrade Typescript from `4.5.5` to `4.9.5`

## 16.7.0

### Minor Changes

- [#33258](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33258) [`56507598609`](https://bitbucket.org/atlassian/atlassian-frontend/commits/56507598609) - Skip minor dependency bump

### Patch Changes

- Updated dependencies

## 16.6.1

### Patch Changes

- [#33004](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/33004) [`23a850fe471`](https://bitbucket.org/atlassian/atlassian-frontend/commits/23a850fe471) - Updated dependencies

## 16.6.0

### Minor Changes

- [#31299](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/31299) [`3367210dce8`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3367210dce8) - [ux] Internal change to the way focus is rendered for buttons.
  Focus states now apply a 2px offset to the focus ring to aid the contrast of the focus state when applied on the 'primary' and 'selected' buttons.
  As part of this change, and to settle on a more systemic approach to focus, button also no longer applies a different colored shadow per appearance.

## 16.5.7

### Patch Changes

- [#30248](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/30248) [`729e45efa7f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/729e45efa7f) - [ux] Fix a bug where the incorrect design tokens were used for the color of spinners in warning, disabled and selected buttons
- Updated dependencies

## 16.5.6

### Patch Changes

- Updated dependencies

## 16.5.5

### Patch Changes

- Updated dependencies

## 16.5.4

### Patch Changes

- [#29390](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/29390) [`18aeca8c199`](https://bitbucket.org/atlassian/atlassian-frontend/commits/18aeca8c199) - Internal change to update token references. There is no expected behaviour or visual change.

## 16.5.3

### Patch Changes

- [#28090](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/28090) [`f96f3ebd861`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f96f3ebd861) - [ux] Use color.background.neutral.subtle token to represent transparent background.

## 16.5.2

### Patch Changes

- Updated dependencies

## 16.5.1

### Patch Changes

- Updated dependencies

## 16.5.0

### Minor Changes

- [#26712](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26712) [`71799e16ae6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/71799e16ae6) - Introduce InteractionContext to @atlaskit/button

### Patch Changes

- [`3c76f243e7f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/3c76f243e7f) - InteractionContext is nullable
- Updated dependencies

## 16.4.1

### Patch Changes

- Updated dependencies

## 16.4.0

### Minor Changes

- [#25860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25860) [`9f6369f5505`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f6369f5505) - Updates `@emotion/core` to `@emotion/react`; v10 to v11. There is no expected behaviour change.

### Patch Changes

- Updated dependencies

## 16.3.10

### Patch Changes

- [#26488](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/26488) [`bc989043572`](https://bitbucket.org/atlassian/atlassian-frontend/commits/bc989043572) - Internal changes to apply spacing tokens. This should be a no-op change.

## 16.3.9

### Patch Changes

- [#25237](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/25237) [`1f4dba8f1a5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1f4dba8f1a5) - [ux] DSP-6696: prevent ButtonGroup items from being squished

## 16.3.8

### Patch Changes

- [#24874](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24874) [`8cc2f888c83`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8cc2f888c83) - Upgrade Typescript from `4.3.5` to `4.5.5`

## 16.3.7

### Patch Changes

- [#24921](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24921) [`14d635468f6`](https://bitbucket.org/atlassian/atlassian-frontend/commits/14d635468f6) - [ux] DSP-6696: prevent empty ButtonGroup items from showing spacing by switching to flexbox gap

## 16.3.6

### Patch Changes

- [#24492](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/24492) [`8d4228767b0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8d4228767b0) - Upgrade Typescript from `4.2.4` to `4.3.5`.

## 16.3.5

### Patch Changes

- [#23381](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23381) [`e09f1576233`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e09f1576233) - Internal code change turning on new linting rules.
- Updated dependencies

## 16.3.4

### Patch Changes

- [#23191](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/23191) [`65a90f6ba14`](https://bitbucket.org/atlassian/atlassian-frontend/commits/65a90f6ba14) - Use medium icons for button examples

## 16.3.3

### Patch Changes

- [#22614](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/22614) [`8a5bdb3c844`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8a5bdb3c844) - Upgrading internal dependency (bind-event-listener) for improved internal types

## 16.3.2

### Patch Changes

- Updated dependencies

## 16.3.1

### Patch Changes

- Updated dependencies

## 16.3.0

### Minor Changes

- [#20650](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/20650) [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Export BaseProps type to prevent it being referenced via deep import path in d.ts files

### Patch Changes

- [`cb2392f6d33`](https://bitbucket.org/atlassian/atlassian-frontend/commits/cb2392f6d33) - Upgrade to TypeScript 4.2.4

## 16.2.2

### Patch Changes

- Updated dependencies

## 16.2.1

### Patch Changes

- [#19618](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19618) [`62edf20ab1e`](https://bitbucket.org/atlassian/atlassian-frontend/commits/62edf20ab1e) - Migrates all usage of brand tokens to either selected or information tokens. This change is purely for semantic reasons, there are no visual or behavioural changes.
- Updated dependencies

## 16.2.0

### Minor Changes

- [#19019](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/19019) [`dde969b6ef5`](https://bitbucket.org/atlassian/atlassian-frontend/commits/dde969b6ef5) - Fix type error with missing 'css' prop when importing Buttons directly from "@atlaskit/button/standard-button"

### Patch Changes

- Updated dependencies

## 16.1.6

### Patch Changes

- [#16752](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/16752) [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Performance optimisations (reduce tree size and improve style building)
- [`19d72473dfb`](https://bitbucket.org/atlassian/atlassian-frontend/commits/19d72473dfb) - Updates usage of deprecated token names so they're aligned with the latest naming conventions. No UI or visual changes
- Updated dependencies

## 16.1.5

### Patch Changes

- Updated dependencies

## 16.1.4

### Patch Changes

- [#15998](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/15998) [`f460cc7c411`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f460cc7c411) - Builds for this package now pass through a tokens babel plugin, removing runtime invocations of the tokens() function and improving bundle size.
- Updated dependencies

## 16.1.3

### Patch Changes

- [#14777](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/14777) [`c3b0a17a96c`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c3b0a17a96c) - Fix spinner colours for disabled, warning and selected states when using tokens
- Updated dependencies

## 16.1.2

### Patch Changes

- Updated dependencies

## 16.1.1

### Patch Changes

- Updated dependencies

## 16.1.0

### Minor Changes

- [#13302](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/13302) [`e267e790d38`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e267e790d38) - [ux] Colors are now sourced through tokens.

### Patch Changes

- [`2d7cc544696`](https://bitbucket.org/atlassian/atlassian-frontend/commits/2d7cc544696) - Updates token usage to match the latest token set
- Updated dependencies

## 16.0.0

### Major Changes

- An accidental release occurred, you can safely upgrade without making any changes as there is no difference between 15.1.8 and 16.0.0.

### Patch Changes

- Updated dependencies

## 15.1.8

### Patch Changes

- [#12880](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12880) [`378d1cef00f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/378d1cef00f) - Bump `@atlaskit/theme` to version `^11.3.0`.

## 15.1.7

### Patch Changes

- [#12167](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/12167) [`d6f7ff383cf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d6f7ff383cf) - Updates to development dependency `storybook-addon-performance`

## 15.1.6

### Patch Changes

- [#10230](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/10230) [`49961803553`](https://bitbucket.org/atlassian/atlassian-frontend/commits/49961803553) - Now utlises the auto focus hook from `ds-lib`.
- Updated dependencies

## 15.1.5

### Patch Changes

- [#8644](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/8644) [`79c23df6340`](https://bitbucket.org/atlassian/atlassian-frontend/commits/79c23df6340) - Use injected package name and version for analytics instead of version.json.

## 15.1.4

### Patch Changes

- [#5857](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5857) [`d3265f19be`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d3265f19be) - Transpile packages using babel rather than tsc

## 15.1.3

### Patch Changes

- [#6091](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6091) [`9f733e3f59`](https://bitbucket.org/atlassian/atlassian-frontend/commits/9f733e3f59) - Fixes inlined inferred types in @atlaskit/button/loading-button - no material change

## 15.1.2

### Patch Changes

- [#5860](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5860) [`d7540c04cd`](https://bitbucket.org/atlassian/atlassian-frontend/commits/d7540c04cd) - Before `15.x` it was possible for you to pass in `data-testid` and for that to be applied. In `15.x` we changed how props are spread so that is no longer possible. Please use the public API prop `testId` to control `data-testid`

  We have:

  - Improved the types of button so that if you pass in `data-testid` or `data-has-overlay` you will get a type warning
  - Added a _codemod_ to shift over any usages of `data-testid` to `testId` on any of our buttons (`CustomThemeButton`, `LoadingButton` or `StandardButton`)

  #### Upgrading with codemod

  You first need to have the latest button installed before you can run the codemod

  ```
  yarn upgrade @atlaskit/button@^15.1.1
  ```

  Then you can use our cli tool to run the codemod

  ```
  npx @atlaskit/codemod-cli /path/to/target/directory --parser [tsx | flow | babel]
  ```

## 15.1.1

### Patch Changes

- [#5497](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5497) [`5f58283e1f`](https://bitbucket.org/atlassian/atlassian-frontend/commits/5f58283e1f) - Export types using Typescript's new "export type" syntax to satisfy Typescript's --isolatedModules compiler option.
  This requires version 3.8 of Typescript, read more about how we handle Typescript versions here: https://atlaskit.atlassian.com/get-started
  Also add `typescript` to `devDependencies` to denote version that the package was built with.

## 15.1.0

### Minor Changes

- [#5344](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5344) [`1944b0b626`](https://bitbucket.org/atlassian/atlassian-frontend/commits/1944b0b626) - Export BaseOwnProps type to prevent it being referenced via deep import path in declaration files of dependendents

### Patch Changes

- Updated dependencies

## 15.0.0

### Major Changes

- [#4749](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4749) [`f75fedbf16`](https://bitbucket.org/atlassian/atlassian-frontend/commits/f75fedbf16) - In this version we made button dramatically faster and lighter and improved buttons internal spacing 🤩

There are now 3 button variants. We highly recommend you only install button through entry points to ensure minimum kbs. Our codemod will automatically shift you over to the entry point format

```js
// button variants
import Button from '@atlaskit/button/standard-button';
import LoadingButton from '@atlaskit/button/loading-button';
import CustomThemeButton from '@atlaskit/button/custom-theme-button';

// other entry points
import ButtonGroup from '@atlaskit/button/button-group';
import { CustomThemeButtonProps } from '@atlaskit/button/types';
```

### Spacing changes

We have made some intentional changes to button spacing:

- There is now a smaller gap between button text and icons (`8px` → `4px`). This makes a buttons text and icon feel more connected
- Icon only buttons are now square, rather than _almost_ being square (`36px` x `32px` → `32px` x `32px`)

### 1 → 3 button variants

`<Button/>` as we know and love it today, has been split into three variants so that consumers only pay for the features that they use

1. **Standard button (`<Button/>`)**: The standard button that is as fast as possible which is for most usages

- ✅ Supports the existing (discouraged) `GlobalTheme` dark mode pattern

2. **Loading button (`<LoadingButton/>`)**: A small wrapper around `<Button/>` that allows you to show a `@atlaskit/spinner` as an overlay on the button when you set an `isLoading` prop to `true`

- ✅ Supports the existing (discouraged) `GlobalTheme` dark mode pattern

3. **Custom theme button (`<CustomThemeButton/>`)**: This is a 1:1 of what `<Button/>` was previously

- ✅ Supports the same `isLoading` behavior as `<LoadingButton/>`
- ✅ Supports our (discouraged) experimental component theming API. This API has been identified as a performance problem
- ✅ Supports the existing (discouraged) `GlobalTheme` dark mode pattern

### Installing

**All of the variants are all available through separate entry points to ensure minimum bundle size**

```js
import Button from '@atlaskit/button/standard-button';
import LoadingButton from '@atlaskit/button/loading-button';
import CustomThemeButton from '@atlaskit/button/custom-theme-button';
```

You can also import them all from the root entry point if you like! Heads up though, **if your bundler does not support tree shaking then you will not get the minimum possible bundle size**

We have a **automated codemod** you can run to perform many upgrade processes for you. It comes in two flavours:

- `optimistic-15.0.0-lite-mode.ts`: An "optimistic" codemod that moves your buttons to the correct version based on the props you've provided. If you use the `isLoading` prop, it will change the import to use `loading-button`. If you use `theme` prop, imports to `custom-theme-button` will be used. If you have a ThemeProvider above your buttons in the React tree the optimistic codemod can't tell, and this could lead to regressions. Use this codemod with care!
- `15.0.0-lite-mode.ts`: If you wrap your application in a ThemeProvider, you can use this "safe" codemod to change all usages of button to the `custom-theme-button`.

**Running the codemod cli**

To run the codemod: **You first need to have the latest version of button installed before you can run the codemod**

`yarn upgrade @atlaskit/button@^15.0.0`

Once upgraded, use the Atlaskit codemod-cli;

`npx @atlaskit/codemod-cli --parser [PARSER] --extensions [FILE_EXTENSIONS] [TARGET_PATH]`

Or run `npx @atlaskit/codemod-cli -h` for more details on usage.
For Atlassians, refer to [this doc](https://hello.atlassian.net/wiki/spaces/AF/pages/2627171992/Codemods) for more details on the codemod CLI.

```js
import Button, { LoadingButton, CustomThemeButton } from '@atlaskit/button';
```

### Change: default export

Previously the default export of the button package was a button that supported `theme`

```js
import Button from '@atlaskit/button';
```

Now the default export is our 'standard button' which does not support the `theme` prop.

Don't worry if you do use the theming API – our codemods will help move your usages to the correct version.

```js
// before codemod
import Button from '@atlaskit/button';

// after codemod
import Button from '@atlaskit/button/custom-theme-button';
```

### Improved behaviour: disabled buttons

Previously disabled buttons had fairly simple behaviour. They would call `event.stopPropagation()` on an inner element in the _bubble_ phase. This would prevent `onClick` handlers from being called, but not other event types.

We have invested a lot of effort to make a more robust disabled button experience regardless of element type.

#### New disabled button approach

A disabled `<button>` is a native HTML concept, but disabled is not a native concept for other element types such as `<a>` and `<span>`.

The behavior of a disabled `<button>` is imitated as much as possible regardless of element type.

A disabled `<button>` will not fire any user events. We imitate this by:

- Applying `pointer-events: none` to all children elements of the button element. This prevents inner elements publishing events.
- Calling `event.preventDefault()` and `event.stopPropagation()` in the [capture phase](https://javascript.info/bubbling-and-capturing) for the following events: `'mousedown'`,`'mouseup'`, `'keydown'`, `'keyup'`, `'touchstart'`, `'touchend'`, `'pointerdown'`, `'pointerup'`, and `'click`'. This prevents the event performing its default browser behavior and stops the event from proceeding to the bubble phase.
- Not calling provided bubble and capture event listeners.

For a disabled button we also set `tabIndex={-1}`, and if the element has focus, we call `element.blur()`.

### New prop: `overlay` (Standard button only)

The `overlay` prop allows you to render a `React.ReactNode` over the top of the content inside of a button. This prop is only available for the standard button. `LoadingButton` and `CustomThemeButton` use the `overlay` prop for displaying a `@atlaskit/spinner` as needed.

### Improved behavior: overlays

When an overlay is being used (such as for a `@atlaskit/spinner` for `LoadingButton`), then these changes are applied:

- block events as if it is disabled
- won’t lose focus automatically when the overlay is shown (unlike when it is disabled, where the focus is lost)
- allows focus to be given and removed from the element
- won't show `:active` and `:hover` styles (otherwise keeps the same visual and cursor experience as if it did not have an overlay)

Previously, when an overlay was used, the button simply applied `pointer-events: none` to the button content. This approach had a number of shortcomings.

### Other changes

- Adding `font-family: inherit` style rule. Recently, Chrome decided to add `font-family: arial` to the default `<button>` style rules. We fixed this issue by releasing a patch version of `@atlaskit/css-reset`. We have now added the fix into this package as well
- Renaming the `ButtonAppearance` `type` to `Appearance` (the codemod will safely upgrade usages)
- Documentation cleanup
- Examples cleanup

**Automatic upgrading**

We have created some tooling to automatically upgrade your usage of Button!

```
# You first need to have the latest button installed before you can run the codemod
yarn add @atlaskit/button@^15.0.0

# Run the codemod cli
# Pass in a parser for your codebase
npx @atlaskit/codemod-cli /path/to/target/directory --parser [tsx | flow | babel]
```

We have created **two** different codemods for you to choose from:

1. **Safe codemod**: This codemod will shift everything over to `CustomThemeButton` which is a 1:1 of what exists today. This is super safe and you don’t need to do anything but sit back and enjoy. You get some nice performance wins for just doing this. You can then opportunistically move to the other `button` variants at your future convenience.
2. **Optimistic codemod**: The codemod will try it’s hardest to move to the best `button` variant in a module based on usage. This is pretty tricky because we are splitting one thing into three. It can also be a bit dangerous because technically you can use a `ButtonTheme.Provider` higher in the React tree and all buttons will pick up that theme. The codemod cannot know about that nuance. This codemod will add comments to any files where it thinks you will need to make a decision and also point out when you might run into any `ButtonTheme.Provider` issues.

_When you use `@atlaskit/codemod-cli` you will be able to select which codemod you want to run_

### Patch Changes

- [`83e32fa998`](https://bitbucket.org/atlassian/atlassian-frontend/commits/83e32fa998) - Now uses `useAnalyticsEventHandler` in @atlaskit/analytics-next rather than its own version of the hook
- [`e45be534ce`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e45be534ce) - [ux] Unwinding anchor style change in AltaskitThemeProvider. Restoring color: !important to button to deal with specificity wars
- [`6ea0de1281`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6ea0de1281) - [ux] Not allowing anchors to have :visited styles. This restores previous behaviour
- [`642a8a7735`](https://bitbucket.org/atlassian/atlassian-frontend/commits/642a8a7735) - [ux] `AtlaskitThemeProvider` (deprecated) applies a colour reset to anchor tags. This was impacting the colouring of `@atlaskit/button`. To go around specificity issues caused by `AtlaskitThemeProvider` in the past `@atlaskit/button` would apply a `!important` to it's `color` values. We have changed `AtlaskitThemeProvider` so that it will no longer impact the `color` values of `@atlaskit/button`
- Updated dependencies

## 14.0.4

### Patch Changes

- [#4707](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/4707) [`6360c46009`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6360c46009) - Reenable integration tests for Edge browser

## 14.0.3

### Patch Changes

- [#3885](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3885) [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 14.0.2

### Patch Changes

- [#3823](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3823) [`e99262c6f0`](https://bitbucket.org/atlassian/atlassian-frontend/commits/e99262c6f0) - All form elements now have a default font explicitly set

## 14.0.1

### Patch Changes

- [#3293](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3293) [`954cc87b62`](https://bitbucket.org/atlassian/atlassian-frontend/commits/954cc87b62) - The readme and package information has been updated to point to the new design system website.

## 14.0.0

### Major Changes

- [#3335](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/3335) [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

### Patch Changes

- Updated dependencies

## 13.4.2

### Patch Changes

- Updated dependencies

## 13.4.1

### Patch Changes

- [#2866](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2866) [`54a9514fcf`](https://bitbucket.org/atlassian/atlassian-frontend/commits/54a9514fcf) - Build and supporting files will no longer be published to npm

## 13.4.0

### Minor Changes

- [#2137](https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/2137) [`afc842d132`](https://bitbucket.org/atlassian/atlassian-frontend/commits/afc842d132) - FIX: Buton text font-weight changed from normal to medium as per ADG spec

### Patch Changes

- [`98f462e2aa`](https://bitbucket.org/atlassian/atlassian-frontend/commits/98f462e2aa) - Bumping use the latest version of @atlaskit/spinner
- Updated dependencies

## 13.3.12

### Patch Changes

- Updated dependencies

## 13.3.11

### Patch Changes

- [patch][6b8e60827e](https://bitbucket.org/atlassian/atlassian-frontend/commits/6b8e60827e):

  Change imports to comply with Atlassian conventions- [patch][57c0487a02](https://bitbucket.org/atlassian/atlassian-frontend/commits/57c0487a02):

  FIX: Button focus ring color changed to B100- Updated dependencies [449ef134b3](https://bitbucket.org/atlassian/atlassian-frontend/commits/449ef134b3):

- Updated dependencies [f6667f2909](https://bitbucket.org/atlassian/atlassian-frontend/commits/f6667f2909):
- Updated dependencies [68ff159118](https://bitbucket.org/atlassian/atlassian-frontend/commits/68ff159118):
- Updated dependencies [6efb12e06d](https://bitbucket.org/atlassian/atlassian-frontend/commits/6efb12e06d):
- Updated dependencies [fd41d77c29](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd41d77c29):
  - @atlaskit/icon@20.1.1
  - @atlaskit/select@11.0.10
  - @atlaskit/logo@12.3.4
  - @atlaskit/checkbox@10.1.11
  - @atlaskit/webdriver-runner@0.3.4

## 13.3.10

### Patch Changes

- [patch][109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):

  Deletes internal package @atlaskit/type-helpers and removes all usages. @atlaskit/type-helpers has been superseded by native typescript helper utilities.- Updated dependencies [168b5f90e5](https://bitbucket.org/atlassian/atlassian-frontend/commits/168b5f90e5):

- Updated dependencies [0c270847cb](https://bitbucket.org/atlassian/atlassian-frontend/commits/0c270847cb):
- Updated dependencies [109004a98e](https://bitbucket.org/atlassian/atlassian-frontend/commits/109004a98e):
- Updated dependencies [b9903e773a](https://bitbucket.org/atlassian/atlassian-frontend/commits/b9903e773a):
  - @atlaskit/docs@8.5.1
  - @atlaskit/theme@9.5.3
  - @atlaskit/analytics-next@6.3.6

## 13.3.9

### Patch Changes

- Updated dependencies [66dcced7a0](https://bitbucket.org/atlassian/atlassian-frontend/commits/66dcced7a0):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [64fb94fb1e](https://bitbucket.org/atlassian/atlassian-frontend/commits/64fb94fb1e):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [eea5e9bd8c](https://bitbucket.org/atlassian/atlassian-frontend/commits/eea5e9bd8c):
- Updated dependencies [fd5292fd5a](https://bitbucket.org/atlassian/atlassian-frontend/commits/fd5292fd5a):
- Updated dependencies [109c1a2c0a](https://bitbucket.org/atlassian/atlassian-frontend/commits/109c1a2c0a):
- Updated dependencies [c57bb32f6d](https://bitbucket.org/atlassian/atlassian-frontend/commits/c57bb32f6d):
  - @atlaskit/docs@8.4.0
  - @atlaskit/icon@20.1.0
  - @atlaskit/logo@12.3.3
  - @atlaskit/webdriver-runner@0.3.0
  - @atlaskit/checkbox@10.1.10
  - @atlaskit/select@11.0.9
  - @atlaskit/spinner@12.1.6

## 13.3.8

### Patch Changes

- Updated dependencies [e3f01787dd](https://bitbucket.org/atlassian/atlassian-frontend/commits/e3f01787dd):
  - @atlaskit/webdriver-runner@0.2.0
  - @atlaskit/checkbox@10.1.9
  - @atlaskit/select@11.0.8
  - @atlaskit/spinner@12.1.5

## 13.3.7

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2
  - @atlaskit/visual-regression@0.1.9
  - @atlaskit/analytics-next@6.3.5
  - @atlaskit/checkbox@10.1.7
  - @atlaskit/icon@20.0.1
  - @atlaskit/logo@12.3.2
  - @atlaskit/select@11.0.7
  - @atlaskit/spinner@12.1.4
  - @atlaskit/theme@9.5.1
  - @atlaskit/type-helpers@4.2.3

## 13.3.6

### Patch Changes

- Updated dependencies [c0102a3ea2](https://bitbucket.org/atlassian/atlassian-frontend/commits/c0102a3ea2):
  - @atlaskit/icon@20.0.0
  - @atlaskit/logo@12.3.1
  - @atlaskit/docs@8.3.1
  - @atlaskit/checkbox@10.1.6
  - @atlaskit/select@11.0.6

## 13.3.5

### Patch Changes

- [patch][4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):

  Removes babel/runtime from dependencies. Users should see a smaller bundlesize as a result- Updated dependencies [28f8f0e089](https://bitbucket.org/atlassian/atlassian-frontend/commits/28f8f0e089):

- Updated dependencies [82747f2922](https://bitbucket.org/atlassian/atlassian-frontend/commits/82747f2922):
- Updated dependencies [4a223473c5](https://bitbucket.org/atlassian/atlassian-frontend/commits/4a223473c5):
- Updated dependencies [6a8bc6f866](https://bitbucket.org/atlassian/atlassian-frontend/commits/6a8bc6f866):
  - @atlaskit/icon@19.1.0
  - @atlaskit/theme@9.5.0
  - @atlaskit/checkbox@10.1.5
  - @atlaskit/select@11.0.4
  - @atlaskit/spinner@12.1.3

## 13.3.4

### Patch Changes

- [patch][30acc30979](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30acc30979):

  @atlaskit/select has been converted to Typescript. Typescript consumers will now get static type safety. Flow types are no longer provided. No API or behavioural changes.

## 13.3.3

### Patch Changes

- [patch][35d2229b2a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/35d2229b2a):

  Adding missing license to packages and update to Copyright 2019 Atlassian Pty Ltd.

## 13.3.2

### Patch Changes

- [patch][a2d0043716](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a2d0043716):

  Updated version of analytics-next to fix potential incompatibilities with TS 3.6

## 13.3.1

- Updated dependencies [97bab7fd28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/97bab7fd28):
  - @atlaskit/select@10.1.1
  - @atlaskit/checkbox@10.0.0
  - @atlaskit/docs@8.1.7

## 13.3.0

### Minor Changes

- [minor][66e147e6a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66e147e6a1):

  Adding an optional prop `testId` that will set the attribute value `data-testid`. It will help products to write better integration and end to end tests.

## 13.2.0

### Minor Changes

- [minor][93022be303](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/93022be303):

  Align button and subtle button text colour with ADG guidelines (improved contrast)

## 13.1.7

### Patch Changes

- [patch][67a3a1ee02](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/67a3a1ee02):

  Converts prop types to interfaces

## 13.1.6

### Patch Changes

- [patch][097b696613](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/097b696613):

  Components now depend on TS 3.6 internally, in order to fix an issue with TS resolving non-relative imports as relative imports

## 13.1.5

### Patch Changes

- [patch][ecca4d1dbb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ecca4d1dbb):

  Upgraded Typescript to 3.3.x

## 13.1.4

### Patch Changes

- [patch][abee1a5f4f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abee1a5f4f):

  Bumping internal dependency (memoize-one) to latest version (5.1.0). memoize-one@5.1.0 has full typescript support so it is recommended that typescript consumers use it also.

## 13.1.3

### Patch Changes

- [patch][de35ce8c67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/de35ce8c67):

  Updates component maintainers

## 13.1.2

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

## 13.1.1

### Patch Changes

- [patch][688f2957ca](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/688f2957ca):

  Fixes various TypeScript errors which were previously failing silently

## 13.1.0

### Minor Changes

- [minor][8fcbe23ec6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fcbe23ec6):

  Updated types for analytics-next and buttons to make them easier to consume

## 13.0.16

### Patch Changes

- [patch][9f8ab1084b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9f8ab1084b):

  Consume analytics-next ts type definitions as an ambient declaration.

## 13.0.15

### Patch Changes

- [patch][bbff8a7d87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bbff8a7d87):

  Fixes bug, missing version.json file

## 13.0.14

### Patch Changes

- [patch][18dfac7332](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/18dfac7332):

  In this PR, we are:

  - Re-introducing dist build folders
  - Adding back cjs
  - Replacing es5 by cjs and es2015 by esm
  - Creating folders at the root for entry-points
  - Removing the generation of the entry-points at the root
    Please see this [ticket](https://product-fabric.atlassian.net/browse/BUILDTOOLS-118) or this [page](https://hello.atlassian.net/wiki/spaces/FED/pages/452325500/Finishing+Atlaskit+multiple+entry+points) for further details

## 13.0.13

### Patch Changes

- [patch][d0db01b410](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d0db01b410):

  TypeScript users of withAnalyticsEvents and withAnalyticsContext are now required to provide props as a generic type. This is so that TypeScript can correctly calculate the props and defaultProps of the returned component.

  Before:

  ```typescript
  withAnalyticsEvents()(Button) as ComponentClass<Props>;
  ```

  After:

  ```typescript
  withAnalyticsEvents<Props>()(Button);
  ```

## 13.0.12

### Patch Changes

- [patch][29a1f158c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/29a1f158c1):

  Use default react import in typescript files.

## 13.0.11

- Updated dependencies [790e66bece](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/790e66bece):
  - @atlaskit/logo@12.1.1
  - @atlaskit/select@10.0.0

## 13.0.10

- Updated dependencies [87a2638655](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87a2638655):
  - @atlaskit/select@9.1.10
  - @atlaskit/checkbox@9.0.0

## 13.0.9

- Updated dependencies [06326ef3f7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06326ef3f7):
  - @atlaskit/docs@8.1.3
  - @atlaskit/checkbox@8.0.5
  - @atlaskit/select@9.1.8
  - @atlaskit/icon@19.0.0

## 13.0.8

- Updated dependencies [cfc3c8adb3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cfc3c8adb3):
  - @atlaskit/docs@8.1.2
  - @atlaskit/checkbox@8.0.2
  - @atlaskit/select@9.1.5
  - @atlaskit/icon@18.0.0

## 13.0.7

### Patch Changes

- [patch][aaf9d37b31](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aaf9d37b31):

  Move @types/react-router-dom to devDependencies

## 13.0.6

- Updated dependencies [70862830d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/70862830d6):
  - @atlaskit/select@9.1.4
  - @atlaskit/checkbox@8.0.0
  - @atlaskit/icon@17.2.0
  - @atlaskit/theme@9.1.0

## 13.0.5

- [patch][b0ef06c685](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0ef06c685):

  - This is just a safety release in case anything strange happened in in the previous one. See Pull Request #5942 for details

## 13.0.4

- Updated dependencies [215688984e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/215688984e):
  - @atlaskit/select@9.1.2
  - @atlaskit/spinner@12.0.0

## 13.0.3

- [patch][2a2d2060ae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2a2d2060ae):

  - Fixing invalid style for isLoading button

## 13.0.2

- Updated dependencies [4b07b57640](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4b07b57640):
  - @atlaskit/icon@17.0.2
  - @atlaskit/select@9.1.1
  - @atlaskit/logo@12.0.0

## 13.0.1

- [patch][754f83b6f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/754f83b6f0):

  - Makes dependency on @atlaskit/spinner a caret version. No API or behaviour changes.

## 13.0.0

- [major][7c17b35107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7c17b35107):

  - Updates react and react-dom peer dependencies to react@^16.8.0 and react-dom@^16.8.0. To use this package, please ensure you use at least this version of react and react-dom.

## 12.0.8

- [hotfix] fixes style error and changes spinner to a caret version.

## 12.0.7

- BROKEN RELEASE. DO NOT USE.

## 12.0.6

- [patch][e0e3fabf8e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e0e3fabf8e):

  - Change button to use theme's multiple entry points. This should reduce the bundle size of button

## 12.0.5

- [patch][d3cad2622e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d3cad2622e):

  - Removes babel-runtime in favour of @babel/runtime

## 12.0.4

- [patch][0a4ccaafae](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a4ccaafae):

  - Bump tslib

## 12.0.3

- Updated dependencies [9c0b4744be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c0b4744be):
  - @atlaskit/docs@7.0.3
  - @atlaskit/checkbox@6.0.4
  - @atlaskit/icon@16.0.9
  - @atlaskit/logo@10.0.4
  - @atlaskit/spinner@10.0.7
  - @atlaskit/theme@8.1.7

## 12.0.2

- [patch][3f28e6443c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f28e6443c):

  - @atlaskit/analytics-next-types is deprecated. Now you can use types for @atlaskit/analytics-next supplied from itself.

## 12.0.1

- Updated dependencies [d263485853](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d263485853):
  - @atlaskit/spinner@10.0.6

## 12.0.0

- [major][1e826b2966](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e826b2966):

  **Highlights**

  - **New theming API** - Button now supports the new Atlaskit theming API, which allows for powerful custom theming of Buttons and
    its internal components.
  - **Speed improvements** - Button has been re-written from the ground up - on heavy-load benchmarks, Button is twice as fast
    (taking 48% of the time to load).
  - **Emotion support** - Button is now built using Emotion 10! This is part of a wider push
    for Emotion across all Atlaskit components.

  **Breaking Changes:**

  - The old theming API is no longer supported.
  - Styling a Button using Styled Components is no longer supported.
  - Button exports a Theme to use as context instead of using Styled Components' ThemeProvider.
  - Camel-case ARIA props have been renamed (**ariaExpanded**, **ariaHaspopup** and **ariaLabel**).

  See the [upgrade guide](https://atlaskit.atlassian.com/packages/core/button/docs/upgrade-guide) for more details

## 11.0.11

- [patch][f8d92ffc5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f8d92ffc5e):

  - Revert the change to consume entry points from theme

## 11.0.10

- [patch][5e3ad7f751](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5e3ad7f751):

  - Importing theme components from the root theme package instead of the theme build file

## 11.0.9

- [patch][872b3b905a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/872b3b905a):

  - Updates theme to the version which exposes multiple entry points

## 11.0.8

- [patch][22ce87801e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22ce87801e):

  - Optimised usages of theme in button using multiple entry points

## 11.0.7

- [patch][d13fad66df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13fad66df):

  - Enable esModuleInterop for typescript, this allows correct use of default exports

## 11.0.6

- Updated dependencies [fd940a833b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fd940a833b):
  - @atlaskit/spinner@10.0.4

## 11.0.5

- [patch][98e11001ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/98e11001ff):

  - Removes duplicate babel-runtime dependency

## 11.0.4

- Updated dependencies [986c5e47c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/986c5e47c8):
  - @atlaskit/spinner@10.0.2

## 11.0.3

- [patch][59d4ab031b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59d4ab031b):

  - Call mouse handlers (e.g. onMouseDown) which are passed in as props

## 11.0.2

- [patch][1bcaa1b991](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1bcaa1b991):

  - Add npmignore for index.ts to prevent some jest tests from resolving that instead of index.js

## 11.0.1

- [patch][90a14be594](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90a14be594):

  - Fix broken type-helpers

## 11.0.0

- [major][9d5cc39394](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d5cc39394):

  - Dropped ES5 distributables from the typescript packages

## 10.1.3

- Updated dependencies [76299208e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76299208e6):
  - @atlaskit/icon@16.0.4
  - @atlaskit/docs@7.0.0
  - @atlaskit/analytics-next@4.0.0
  - @atlaskit/checkbox@6.0.0
  - @atlaskit/logo@10.0.0
  - @atlaskit/spinner@10.0.0
  - @atlaskit/theme@8.0.0

## 10.1.2

- Updated dependencies [d7ef59d432](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7ef59d432):
  - @atlaskit/docs@6.0.1
  - @atlaskit/checkbox@5.0.11
  - @atlaskit/icon@16.0.0

## 10.1.1

- Updated dependencies [58b84fa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58b84fa):
  - @atlaskit/analytics-next@3.1.2
  - @atlaskit/checkbox@5.0.9
  - @atlaskit/icon@15.0.2
  - @atlaskit/logo@9.2.6
  - @atlaskit/spinner@9.0.13
  - @atlaskit/theme@7.0.1
  - @atlaskit/docs@6.0.0

## 10.1.0

- [minor][36929ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36929ef):

  - Add reset as it is listed as a valid type for button and is useful when building forms

## 10.0.4

- Updated dependencies [d13242d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d13242d):
  - @atlaskit/docs@5.2.3
  - @atlaskit/checkbox@5.0.8
  - @atlaskit/icon@15.0.1
  - @atlaskit/logo@9.2.5
  - @atlaskit/spinner@9.0.12
  - @atlaskit/theme@7.0.0

## 10.0.3

- [patch][76a8f1c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/76a8f1c):

  - Convert @atlaskit/textarea to Typescript
    - Dist paths have changed, if you are importing by exact file path you will need to update your imports `import '@atlaskit/button/dist/es5/components/ButtonGroup'`
    - Flow types are not present any more, Typescript definitions are shipped instead

## 10.0.2

- [patch][8f89287](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8f89287):

  - Add tslib to dependencies to stop load breaking when it's not there

## 10.0.1

- Updated dependencies [ab9b69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ab9b69c):
  - @atlaskit/docs@5.2.2
  - @atlaskit/checkbox@5.0.7
  - @atlaskit/icon@15.0.0

## 10.0.0

- [major][6998f11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6998f11):

  - Converted @atlaskit/button to Typescript
    - Dist paths have changed, if you are importing by exact file path you will need to update your imports
      - E.g. `import '@atlaskit/button/dist/cjs/components/ButtonGroup';` would need to be updated to `import '@atlaskit/button/dist/es5/components/ButtonGroup'`
    - Flow types are not present any more, Typescript definitions are shipped instead

- Updated dependencies [bfac186](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bfac186):
  - @atlaskit/analytics-next-types@3.1.2
  - @atlaskit/type-helpers@2.0.0

## 9.0.16

- [patch] Fix truncation in button [508ca2c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/508ca2c)

## 9.0.15

- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 9.0.14

- [patch] Fix styling of button rendering icon in IE [b4c5b87](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b4c5b87)

## 9.0.13

- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/checkbox@5.0.2
  - @atlaskit/icon@14.0.0

## 9.0.12

- [patch] Add help appearance [3548c3f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3548c3f)

## 9.0.11

- [patch] Update the appearance of selected for Help [196603f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/196603f)

## 9.0.10

- [patch] Updated dependencies [7d51a09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d51a09)
  - @atlaskit/spinner@9.0.9

## 9.0.9

- [patch] Updated dependencies [80e1925](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80e1925)
  - @atlaskit/checkbox@5.0.0

## 9.0.8

- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 9.0.6

- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/spinner@9.0.6
  - @atlaskit/icon@13.2.5
  - @atlaskit/checkbox@4.0.4
  - @atlaskit/docs@5.0.6

## 9.0.5

- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [patch] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/checkbox@4.0.3
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/icon@13.2.4

## 9.0.4

- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/icon@13.2.2
  - @atlaskit/checkbox@4.0.2
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2

## 9.0.3

- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [patch] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/checkbox@4.0.1
  - @atlaskit/theme@5.1.1
  - @atlaskit/spinner@9.0.3
  - @atlaskit/icon@13.2.1

## 9.0.2

- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [patch] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/spinner@9.0.2
  - @atlaskit/docs@5.0.1

## 9.0.1

- [patch] Updated dependencies [619ab41](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/619ab41)
  - @atlaskit/spinner@9.0.1

## 9.0.0

- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/checkbox@4.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/checkbox@4.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0

## 8.2.7

- [patch] Fixed spinner position and size for isLoading state of buttons [d6fb3c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6fb3c9)
- [none] Updated dependencies [d6fb3c9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d6fb3c9)

## 8.2.6

- [patch] Updated prop description for button. Added button label props for inline-edit accessibility. [11205df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11205df)
- [none] Updated dependencies [11205df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11205df)

## 8.2.5

- [patch] Fix flow types [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)

- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
- [none] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)

## 8.2.4

- [patch] Remove or update \$FlowFixMe [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/icon@12.6.1

## 8.2.3

- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0

## 8.2.2

- [patch] Fix \$FlowFixMe and release packages [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [patch] Updated dependencies [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/spinner@7.1.1
  - @atlaskit/checkbox@3.1.2
  - @atlaskit/icon@12.3.1

## 8.2.1

- [patch] Fixed interactions for isLoading state. Now prevents interactions (click, hover, keyboard submit) while loading [4605f44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4605f44)
- [none] Updated dependencies [4605f44](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4605f44)

## 8.2.0

- [minor] Fixes types for Flow 0.74 [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [patch] Updated dependencies [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
  - @atlaskit/spinner@7.1.0
  - @atlaskit/checkbox@3.1.0
  - @atlaskit/icon@12.2.0

## 8.1.2

- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [patch] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/theme@4.0.4
  - @atlaskit/spinner@7.0.2
  - @atlaskit/checkbox@3.0.6
  - @atlaskit/icon@12.1.2

## 8.1.1

- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [patch] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/spinner@7.0.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/analytics-next@2.1.8
  - @atlaskit/checkbox@3.0.5
  - @atlaskit/docs@4.1.1

## 8.1.0

- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/checkbox@3.0.4
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/analytics-next@2.1.7

## 8.0.1

- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/icon@12.0.1
  - @atlaskit/analytics-next@2.1.5
  - @atlaskit/checkbox@3.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/spinner@6.0.1
  - @atlaskit/docs@4.0.1

## 8.0.0

- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/icon@12.0.0
  - @atlaskit/analytics-next@2.1.4
  - @atlaskit/checkbox@3.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0

## 7.2.5

- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/analytics-next@2.1.1
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 7.2.4

- [patch] Export types for Button [6a47d88](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a47d88)
- [none] Updated dependencies [6a47d88](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a47d88)

## 7.2.3

- [patch] Fix invalid css in button [2363d14](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2363d14)
- [none] Updated dependencies [2363d14](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2363d14)

## 7.2.2

- [patch] Fix react ref dev warnings when using custom components [40b743c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40b743c)

## 7.2.0

- [minor] Add ariaLabel prop to button so that it can be passed to the underlying component [d7a1e7e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7a1e7e)

## 7.1.0

- [minor] Add `autoFocus` to button, allowing button to be automatically focused on first render. [bf36eb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bf36eb6)

## 7.0.3

- [patch] Fix a react dev warning when using a custom component [8fb3bc1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fb3bc1)

## 7.0.2

- [patch] Update empty state and button to have consistent types [f0da143](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0da143)

## 7.0.1

- [patch] Update tests + flow [05d406d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05d406d)
- [patch] Remove default props to have it optional [0907a36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0907a36)

## 7.0.0

- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 6.6.4

- [patch] Updates flow types of withAnalyticsEvents and withAnalyticsContext HOCs [26778bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/26778bc)
- [patch] Uses element config flow type with button deprecation warnings hoc [a9aa90a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a9aa90a)

## 6.6.3

- [patch] added onBlur and onFocus hooks [27d01b7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27d01b7)

## 6.6.2

- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 6.6.1

- [patch] added selected focus state for button [dad190d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dad190d)

## 6.6.0

- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 6.5.0

- [minor] Instrument button with analytics [4e84f5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e84f5b)

## 6.4.2

- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 6.4.1

- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 6.4.0

- [minor] id property on Button component is not propagated if href property is provided [7d46c81](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d46c81)

## 6.3.1

- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, \$ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 6.3.0

- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 6.2.0

- [minor] replace flow type to be less restrictive [a28cdbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a28cdbd)

## 6.1.0

- [minor] Add theming to Button. Deprecate 'help' appearance from Button. [c14ea2e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c14ea2e)
- [minor] Add theming to Button. Deprecate 'help' appearance from Button. [c14ea2e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c14ea2e)

## 6.0.0

- [major] Remove typescript [4635000](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4635000)
- [major] Remove typescript [4635000](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4635000)
- [patch] Move button to new repo, tidy types [2dafda6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2dafda6)
- [patch] Move button to new repo, tidy types [2dafda6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2dafda6)

## 5.4.14 (2017-12-01)

- bug fix; fix button group spacing (issues closed: ak-3978) ([f0037f2](https://bitbucket.org/atlassian/atlaskit/commits/f0037f2))

## 5.4.13 (2017-11-30)

- bug fix; fix disabled buttons with child elements propagating click events ([584ffdc](https://bitbucket.org/atlassian/atlaskit/commits/584ffdc))

## 5.4.12 (2017-11-27)

- bug fix; export interface for ts ([15c291c](https://bitbucket.org/atlassian/atlaskit/commits/15c291c))

## 5.4.11 (2017-11-27)

- bug fix; fix disabled buttons not swallowing click events (issues closed: ak-3646) ([80e976b](https://bitbucket.org/atlassian/atlaskit/commits/80e976b))

## 5.4.10 (2017-11-24)

- bug fix; fix button-group prop validation to ignore null children ([3f7f0c3](https://bitbucket.org/atlassian/atlaskit/commits/3f7f0c3))

## 5.4.9 (2017-11-21)

- bug fix; bumping internal dependencies to latest version ([5e81848](https://bitbucket.org/atlassian/atlaskit/commits/5e81848))

## 5.4.8 (2017-10-27)

- bug fix; correct formatting for user-select style ([fe9419c](https://bitbucket.org/atlassian/atlaskit/commits/fe9419c))

## 5.4.7 (2017-10-27)

- bug fix; change icon to be unselectable so button content can be copied ([e8c876a](https://bitbucket.org/atlassian/atlaskit/commits/e8c876a))

## 5.4.6 (2017-10-27)

- bug fix; updated button props typings ([c7a9c09](https://bitbucket.org/atlassian/atlaskit/commits/c7a9c09))

## 5.4.5 (2017-10-23)

- bug fix; support false/null/undefined children in ButtonGroup ([4667228](https://bitbucket.org/atlassian/atlaskit/commits/4667228))

## 5.4.4 (2017-10-22)

- bug fix; update dependencies for react-16 ([077d1ad](https://bitbucket.org/atlassian/atlaskit/commits/077d1ad))

## 5.4.3 (2017-10-16)

- bug fix; fix issue where invalid box-shadow style was applied (issues closed: ak-3704) ([a786038](https://bitbucket.org/atlassian/atlaskit/commits/a786038))

## 5.4.2 (2017-10-03)

- bug fix; improve button performance ([1bbf0d1](https://bitbucket.org/atlassian/atlaskit/commits/1bbf0d1))

## 5.4.1 (2017-09-27)

- bug fix; button will truncate if wider than its parent (issues closed: ak-3332) ([a701ea1](https://bitbucket.org/atlassian/atlaskit/commits/a701ea1))

## 5.4.0 (2017-09-22)

- feature; buttons no longer prevent text selection (issues closed: ak-3270) ([9ab343b](https://bitbucket.org/atlassian/atlaskit/commits/9ab343b))

## 5.3.0 (2017-09-18)

- feature; support new Help button appearance (issues closed: ak-3535) ([69728ed](https://bitbucket.org/atlassian/atlaskit/commits/69728ed))

## 5.2.0 (2017-09-12)

- feature; we need the ability to reference elements ([cbf5c12](https://bitbucket.org/atlassian/atlaskit/commits/cbf5c12))

## 5.1.2 (2017-09-08)

- bug fix; adding ButtonGroup to type declarations of button pckage. ([bb373c1](https://bitbucket.org/atlassian/atlaskit/commits/bb373c1))

## 5.1.1 (2017-08-24)

- bug fix; improved focus ring contrast for warning and danger buttons ([39ddda7](https://bitbucket.org/atlassian/atlaskit/commits/39ddda7))

## 5.1.0 (2017-08-23)

- bug fix; subtle-link button font colour is slightly updated (issues closed: ak-2480) ([510393a](https://bitbucket.org/atlassian/atlaskit/commits/510393a))
- feature; added warning (yellow) and danger (red) options to Button.appearance prop (issues closed: ak-2480) ([ba4cfde](https://bitbucket.org/atlassian/atlaskit/commits/ba4cfde))

## 5.0.1 (2017-08-16)

- bug fix; fix react warning about PropTypes ([6b4cd29](https://bitbucket.org/atlassian/atlaskit/commits/6b4cd29))

## 5.0.0 (2017-08-11)

- bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
- bug fix; button: fix focus box shadow ([9746e73](https://bitbucket.org/atlassian/atlaskit/commits/9746e73))
- bug fix; button: fix dark link color - default / hover / active ([7b85a29](https://bitbucket.org/atlassian/atlaskit/commits/7b85a29))
- breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- feature; implement dark mode ([d959bb1](https://bitbucket.org/atlassian/atlaskit/commits/d959bb1))

## 4.0.0 (2017-08-11)

- bug fix; button: fix focus box shadow ([9746e73](https://bitbucket.org/atlassian/atlaskit/commits/9746e73))
- bug fix; button: fix dark link color - default / hover / active ([7b85a29](https://bitbucket.org/atlassian/atlaskit/commits/7b85a29))
- breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
- feature; implement dark mode ([d959bb1](https://bitbucket.org/atlassian/atlaskit/commits/d959bb1))

## 3.6.0 (2017-08-09)

- feature; export ButtonGroup from button package (issues closed: ak-2382) ([61682c6](https://bitbucket.org/atlassian/atlaskit/commits/61682c6))

## 3.5.3 (2017-07-27)

- fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.5.2 (2017-07-25)

- fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.5.1 (2017-07-20)

- fix; return focus ring to buttons ([94f1ad0](https://bitbucket.org/atlassian/atlaskit/commits/94f1ad0))

## 3.2.0 (2017-07-17)

- fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 3.2.0 (2017-07-17)

- feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.1.0 (2017-07-10)

- feature; added functionality to have full-width buttons via optional prop ([ad7fae6](https://bitbucket.org/atlassian/atlaskit/commits/ad7fae6))

## 2.0.0 (2017-06-01)

- fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
- refactored button to styled-components ([de6465b](https://bitbucket.org/atlassian/atlaskit/commits/de6465b))
- breaking; refactored to styled-components
- ISSUES CLOSED: AK-2381, AK-2300

## 1.1.4 (2017-05-25)

- fix; update util-shared-styles dependency in button ([159dd02](https://bitbucket.org/atlassian/atlaskit/commits/159dd02))

## 1.1.3 (2017-05-06)

- fix; link buttons with no spacing are now baseline aligned correctly ([66f5e65](https://bitbucket.org/atlassian/atlaskit/commits/66f5e65))

## 1.1.2 (2017-04-27)

- fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 1.1.1 (2017-04-26)

- fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 1.1.0 (2017-04-20)

- feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 1.0.16 (2017-04-04)

- fix; adds defensive code to allow testing in mocha/jsdom ([3f9b72c](https://bitbucket.org/atlassian/atlaskit/commits/3f9b72c))

## 1.0.15 (2017-03-23)

- fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.0.13 (2017-03-21)

- fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.11 (2017-03-08)

- fix; fix subtle-link button to use the correct color default color ([c4c274d](https://bitbucket.org/atlassian/atlaskit/commits/c4c274d))

## 1.0.10 (2017-02-28)

- fix; dummy commit to release stories ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 1.0.9 (2017-02-28)

- fix; dummy commit to fix broken stories and missing registry pages ([a31e92a](https://bitbucket.org/atlassian/atlaskit/commits/a31e92a))

## 1.0.8 (2017-02-28)

- fix; dummy commit to release stories for components ([a105c02](https://bitbucket.org/atlassian/atlaskit/commits/a105c02))

## 1.0.7 (2017-02-28)

- fix; Removes jsdoc annotations from button ([fe8e23b](https://bitbucket.org/atlassian/atlaskit/commits/fe8e23b))

## 1.0.6 (2017-02-24)

- fix; fixes AK-1787: buttons with z-index + shadow ([014af88](https://bitbucket.org/atlassian/atlaskit/commits/014af88))
- fix; spinner related tests fixed ([e6d8ad5](https://bitbucket.org/atlassian/atlaskit/commits/e6d8ad5))
- fix; storybook clean up and button margin fixed ([e06b9c5](https://bitbucket.org/atlassian/atlaskit/commits/e06b9c5))

## 1.0.5 (2017-02-20)

- fix; use correctly scoped package names in npm docs ([91dbd2f](https://bitbucket.org/atlassian/atlaskit/commits/91dbd2f))

## 1.0.4 (2017-02-16)

- fix; refactor stories to use // rather than http:// ([a0826cf](https://bitbucket.org/atlassian/atlaskit/commits/a0826cf))

## 1.0.3 (2017-02-09)

- fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.0.2 (2017-02-09)

- fix; readme refactor to use util-readme ([1adf905](https://bitbucket.org/atlassian/atlaskit/commits/1adf905))

## 1.0.1 (2017-02-06)

- fix; Updates package to use ak scoped packages ([1262016](https://bitbucket.org/atlassian/atlaskit/commits/1262016))
