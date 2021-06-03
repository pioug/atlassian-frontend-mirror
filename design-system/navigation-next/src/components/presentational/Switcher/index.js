import React, { cloneElement, PureComponent } from 'react';

import NodeResolver from 'react-node-resolver';
import shallowEqualObjects from 'shallow-equal/objects';

import AddIcon from '@atlaskit/icon/glyph/add';
import { components, mergeStyles, PopupSelect } from '@atlaskit/select';
import { B300, B50, N200, N30, N40A } from '@atlaskit/theme/colors';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import { CONTENT_NAV_WIDTH } from '../../../common/constants';
import { UIControllerSubscriber } from '../../../ui-controller';

import Option from './Option';

const gridSize = gridSizeFn();

const defaultStyles = {
  option: (provided, { isActive, isFocused }) => {
    return {
      ...provided,
      alignItems: 'center',
      border: 'none',
      backgroundColor: isFocused ? N30 : 'transparent',
      boxSizing: 'border-box',
      color: 'inherit',
      cursor: 'default',
      display: 'flex',
      flexShrink: 0,
      fontSize: 'inherit',
      height: gridSize * 6,
      outline: 'none',
      paddingRight: gridSize,
      paddingLeft: gridSize,
      textAlign: 'left',
      textDecoration: 'none',
      width: '100%',
      ...(isActive && { backgroundColor: B50 }),
    };
  },
};

// ==============================
// Custom Functions
// ==============================

export const createStyles = (styles = {}) => mergeStyles(defaultStyles, styles);

export const filterOption = ({ data }, input) =>
  data.text.toLowerCase().includes(input.toLowerCase());

export const isOptionSelected = (option, selected) => {
  if (!selected || !selected.length) return false;
  return option.id === selected[0].id;
};

export const getOptionValue = (option) => option.id;

// ==============================
// Custom Components
// ==============================

export const Control = ({
  innerProps: { innerRef, ...innerProps },
  ...props
}) => (
  <div
    ref={innerRef}
    css={{
      boxShadow: `0 2px 0 ${N40A}`,
      padding: gridSize,
      position: 'relative',
    }}
  >
    <components.Control {...props} innerProps={innerProps} />
  </div>
);
export const Footer = ({ text, onClick }) => (
  <button
    css={{
      background: 0,
      border: 0,
      boxShadow: `0 -2px 0 ${N40A}`,
      boxSizing: 'border-box',
      color: N200,
      cursor: 'pointer',
      alignItems: 'center',
      display: 'flex',
      fontSize: 'inherit',
      padding: `${gridSize * 1.5}px ${gridSize}px`,
      position: 'relative',
      textAlign: 'left',
      width: '100%',

      ':hover, :focus': {
        color: B300,
        outline: 0,
        textDecoration: 'underline',
      },
    }}
    onClick={onClick}
  >
    <AddIcon label="Add icon" size="small" />
    <span css={{ marginLeft: gridSize }}>{text}</span>
  </button>
);

const defaultComponents = { Control, Option };
const isEmpty = (obj) => Object.keys(obj).length === 0;

// ==============================
// Class
// ==============================

class Switcher extends PureComponent {
  state = {
    mergedComponents: defaultComponents,
  };

  selectRef = React.createRef();

  targetRef;

  targetWidth = 0;

  static defaultProps = {
    closeMenuOnCreate: true,
    components: {},
    navWidth: CONTENT_NAV_WIDTH,
    isNavResizing: false,
  };

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    // Merge consumer and default components
    const mergedComponents = { ...defaultComponents, ...props.components };
    if (!shallowEqualObjects(mergedComponents, state.mergedComponents)) {
      newState.mergedComponents = mergedComponents;
    }

    if (!isEmpty(newState)) return newState;

    return null;
  }

  componentDidUpdate({ isNavResizing }) {
    if (
      isNavResizing &&
      this.selectRef.current &&
      this.selectRef.current.state.isOpen
    ) {
      this.selectRef.current.close();
    }
  }

  resolveTargetRef = (popupRef) => (ref) => {
    // avoid thrashing fn calls
    if (!this.targetRef && popupRef && ref) {
      this.targetRef = ref;
      popupRef(ref);
    }
  };

  getFooter = () => {
    const { closeMenuOnCreate, create, footer } = this.props;

    if (footer) return footer;
    if (!create) return null;

    let { onClick } = create;
    if (closeMenuOnCreate) {
      onClick = (e) => {
        if (this.selectRef.current) {
          this.selectRef.current.close();
        }
        create.onClick(e);
      };
    }

    return <Footer text={create.text} onClick={onClick} />;
  };

  render() {
    const { create, options, target, ...props } = this.props;
    const { mergedComponents } = this.state;
    const targetWidth = this.props.navWidth - gridSize * 2;

    return (
      <PopupSelect
        ref={this.selectRef}
        filterOption={filterOption}
        isOptionSelected={isOptionSelected}
        footer={this.getFooter()}
        getOptionValue={getOptionValue}
        options={options}
        maxMenuWidth={targetWidth}
        minMenuWidth={targetWidth}
        target={({ ref, isOpen }) => (
          <NodeResolver innerRef={this.resolveTargetRef(ref)}>
            {cloneElement(target, { isSelected: isOpen })}
          </NodeResolver>
        )}
        {...props}
        styles={createStyles(this.props.styles)}
        components={mergedComponents}
      />
    );
  }
}

export { Switcher as BaseSwitcher };

export default (props) => (
  <UIControllerSubscriber>
    {({ state }) => (
      <Switcher
        navWidth={state.productNavWidth}
        isNavResizing={state.isResizing}
        {...props}
      />
    )}
  </UIControllerSubscriber>
);
