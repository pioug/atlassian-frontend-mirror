import React from 'react';

import { code, Example, md } from '@atlaskit/docs';

export default md`

  Popper is a simple wrapper around the React Popper library that provides some helpers and
  common configuration for popper elements used in the Design System.

  **Popper does not export any UI components.** If you are looking for UI components that use pop-up
  behaviour, check out these components:
  - [Tooltip](/packages/design-system/tooltip) for items that appear on hover over a reference element
  - [Popup](/packages/design-system/popup) for items that appear on-click such as menus

  ${(
    <Example
      packageName="@atlaskit/popper"
      Component={require('../examples/00-basic-positioning').default}
      title="Basic example of popper"
      source={require('../examples/00-basic-positioning')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/popper"
      Component={require('../examples/01-scroll-container').default}
      title="Popper in a scroll container"
      source={require('../examples/01-scroll-container')}
    />
  )}

  #### Testing Note
  Due to a bug in \`react-popper\`, a console.error message relating to React \`act()\`
  may be raised on some tests. It should not cause test failures. This issue has been raised in
  [the React Popper issue tracker](https://github.com/popperjs/react-popper/issues/368)

  ## React Popper
  React-popper is a React wrapper around \`Popper JS\`. It has two APIs – a
  [render props API](https://popper.js.org/react-popper/v2/render-props/) and a newer hooks-based API.

  \`@atlaskit/popper\` wraps the render props API, setting some common behaviours (see below).



  ## Usage
  Popper has three main exports, which are all necessary to configure the popper.


  ${code`
    import { Manager, Popper, Reference } from '../src';
  `}


  - the **Reference** component wraps your reference element – that is, the element that your
  popper should be 'attached' to. It passes a \`ref\` render prop to its child, which should
  be attached to the dom element you want the popper to be attached to.
  - the **Popper** component wraps your popper element, which will be positioned around the
  reference element. It passes a few render props to its child, in particular a \`ref\` prop
  which should be attached to the DOM element that you want to position, and a \`style\` prop
  which supplies the necessary styles to position the DOM element. For more information on the
  render props, check [the react-popper docs](https://popper.js.org/react-popper/v2/render-props/)
  - the **Manager** must be wrapped around both the Popper and Reference.

  An example of how these can be put together is shown below:

  ${code`
  <Manager>
    <Reference>
      {({ ref }) => (
        <div ref={ref}> // Pass in ref to your reference element
          Reference element
        </div>
      )}
    </Reference>
    <Popper>
      {({ ref, style, isReferenceHidden }) => (
        <Popup  // Your popup component (here an emotion component)
          innerRef={ref || undefined}    // Pass in ref to your popup element
          style={style} // Pass in the popper styles to position the component
          isReferenceHidden={isReferenceHidden} // Pass through other render props as necessary
        >
          Popper component
        </Popup>
      )}
    </Popper>
  </Manager>
  `}

  ## Standard behaviours
  Poppers will try to flip to stay in the document/window boundaries (plus
  padding), and shift along the reference boundary until the reference is
  off-screen. You can customise this behaviour using custom modifiers.

  ### Scroll Container
  Poppers won't flip or shift when over the edge of scroll-container; but
  when using isReferenceHidden they will hide.

  ### Modifiers:
  PopperJS is extensible with a number of different modifiers, which hook into the lifecycle
  of Popper and apply different behaviours such as positioning, overflow and hiding the popper.
  Many of the core features that make Popper JS useful are implemented as modifiers, and \`@atlaskit/popper\`
  applies several of these by default. You can find out more about modifiers in the
  [Popper JS docs](https://popper.js.org/docs/v2/modifiers/)

  The default behaviours we enable for \`@atlaskit/popper\` are listed below: to overwrite these behaviours pass
  an array of replacement modifiers using the \`modifiers\` prop.

  - **[flip](https://popper.js.org/docs/v2/modifiers/flip/):** The *flip modifier* changes the
    placement of a popper if it's about to overflow a specific boundary. \`@atlaskit/popper\`
    enables this by default with some padding included.

    - By default \`Popper JS\` allows poppers to flip on multiple axes, which is disabled via \`flipVariations\`
    to allow the popper to 'slide' along the edge of the reference component as the reference leaves.
    - \`@atlaskit/popper\` sets the boundary where the popper flips to the viewport, rather than the document.

  ${code`
    {
      name: 'flip',
      options: {
        flipVariations: false,
        padding: 5,
        boundary: 'clippingParents',
        rootBoundary: 'viewport',
      },
    },
  `}

  - **[hide](https://popper.js.org/docs/v2/modifiers/hide/):** Sets a render prop \`isReferenceHidden\`
   when the reference element is hidden (i.e. leaves the viewport or the edges of the scroll container),
   and \`hasPopperEscaped\` when the popper becomes detached from its reference. This behaviour is enabled
   by default in \`react-popper\` and has no additional config in \`@atlaskit/popper\`.

  - **[offset](https://popper.js.org/docs/v2/modifiers/offset/):** Allows for the popper to be offset by a customisable
   amount in the x or y direction. The first value is the offset *along* the edge of the reference, while the second is
   the distance *away* from the reference. This is set to the value provided in \`@atlaskit/popper\`'s offset prop,
   and defaults to to 0px offset along, and 8px offset away ([0, 8])

   ${code`
    {
      name: 'offset',
      options: {
        offset: offset //(default [0, 8]),
      },
    },
  `}

  - **[preventOverflow](https://popper.js.org/docs/v2/modifiers/prevent-overflow/):** Moves the popper along the edge
    of the reference so that its contents aren't outside of the viewport boundary.
    Padding changes the distance from the edge of the viewport at which the popper starts to move.

  ${code`
    {
      name: 'preventOverflow',
      options: {
        padding: 5,
        rootBoundary: 'document',
      },
    },
  `}


`;
