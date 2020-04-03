const getAppearanceProps = (props: Record<string, any>) => ({
  appearance: props.appearance,
  backgroundColor: props.backgroundColor,
  borderColor: props.borderColor,
  groupAppearance: props.groupAppearance,
  isActive: props.isActive,
  isDisabled: props.isDisabled,
  isFocus: props.isFocus,
  isHover: props.isHover,
  isInteractive: props.isInteractive,
  isSelected: props.isSelected,
  size: props.size,
  stackIndex: props.stackIndex,
});

const getInteractionProps = (props: Record<string, any>) => ({
  onBlur: props.onBlur,
  onClick: props.onClick,
  onFocus: props.onFocus,
  onKeyDown: props.onKeyDown,
  onKeyUp: props.onKeyUp,
  onMouseDown: props.onMouseDown,
  onMouseEnter: props.onMouseEnter,
  onMouseLeave: props.onMouseLeave,
  onMouseUp: props.onMouseUp,
  tabIndex: props.tabIndex,
});

const getLinkElementProps = (props: Record<string, any>) => {
  const { href, target } = props;

  // handle security issue for consumer
  // https://mathiasbynens.github.io/rel-noopener
  const rel = target === '_blank' ? 'noopener noreferrer' : null;

  return { href, rel, target };
};

const getButtonElementProps = (props: Record<string, any>) => {
  const { id, isDisabled } = props;

  return { id, interface: 'button', disabled: isDisabled };
};

export default function getProps<Props extends Record<string, any>>(
  component: React.Component<Props>,
) {
  const { props } = component;

  const defaultProps = {
    ...getAppearanceProps(props),
    ...getInteractionProps(props),
  };

  if (props.component) {
    return {
      ...defaultProps,
      ...props,
    };
  }

  if (props.href) {
    if (props.isDisabled) {
      return defaultProps;
    }

    return {
      ...defaultProps,
      ...getLinkElementProps(props),
    };
  }

  if (props.onClick) {
    return {
      ...defaultProps,
      ...getButtonElementProps(props),
    };
  }

  return defaultProps;
}
