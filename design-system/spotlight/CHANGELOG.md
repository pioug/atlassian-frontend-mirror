# @atlaskit/spotlight

## 0.7.0

### Minor Changes

- [`6e38d616cae8e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6e38d616cae8e) -
  Allow back, next, done actions to be passed into PopoverContent. These actions will be used if no
  onClick handler is passed to SpotlightSecondaryAction, SpotlightPrimaryAction. If onClick handlers
  are provided to the specific components, then they will take preference over what is passed to
  PopoverContent.

## 0.6.4

### Patch Changes

- Updated dependencies

## 0.6.3

### Patch Changes

- [`1b4bf57dec49e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/1b4bf57dec49e) -
  Make 'click-outside-to-dismiss' functionality optional.
- Updated dependencies

## 0.6.2

### Patch Changes

- Updated dependencies

## 0.6.1

### Patch Changes

- [`598872f9c6e06`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/598872f9c6e06) -
  Spotlight now dismisses on user click-outside.

## 0.6.0

### Minor Changes

- [`c43cbdde6f08c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c43cbdde6f08c) -
  `PopoverContent` `dismiss` prop is now required.

## 0.5.1

### Patch Changes

- [`4f9f525caaa13`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/4f9f525caaa13) -
  Implement 'dismiss on escape key press' functionality. Escape will cause the current spotlight to
  call the `dismiss` function passed to `PopoverContent`. Implementation of the `dismiss` function
  is up to the consumer of the package.
- Updated dependencies

## 0.5.0

### Minor Changes

- [`72526321aecd0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/72526321aecd0) -
  Create UNSAFE_UpdateOnChange component to test strategies for recalculating PopoverContent
  position when the DOM changes.

## 0.4.1

### Patch Changes

- [`499c871b73060`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/499c871b73060) -
  Exports the PopoverContentProps

## 0.4.0

### Minor Changes

