import React, { KeyboardEventHandler, PureComponent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import FocusLock from 'react-focus-lock';
import Select, {
  components as RSComponents,
  mergeStyles,
  GroupBase,
} from 'react-select';
import BaseSelect from 'react-select/base';
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
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { MenuDialog, DummyControl, defaultComponents } from './components';
import baseStyles from '../styles';
import {
  OptionType,
  ActionMeta,
  ReactSelectProps,
  StylesConfig,
  ValueType,
  ValidationState,
} from '../types';
import { bind, UnbindFn } from 'bind-event-listener';
import memoizeOne from 'memoize-one';

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
  onKeyDown: KeyboardEventHandler<HTMLElement>;
  'aria-haspopup': 'true';
  'aria-expanded': boolean;
  'aria-controls'?: string;
}

export type ModifierList =
  | 'offset'
  | 'computeStyles'
  | 'preventOverflow'
  | 'handleFlipStyle'
  | 'flip'
  | 'popperOffsets'
  | 'arrow'
  | 'hide'
  | 'eventListeners'
  | 'applyStyles';
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
    For more information, see the Popper Props section below, or [React Popper documentation](https://popper.js.org/react-popper/v2/render-props).

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
    - `onKeyDown`: Pass this keydown handler to the element to allow keyboard users to access the element.
    - `aria-haspopup`, `aria-expanded`, `aria-controls`: Spread these onto a target element to
        ensure your experience is accessible
   */
  target?: (
    options: PopupSelectTriggerProps & { isOpen: boolean },
  ) => ReactNode;
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  /** The prop indicates if the component has a compacted look */
  spacing?: string;
  /** @deprecated Use isInvalid instead. The state of validation if used in a form */
  validationState?: ValidationState;
  /** This prop indicates if the component is in an error state */
  isInvalid?: boolean;
  /** This gives an accessible name to the input for users of assistive technologies */
  label?: string;
  testId?: string;
}

