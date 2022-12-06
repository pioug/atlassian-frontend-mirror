import React, { PureComponent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import FocusLock from 'react-focus-lock';
import Select, { components as RSComponents, mergeStyles } from 'react-select';
import { uid } from 'react-uid';
import {
  Manager,
  Reference,
  Popper,
  PopperProps,
  Modifier,
} from 'react-popper';
import { Placement } from '@popperjs/core';
import NodeResolver from 'react-node-resolver';
import shallowEqualObjects from 'shallow-equal/objects';

import { N80 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { MenuDialog, DummyControl, defaultComponents } from './components';
import baseStyles from '../styles';
import {
  GroupType,
  OptionType,
  ActionMeta,
  ReactSelectProps,
  StylesConfig,
  ValueType,
  ValidationState,
} from '../types';
import { bind, UnbindFn } from 'bind-event-listener';

type SelectComponents = typeof RSComponents;

/** Are we rendering on the client or server? */
const canUseDOM = () =>
  Boolean(
    typeof window !== 'undefined' &&
      window.document &&
      window.document.createElement,
  );

// ==============================
// Types
// ==============================

type defaultModifiers = 'offset' | 'preventOverflow';

type PopperPropsNoChildren<Modifiers> = Omit<
  PopperProps<Modifiers>,
  'children'
>;

interface PopupSelectTriggerProps {
  ref: any;
  'aria-haspopup': 'true';
  'aria-expanded': boolean;
  'aria-controls'?: string;
}

type ModifierList =
  | 'offset'
  | 'computeStyles'
  | 'preventOverflow'
  | 'handleFlipStyle'
  | 'flip'
  | 'popperOffsets'
  | 'arrow'
  | 'hide'
  // Line below to be removed [https://product-fabric.atlassian.net/browse/DSP-6093]
  | string;

export interface PopupSelectProps<
  Option = OptionType,
  IsMulti extends boolean = false,
  Modifiers = ModifierList,
> extends ReactSelectProps<Option, IsMulti> {
  /**
   * Defines whether the menu should close when selected. Defaults to "true"
   */
  closeMenuOnSelect?: boolean;
  /**
   * The footer content shown at the bottom of the Popup, underneath the Select options
   */
  footer?: ReactNode;
  // eslint-disable-next-line jsdoc/require-asterisk-prefix, jsdoc/check-alignment
  /**
    The props passed down to React Popper.

    Use these to override the default positioning strategy, behaviour and placement used by this library.
    For more information, see the [React Popper documentation](https://popper.js.org/react-popper/v2/render-props).

   */
  popperProps?: PopperPropsNoChildren<Modifiers>;
  /**
   * The maximum number of options the select can contain without rendering the search field. Defaults to 5.
   */
  searchThreshold?: number;
  /**
   * If false, renders a select with no search field. If true, renders a search field in the select when the
   * number of options exceeds the `searchThreshold`. Defaults to true.
   */
  isSearchable?: boolean;
  /**
   * The maximum width for the popup menu. Can be a number, representing width in pixels,
   * or a string containing a CSS length datatype.
   */
  maxMenuWidth?: number | string;
  /**
   * The maximum width for the popup menu. Can be a number, representing width in pixels,
   * or a string containing a CSS length datatype.
   */
  minMenuWidth?: number | string;
  // eslint-disable-next-line jsdoc/require-asterisk-prefix, jsdoc/check-alignment
  /**
    Render props used to anchor the popup to your content.

    Make this an interactive element, such as an @atlaskit/button component.

    The provided render props in `options` are detailed below:
    - `isOpen`: The current state of the popup.
        Use this to change the appearance of your target based on the state of your component
    - `ref`: Pass this ref to the element the Popup should be attached to
    - `aria-haspopup`, `aria-expanded`, `aria-controls`: Spread these onto a target element to
        ensure your experience is accessible
   */
  target?: (
    options: PopupSelectTriggerProps & { isOpen: boolean },
  ) => ReactNode;
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  /* The prop indicates if the component has a compacted look */
  spacing?: string;
  /* @deprecated Use isInvalid instead. The state of validation if used in a form */
  validationState?: ValidationState;
  /* This prop indicates if the component is in an error state */
  isInvalid?: boolean;
}

interface State<Modifiers = string> {
  focusLockEnabled: boolean;
  isOpen: boolean;
  mergedComponents: Object;
  mergedPopperProps: PopperPropsNoChildren<defaultModifiers | Modifiers>;
}

// ==============================
// Class
// ==============================

const modifiers: Modifier<'offset' | 'preventOverflow'>[] = [
  { name: 'offset', options: { offset: [0, 8] } },
  {
    name: 'preventOverflow',
    enabled: true,
    options: {
      padding: 5,
      boundary: 'clippingParents',
      altAxis: true,
      altBoundary: true,
    },
  },
];

const defaultPopperProps: PopperPropsNoChildren<defaultModifiers> = {
  modifiers,
  placement: 'bottom-start' as Placement,
};

const isEmpty = (obj: Object) => Object.keys(obj).length === 0;

export default class PopupSelect<
  Option = OptionType,
  IsMulti extends boolean = false,
> extends PureComponent<PopupSelectProps<Option, IsMulti>, State> {
  menuRef: HTMLElement | null = null;
  selectRef: Select<Option, IsMulti> | null = null;
  targetRef: HTMLElement | null = null;
  unbindWindowClick: UnbindFn | null = null;
  unbindWindowKeydown: UnbindFn | null = null;

  defaultStyles: StylesConfig<Option, IsMulti> = mergeStyles(
    baseStyles(
      this.props.validationState ||
        (this.props.isInvalid ? 'error' : 'default'),
      this.props.spacing === 'compact',
      'default',
    ),
    {
      groupHeading: (provided) => ({
        ...provided,
        color: token('color.text.subtlest', N80),
      }),
    },
  );

  isOpenControlled = this.props.isOpen !== undefined;
  defaultOpenState = this.isOpenControlled
    ? this.props.isOpen
    : this.props.defaultIsOpen;

  state = {
    focusLockEnabled: false,
    isOpen: this.defaultOpenState ?? false,
    mergedComponents: defaultComponents,
    mergedPopperProps: defaultPopperProps as PopperPropsNoChildren<
      defaultModifiers | string
    >,
  };

  popperWrapperId = `${uid({ options: this.props.options })}-popup-select`;

  static defaultProps = {
    closeMenuOnSelect: true,
    components: {},
    maxMenuHeight: 300,
    maxMenuWidth: 440,
    minMenuWidth: 220,
    popperProps: {},
    isSearchable: true,
    searchThreshold: 5,
    styles: {},
    options: [],
  };

  static getDerivedStateFromProps(
    props: PopupSelectProps<OptionType>,
    state: State,
  ) {
    const newState: Partial<State> = {};

    // Merge consumer and default popper props
    const mergedPopperProps = { ...defaultPopperProps, ...props.popperProps };
    if (!shallowEqualObjects(mergedPopperProps, state.mergedPopperProps)) {
      newState.mergedPopperProps = mergedPopperProps;
    }

    // Merge consumer and default components
    const mergedComponents = { ...defaultComponents, ...props.components };
    if (!shallowEqualObjects(mergedComponents, state.mergedComponents)) {
      newState.mergedComponents = mergedComponents;
    }

    if (!isEmpty(newState)) {
      return newState;
    }

    return null;
  }

  componentDidMount() {
    if (typeof window === 'undefined') {
      return;
    }
    this.unbindWindowClick = bind(window, {
      type: 'click',
      listener: this.handleClick,
      options: { capture: true },
    });
  }

  componentWillUnmount() {
    if (typeof window === 'undefined') {
      return;
    }
    this.unbindWindowClick?.();
    this.unbindWindowClick = null;
    this.unbindWindowKeydown?.();
    this.unbindWindowKeydown = null;
  }

  componentDidUpdate(prevProps: PopupSelectProps<Option, IsMulti>) {
    const { isOpen } = this.props;

    if (prevProps.isOpen !== isOpen) {
      if (isOpen === true) {
        this.open({ controlOverride: true });
      } else if (isOpen === false) {
        this.close({ controlOverride: true });
      }
    }
  }

  // Event Handlers
  // ==============================

  handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
      case 'Esc':
        this.close();
        break;
      default:
    }
    if (this.props.handleKeyDown) {
      this.props.handleKeyDown(event);
    }
  };

  handleClick = ({ target }: MouseEvent) => {
    const { isOpen } = this.state;
    // appease flow
    if (!(target instanceof Element)) {
      return;
    }

    // NOTE: Why not use the <Blanket /> component to close?
    // We don't want to interupt the user's flow. Taking this approach allows
    // user to click "through" to other elements and close the popout.
    if (isOpen && this.menuRef && !this.menuRef.contains(target)) {
      this.close();
    }

    // open on target click -- we can't trust consumers to spread the onClick
    // property to the target
    if (!isOpen && this.targetRef && this.targetRef.contains(target)) {
      this.open();
    }
  };

  handleSelectChange = (
    value: ValueType<Option, IsMulti>,
    actionMeta: ActionMeta<Option>,
  ) => {
    const { closeMenuOnSelect, onChange } = this.props;
    if (closeMenuOnSelect && actionMeta.action !== 'clear') {
      this.close();
    }
    if (onChange) {
      onChange(value, actionMeta);
    }
  };

  handleFirstPopperUpdate = () => {
    // When the popup opens it's focused into. Since the popup is inside a portal, it's position is
    // initially set to 0,0 - this causes the window scroll position to jump to the top. To prevent
    // this we defer enabling the focus-lock until after Popper has positioned the popup the first time.
    this.setState({ focusLockEnabled: true });
  };

  // Internal Lifecycle
  // ==============================

  /**
   * Opens the popup
   *
   * @param options.controlOverride  - Force the popup to open when it's open state is being controlled
   */
  open = (options?: { controlOverride?: boolean }) => {
    const { onOpen } = this.props;

    if (!options?.controlOverride && this.isOpenControlled) {
      // Prevent popup opening if it's open state is already being controlled
      return;
    }

    if (onOpen) {
      onOpen();
    }

    this.setState({ isOpen: true });

    if (this.selectRef) {
      this.selectRef.select.openMenu('first'); // HACK
    }

    if (typeof window === 'undefined') {
      return;
    }
    this.unbindWindowKeydown = bind(window, {
      type: 'keydown',
      listener: this.handleKeyDown,
      options: { capture: true },
    });
  };

  /**
   * Closes the popup
   *
   * @param options.controlOverride  - Force the popup to close when it's open state is being controlled
   */
  close = (options?: { controlOverride?: boolean }) => {
    const { onClose, onMenuClose } = this.props;

    if (!options?.controlOverride && this.isOpenControlled) {
      // Prevent popup closing if it's open state is already being controlled
      return;
    }

    if (onClose) {
      onClose();
    }

    if (onMenuClose) {
      onMenuClose();
    }

    this.setState({ isOpen: false });
    this.setState({ focusLockEnabled: false });

    if (this.targetRef != null) {
      this.targetRef.focus();
    }

    if (typeof window === 'undefined') {
      return;
    }

    this.unbindWindowKeydown?.();
    this.unbindWindowKeydown = null;
  };

  // Refs
  // ==============================

  resolveTargetRef =
    (popperRef: React.Ref<HTMLElement>) => (ref: HTMLElement) => {
      // avoid thrashing fn calls
      if (!this.targetRef && popperRef && ref) {
        this.targetRef = ref;

        if (typeof popperRef === 'function') {
          popperRef(ref);
        } else {
          (popperRef as React.MutableRefObject<HTMLElement>).current = ref;
        }
      }
    };

  resolveMenuRef =
    (popperRef: React.Ref<HTMLElement>) => (ref: HTMLElement) => {
      this.menuRef = ref;

      if (typeof popperRef === 'function') {
        popperRef(ref);
      } else {
        (popperRef as React.MutableRefObject<HTMLElement>).current = ref;
      }
    };

  getSelectRef = (ref: Select<Option, IsMulti>) => {
    this.selectRef = ref;
  };

  // Utils
  // ==============================

  // account for groups when counting options
  // this may need to be recursive, right now it just counts one level
  getItemCount = () => {
    const { options } = this.props;
    let count = 0;

    options!.forEach((groupOrOption: Option | GroupType<Option>) => {
      if ((groupOrOption as GroupType<Option>).options) {
        (groupOrOption as GroupType<Option>).options.forEach(() => count++);
      } else {
        count++;
      }
    });

    return count;
  };

  getMaxHeight = () => {
    const { maxMenuHeight } = this.props;

    if (!this.selectRef) {
      return maxMenuHeight;
    }

    // subtract the control height to maintain consistency
    const showSearchControl = this.showSearchControl();

    const { controlRef } = this.selectRef.select;

    // @ts-ignore React-select provides incomplete types for controlRef
    const offsetHeight = showSearchControl ? controlRef.offsetHeight : 0;
    const maxHeight = maxMenuHeight! - offsetHeight;

    return maxHeight;
  };

  // if the threshold is exceeded, AND isSearchable is true, then display the search control
  showSearchControl = () => {
    const { searchThreshold, isSearchable } = this.props;
    return isSearchable && this.getItemCount() > searchThreshold!;
  };

  // Renderers
  // ==============================

  renderSelect = () => {
    const { footer, maxMenuWidth, minMenuWidth, target, ...props } = this.props;
    const { focusLockEnabled, isOpen, mergedComponents, mergedPopperProps } =
      this.state;
    const showSearchControl = this.showSearchControl();
    const portalDestination = canUseDOM() ? document.body : null;
    const components = {
      ...mergedComponents,
      Control: showSearchControl ? mergedComponents.Control : DummyControl,
    };

    if (!portalDestination || !isOpen) {
      return null;
    }
    const popper = (
      <Popper
        {...mergedPopperProps}
        onFirstUpdate={(state) => {
          this.handleFirstPopperUpdate();
          mergedPopperProps.onFirstUpdate?.(state);
        }}
      >
        {({ placement, ref, style }) => {
          return (
            <NodeResolver innerRef={this.resolveMenuRef(ref)}>
              <MenuDialog
                style={style}
                data-placement={placement}
                minWidth={minMenuWidth}
                maxWidth={maxMenuWidth}
                id={this.popperWrapperId}
              >
                <FocusLock disabled={!focusLockEnabled} returnFocus>
                  <Select<Option, IsMulti>
                    backspaceRemovesValue={false}
                    controlShouldRenderValue={false}
                    isClearable={false}
                    tabSelectsValue={false}
                    menuIsOpen
                    ref={this.getSelectRef}
                    {...props}
                    isSearchable={showSearchControl}
                    styles={mergeStyles(this.defaultStyles, props.styles || {})}
                    maxMenuHeight={this.getMaxHeight()}
                    components={components as Partial<SelectComponents>}
                    onChange={this.handleSelectChange}
                  />
                  {footer}
                </FocusLock>
              </MenuDialog>
            </NodeResolver>
          );
        }}
      </Popper>
    );

    return mergedPopperProps.strategy === 'fixed'
      ? popper
      : createPortal(popper, portalDestination);
  };

  render() {
    const { target } = this.props;
    const { isOpen } = this.state;

    return (
      <Manager>
        <Reference>
          {({ ref }) =>
            target &&
            target({
              isOpen,
              ref: this.resolveTargetRef(ref),
              'aria-haspopup': 'true',
              'aria-expanded': isOpen,
              'aria-controls': isOpen ? this.popperWrapperId : undefined,
            })
          }
        </Reference>
        {this.renderSelect()}
      </Manager>
    );
  }
}
