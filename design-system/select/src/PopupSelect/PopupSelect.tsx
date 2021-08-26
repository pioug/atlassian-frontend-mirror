import React, { PureComponent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Select, { components as RSComponents, mergeStyles } from 'react-select';
import { uid } from 'react-uid';
import createFocusTrap, { FocusTrap } from 'focus-trap';
import { Manager, Reference, Popper, PopperProps } from 'react-popper';
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
} from '../types';

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

export interface PopupSelectProps<
  Option = OptionType,
  IsMulti extends boolean = false,
  Modifiers = {}
> extends ReactSelectProps<Option, IsMulti> {
  closeMenuOnSelect?: boolean;
  footer?: ReactNode;
  popperProps?: PopperPropsNoChildren<Modifiers>;
  searchThreshold?: number;
  target?: (
    options: PopupSelectTriggerProps & { isOpen: boolean },
  ) => ReactNode;
}

interface State<Modifiers = {}> {
  isOpen: boolean;
  mergedComponents: Object;
  mergedPopperProps: PopperPropsNoChildren<defaultModifiers | Modifiers>;
}

// ==============================
// Class
// ==============================

const defaultPopperProps: PopperPropsNoChildren<
  'offset' | 'preventOverflow'
> = {
  modifiers: [
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
  ],
  placement: 'bottom-start' as Placement,
};

const isEmpty = (obj: Object) => Object.keys(obj).length === 0;

export default class PopupSelect<
  Option = OptionType,
  IsMulti extends boolean = false
> extends PureComponent<PopupSelectProps<Option, IsMulti>, State> {
  focusTrap: FocusTrap | null = null;
  menuRef: HTMLElement | null = null;
  selectRef: Select<Option, IsMulti> | null = null;
  targetRef: HTMLElement | null = null;

  defaultStyles: StylesConfig<Option, IsMulti> = mergeStyles(
    baseStyles(this.props.validationState, this.props.spacing === 'compact'),
    {
      groupHeading: (provided) => ({
        ...provided,
        color: token('color.text.lowEmphasis', N80),
      }),
    },
  );

  state = {
    isOpen: false,
    mergedComponents: defaultComponents,
    mergedPopperProps: defaultPopperProps,
  };

  popperWrapperId = `${uid({ options: this.props.options })}-popup-select`;

  static defaultProps = {
    closeMenuOnSelect: true,
    components: {},
    maxMenuHeight: 300,
    maxMenuWidth: 440,
    minMenuWidth: 220,
    popperProps: {},
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
    window.addEventListener('click', this.handleClick, true);
  }

  componentWillUnmount() {
    if (typeof window === 'undefined') {
      return;
    }
    window.removeEventListener('click', this.handleClick, true);
    window.removeEventListener('keydown', this.handleKeyDown, true);
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

  // Internal Lifecycle
  // ==============================

  open = () => {
    const { onOpen } = this.props;
    if (onOpen) {
      onOpen();
    }

    this.setState({ isOpen: true }, this.initialiseFocusTrap);

    if (this.selectRef) {
      this.selectRef.select.openMenu('first'); // HACK
    }

    if (typeof window === 'undefined') {
      return;
    }
    window.addEventListener('keydown', this.handleKeyDown, true);
  };

  initialiseFocusTrap = () => {
    if (!this.menuRef) {
      return;
    }

    const trapConfig = {
      clickOutsideDeactivates: true,
      escapeDeactivates: true,
      fallbackFocus: this.menuRef,
      returnFocusOnDeactivate: true,
    };

    this.focusTrap = createFocusTrap(this.menuRef, trapConfig);

    // allow time for the HTMLElement to render
    setTimeout(() => this.focusTrap!.activate(), 1);
  };

  close = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }

    this.setState({ isOpen: false });

    if (this.focusTrap) {
      this.focusTrap.deactivate();
    }

    if (typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('keydown', this.handleKeyDown, true);
  };

  // Refs
  // ==============================

  resolveTargetRef = (popperRef: React.Ref<HTMLElement>) => (
    ref: HTMLElement,
  ) => {
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

  resolveMenuRef = (popperRef: React.Ref<HTMLElement>) => (
    ref: HTMLElement,
  ) => {
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

  // if the threshold is exceeded display the search control
  showSearchControl = () => {
    const { searchThreshold } = this.props;
    return this.getItemCount() > searchThreshold!;
  };

  // Renderers
  // ==============================

  renderSelect = () => {
    const { footer, maxMenuWidth, minMenuWidth, target, ...props } = this.props;
    const { isOpen, mergedComponents, mergedPopperProps } = this.state;
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
      <Popper {...mergedPopperProps}>
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
                <Select<Option, IsMulti>
                  backspaceRemovesValue={false}
                  controlShouldRenderValue={false}
                  isClearable={false}
                  tabSelectsValue={false}
                  menuIsOpen
                  ref={this.getSelectRef}
                  {...props}
                  isSearchable={showSearchControl}
                  styles={{ ...this.defaultStyles, ...props.styles }}
                  maxMenuHeight={this.getMaxHeight()}
                  components={components as Partial<SelectComponents>}
                  onChange={this.handleSelectChange}
                />
                {footer}
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