interface State<Modifiers = string> {
  /**
   * TODO: This type should be cleaned up with `platform.design-system-team.popup-select-render-perf_i0s6m`.
   *  - If discarded, revert to `focusLockEnabled: boolean`
   *  - If kept, delete this type.
   */
  focusLockEnabled?: boolean;
  isOpen: boolean;
  mergedComponents: Object; // This really should be `SelectComponentsConfig<…>`, but generics aren't compatible across all Selects as structured
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
  Modifiers = ModifierList,
> extends PureComponent<PopupSelectProps<Option, IsMulti, Modifiers>, State> {
  menuRef: HTMLElement | null = null;
  selectRef: BaseSelect<Option, IsMulti> | null = null;
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

  state = getBooleanFF(
    'platform.design-system-team.popup-select-render-perf_i0s6m',
  )
    ? {
        isOpen: this.defaultOpenState ?? false,
        mergedComponents: defaultComponents,
        mergedPopperProps: defaultPopperProps as PopperPropsNoChildren<
          defaultModifiers | string
        >,
      }
    : {
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

  componentDidUpdate(prevProps: PopupSelectProps<Option, IsMulti, Modifiers>) {
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

  handleTargetKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        this.open();
        break;
      default:
    }
  };

  handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
      case 'Esc':
        this.close();
        break;
      default:
    }
    if (this.props.onKeyDown) {
      /* @ts-ignore - updating type of event React.KeyboardEvent effects the unbindWindowsKeyDown listener. Check if this can be fixed once the component gets refactor to functional */
      this.props.onKeyDown(event);
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
      this.selectRef.openMenu('first');
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
    const { onClose } = this.props;

    if (!options?.controlOverride && this.isOpenControlled) {
      // Prevent popup closing if it's open state is already being controlled
      return;
    }

    if (onClose) {
      onClose();
    }

    this.setState({ isOpen: false });
    if (
      getBooleanFF('platform.design-system-team.popup-select-render-perf_i0s6m')
    ) {
      // Do nothing… (the pff eslint just doesn't like `!getBooleanFF(…)`)
    } else {
      this.setState({ focusLockEnabled: false });
    }

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

  getSelectRef = (ref: BaseSelect<Option, IsMulti>) => {
    this.selectRef = ref;
  };

  // Utils
  // ==============================

  // Get a memoized merge of the default styles and the prop's in styles
  getSelectStyles = memoizeOne(
    (
      defaultStyles: StylesConfig<Option, IsMulti>,
      propStyles: StylesConfig<Option, IsMulti> | undefined,
    ) => {
      return mergeStyles(defaultStyles, propStyles || {});
    },
  );

  // Get a memoized override of our `<Select components={…}>` overrides.
  getSelectComponents = memoizeOne(
    (
      mergedComponents: typeof defaultComponents,
      showSearchControl: boolean | undefined,
    ) => {
      if (!showSearchControl) {
        // When we have no search control, we use a dummy override to hide it visually.
        return {
          ...mergedComponents,
          Control: DummyControl,
        } as Partial<SelectComponents>;
      }

      return mergedComponents as Partial<SelectComponents>;
    },
  );

  // account for groups when counting options
  // this may need to be recursive, right now it just counts one level
  getItemCount = () => {
    const { options } = this.props;
    let count = 0;

    options!.forEach((groupOrOption: Option | GroupBase<Option>) => {
      if ((groupOrOption as GroupBase<Option>).options) {
        (groupOrOption as GroupBase<Option>).options.forEach(() => count++);
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

    const { controlRef } = this.selectRef;
    const offsetHeight =
      showSearchControl && controlRef ? controlRef.offsetHeight : 0;
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
    const {
      footer,
      label,
      maxMenuWidth,
      minMenuWidth,
      placeholder,
      target,
      testId,
      ...props
    } = this.props;
    // TODO: If `platform.design-system-team.popup-select-render-perf_i0s6m` is kept, `focusLockEnabled` should be fully removed as we're preferring `isReferenceHidden`
    const { focusLockEnabled, isOpen, mergedComponents, mergedPopperProps } =
      this.state;
    const showSearchControl = this.showSearchControl();
    const portalDestination = canUseDOM() ? document.body : null;

    if (!portalDestination || !isOpen) {
      return null;
    }

    // Memoized merge of defaultStyles and props.styles
    const selectStyles = getBooleanFF(
      'platform.design-system-team.popup-select-render-perf_i0s6m',
    )
      ? this.getSelectStyles(this.defaultStyles, props.styles)
      : mergeStyles(this.defaultStyles, props.styles || {});

    // Memoized variance of the default select components
    const selectComponents = getBooleanFF(
      'platform.design-system-team.popup-select-render-perf_i0s6m',
    )
      ? this.getSelectComponents(mergedComponents, showSearchControl)
      : ({
          ...mergedComponents,
          Control: showSearchControl ? mergedComponents.Control : DummyControl,
        } as Partial<SelectComponents>);

    const getLabel: () => string | undefined = () => {
      if (label) {
        return label;
      } else if (typeof placeholder === 'string') {
        return placeholder;
      }
    };

    const popper = (
      <Popper
        {...mergedPopperProps}
        {
          // TODO: When cleaning up `platform.design-system-team.popup-select-render-perf_i0s6m`, if kept, the spread above covers this implicitly.
          ...(getBooleanFF(
            'platform.design-system-team.popup-select-render-perf_i0s6m',
          )
            ? undefined
            : {
                onFirstUpdate: (state) => {
                  this.handleFirstPopperUpdate();
                  mergedPopperProps.onFirstUpdate?.(state);
                },
              })
        }
      >
        {({ placement, ref, style, isReferenceHidden }) => {
          /**
           * The reference is not available yet, so the Popper and Portal is either being rendered at `0,0` (scrolled to the top)
           * or not at all.  There's no reason to render the Select or lock scrolling at the top of the page yet.
           */
          const readyToRenderSelect = getBooleanFF(
            'platform.design-system-team.popup-select-render-perf_i0s6m',
          )
            ? isReferenceHidden !== null
            : true;

          return (
            <NodeResolver innerRef={this.resolveMenuRef(ref)}>
              <MenuDialog
                style={style}
                data-placement={placement}
                minWidth={minMenuWidth}
                maxWidth={maxMenuWidth}
                id={this.popperWrapperId}
                testId={testId}
              >
                <FocusLock
                  /*
                   * NOTE: We intentionally want the FocusLock to be disabled until the refs are populated in Popper.
                   * Until then, the portal the Popper creates is at `0,0`, meaning the FocusLock forces the page to scroll to `0,0`.
                   * We do not want the user to scroll to the top of the page when they open their PopupSelect, so we disable it.
                   *
                   *  WARNING: This causes additional renders, eg. ±5ms in our example, but unless
                   * FocusLock has a better way to avoid scrolling, this is necessary.
                   */
                  disabled={
                    getBooleanFF(
                      'platform.design-system-team.popup-select-render-perf_i0s6m',
                    )
                      ? !readyToRenderSelect
                      : !focusLockEnabled
                  }
                  returnFocus
                >
                  {readyToRenderSelect && (
                    <Select<Option, IsMulti>
                      aria-label={getLabel()}
                      backspaceRemovesValue={false}
                      controlShouldRenderValue={false}
                      isClearable={false}
                      tabSelectsValue={false}
                      menuIsOpen
                      placeholder={placeholder}
                      ref={this.getSelectRef}
                      {...props}
                      isSearchable={showSearchControl}
                      styles={selectStyles}
                      maxMenuHeight={this.getMaxHeight()}
                      components={selectComponents}
                      onChange={this.handleSelectChange}
                    />
                  )}
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
              onKeyDown: this.handleTargetKeyDown,
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