- [`07392017dde4f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/07392017dde4f) -
  Remove `width: fit-content` styling from `PopoverTarget`.

## 0.3.5

### Patch Changes

- [`39e543109ec09`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/39e543109ec09) -
  add type info to forwardRef components
- Updated dependencies

## 0.3.4

### Patch Changes

- [`cc92031710191`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/cc92031710191) -
  `SpotlightDismissControl` now applies `autofocus` when it is mounted.

## 0.3.3

### Patch Changes

- [`bd8e43d78afb8`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/bd8e43d78afb8) - -
  Add `role="dialog"` to PopoverContent. `aria-labelledby` is internally managed by
  `SpotlightContext`.
  - Add `aria-label='Dismiss'` to `SpotlightDismissControl`.
  - Add `aria-label'` prop to `SpotlightPrimaryAction`.
  - Add `aria-label'` prop to `SpotlightSecondaryAction`.

## 0.3.2

### Patch Changes

- [`ec2250eef3ec9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/ec2250eef3ec9) -
  Spotlight now accepts `top-center` and `bottom-center` placements to ensure SpotlightCard content
  can be seen on small viewports.

## 0.3.1

### Patch Changes

- [`89687a02d7e6b`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/89687a02d7e6b) -
  Internal changes to support @compiled/react.

## 0.3.0

### Minor Changes

- [`7e3c08df816e2`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7e3c08df816e2) - -
  Apply `z-index: 700` to caret to fix a bug with box-shadow in dark mode.
  - Apply `color: var(--ds-color-text-inverse)` to `SpotlightCard` so consumers get inverse color
    styles without needing to use `Text`.
  - Remove `SpotlightShowMoreControl` references in examples and documentation. Functionality
    remains unchanged.

## 0.2.6

### Patch Changes

- [`918be17f9334c`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/918be17f9334c) -
  Vertically align heading to caret.

## 0.2.5

### Patch Changes

- [`568c26a3efec9`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/568c26a3efec9) -
  Apply elevation.shadow.overflow box-shadow to SpotlightCard.

## 0.2.4

### Patch Changes

- Updated dependencies

## 0.2.3

### Patch Changes

- Updated dependencies

## 0.2.2

### Patch Changes

- [`23bcc5bbc9cee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/23bcc5bbc9cee) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 0.2.1

### Patch Changes

- [`3b5b4a919aaaf`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3b5b4a919aaaf) -
  Internal changes to how border radius is applied.
- Updated dependencies

## 0.2.0

### Minor Changes

- [`7663adf335f3f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7663adf335f3f) -
  Rename `Spotlight` to `SpotlightCard`. Removed `TourContext` - please use `useState` to manage
  Spotlight visibility instead.

## 0.1.0

### Minor Changes

- [`0bc8c3d1f15ee`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/0bc8c3d1f15ee) -
  Apply `flex-direction: row-reverse;` to `SpotlightControls` to make `SpotlightDismissControl` the
  first focusable element in `Spotlight`.

### Patch Changes

- [`6fa400e1910b7`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6fa400e1910b7) -
  Styling update to `PopoverContent` to set `z-index: 700` to ensure `Spotlight` displays correctly
  on top of Atlassian layering elements.
- Updated dependencies

## 0.0.18

### Patch Changes

- [`24f083242a2df`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/24f083242a2df) -
  Styling update to `PopoverTarget` to set `width: fit-content` to ensure `PopoverContent` displays
  correctly in relation to target element.
- Updated dependencies

## 0.0.17

### Patch Changes

- Updated dependencies

## 0.0.16

### Patch Changes

- [`13c698778e3c6`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/13c698778e3c6) -
  [ux] Atlaspack version bump

## 0.0.15

### Patch Changes

- [`5d9897e6c4558`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/5d9897e6c4558) -
  Temporary styling update to SpotlightPrimaryAction, SpotlightSecondaryAction,
  SpotlightDismissControl, SpotlightShowMoreControl to more closely match design ahead of visually
  refreshed tokens.

## 0.0.14

### Patch Changes

- [`85a83a17c7d56`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/85a83a17c7d56) -
  Tweak offset of caret positioning so as not to overlap the target component.
- Updated dependencies

## 0.0.13

### Patch Changes

- [`15963c2a4fb01`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/15963c2a4fb01) -
  Create StepCount component.

## 0.0.12

### Patch Changes

- [`7121a32fb1613`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/7121a32fb1613) -
  Create ShowMoreControl component.

## 0.0.11

### Patch Changes

- [#200012](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/200012)
  [`fa829c42fc74f`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/fa829c42fc74f) -
  Create SpotlightMedia component.

## 0.0.10

### Patch Changes

- [#198989](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/198989)
  [`c4a86f623352d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/c4a86f623352d) -
  Allow Spotlight to be dismissed. Implement basic Spotlight Tour functionality.

## 0.0.9

### Patch Changes

- [`d972e69e6461e`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d972e69e6461e) -
  Create Body component. Rework spacing of Spotlight card. Minor refactoring.

## 0.0.8

### Patch Changes

- [`9d9570259070a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9d9570259070a) -
  Create PopoverProvider, PopoverTarget, PopoverContent components.
- [`9d9570259070a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/9d9570259070a) -
  Create Caret component. Positions the Spotlight UI card in relation to the Caret component, and
  positions the Caret component in relation to the PopoverTarget element.

## 0.0.7

### Patch Changes

- [#197821](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/197821)
  [`f9dbe2c16f7e0`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/f9dbe2c16f7e0) -
  Create PopoverProvider, PopoverTarget, PopoverContent components.

## 0.0.6

### Patch Changes

- [`11c7c29e7cff4`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/11c7c29e7cff4) -
  Create Controls, and DismissControl components.

## 0.0.5

### Patch Changes

- [`d63550f8e338a`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/d63550f8e338a) -
  Create Footer, Actions, PrimaryAction, SecondaryAction components.

## 0.0.4

### Patch Changes

- Updated dependencies

## 0.0.3

### Patch Changes

- [#193958](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/193958)
  [`6fb7706c6ce32`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/6fb7706c6ce32) -
  Create Header and Headline components.
- Updated dependencies

## 0.0.2

### Patch Changes

- [#189418](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/189418)
  [`3f609b46c1aec`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/3f609b46c1aec) -
  Create initial @atlaskit/spotlight package scaffold.
