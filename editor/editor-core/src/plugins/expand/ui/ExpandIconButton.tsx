import React, { useCallback, forwardRef } from 'react';
import Button from '@atlaskit/button/custom-theme-button';
import { expandMessages, ExpandLayoutWrapper } from '@atlaskit/editor-common';
import { akEditorSwoopCubicBezier } from '@atlaskit/editor-shared-styles';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Tooltip from '@atlaskit/tooltip';
import { InjectedIntl } from 'react-intl';
import { expandClassNames } from './class-names';

interface ExpandIconButtonProps {
  allowInteractiveExpand: boolean;
  expanded: boolean;
  intl?: InjectedIntl;
}

interface ExpandIconButtonWithLabelProps extends ExpandIconButtonProps {
  label: string;
}

const ExpandLayoutWrapperWithRef = forwardRef<
  HTMLElement,
  React.ComponentProps<typeof ExpandLayoutWrapper>
>(function WithRef(props, ref) {
  // @ts-ignore: incorrect innerRef typing
  return <ExpandLayoutWrapper {...props} innerRef={ref} />;
});

export const withTooltip = (WrapperComponent: React.ElementType) => {
  return class WithSortableColumn extends React.Component<
    ExpandIconButtonWithLabelProps
  > {
    constructor(props: ExpandIconButtonWithLabelProps) {
      super(props);
    }

    render() {
      const { label } = this.props;

      return (
        <Tooltip
          content={label}
          position="top"
          tag={ExpandLayoutWrapperWithRef}
        >
          <WrapperComponent {...this.props} />
        </Tooltip>
      );
    }
  };
};

export const CustomButton = (props: ExpandIconButtonWithLabelProps) => {
  const { label, allowInteractiveExpand } = props;
  const useTheme = useCallback(
    (currentTheme: any, themeProps: any) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          height: '100%',
          '& svg': {
            transform: props.expanded
              ? 'transform: rotate(90deg);'
              : 'tranform: rotate(0deg);',
            transition: `transform 0.2s ${akEditorSwoopCubicBezier};`,
          },
        },
        ...rest,
      };
    },
    [props],
  );

  return (
    <Button
      appearance="subtle"
      className={expandClassNames.iconContainer}
      iconBefore={<ChevronRightIcon label={label} />}
      shouldFitContainer
      theme={useTheme}
      isDisabled={!allowInteractiveExpand}
    ></Button>
  );
};

const ButtonWithTooltip = withTooltip(CustomButton);
const ButtonWithoutTooltip = CustomButton;

export const ExpandIconButton = (props: ExpandIconButtonProps) => {
  const { expanded, intl } = props;
  const message = expanded
    ? expandMessages.collapseNode
    : expandMessages.expandNode;
  const label = (intl && intl.formatMessage(message)) || message.defaultMessage;
  // check to ensure device supports any-hover
  const supportsAnyHover: boolean = !!window.matchMedia
    ? window.matchMedia('(any-hover: hover)').matches !==
      window.matchMedia('(any-hover: none)').matches
    : false;
  const hoverEventCheck: boolean = supportsAnyHover
    ? window.matchMedia('(any-hover: hover)').matches
    : true;

  // hoverEventCheck is to disable tooltips for mobile to prevent incorrect hover state causing issues on iOS
  if (props.allowInteractiveExpand && hoverEventCheck) {
    return <ButtonWithTooltip label={label} {...props} />;
  }

  return (
    <ExpandLayoutWrapper>
      <ButtonWithoutTooltip label={label} {...props} />
    </ExpandLayoutWrapper>
  );
};
