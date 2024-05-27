// this is to DOCUMENT/display the underlying react popper props, for our atlaskit/select documentation

import { type Modifier, type Options } from '@popperjs/core';

type Placement =
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end';
type Strategy = 'absolute' | 'fixed';

interface NativeReactPopperProps<Name = unknown> {
  /** Function `(?HTMLElement) => void` that can be used to obtain popper reference */
  innerRef?: React.Ref<any>;

  /** One of the accepted placement values listed in the Popper.js documentation.
   Your popper is going to be placed according to the value of this property.
  Defaults to bottom.*/
  placement?: Placement;

  /** Describes the positioning strategy to use. By default, it is absolute, which in the simplest cases does not
   * require repositioning of the popper. If your reference element is in a fixed container, use the fixed strategy. */
  strategy: Strategy;

  /** An object containing custom settings for the Popper.js modifiers.
   You can use this property to override their settings or to inject your custom ones.
  See [Popper Modifiers](https://popper.js.org/docs/v2/modifiers/) for full details. */
  modifiers?: ReadonlyArray<Modifier<Name, Options>>;
}

export default function ertHackForPopper(_: NativeReactPopperProps) {}
