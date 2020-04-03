import React, { useCallback } from 'react';
import Button from '@atlaskit/button';
import {
  akEditorSwoopCubicBezier,
  expandMessages,
  ExpandLayoutWrapper,
} from '@atlaskit/editor-common';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import { colors } from '@atlaskit/theme';
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

const withTooltip = (WrapperComponent: React.ElementType) => {
  return class WithSortableColumn extends React.Component<
    ExpandIconButtonWithLabelProps
  > {
    constructor(props: ExpandIconButtonWithLabelProps) {
      super(props);
    }

    render() {
      const { label } = this.props;

      return (
        <Tooltip content={label} position="top" tag={ExpandLayoutWrapper}>
          <WrapperComponent {...this.props} />
        </Tooltip>
      );
    }
  };
};

const CustomButton = (props: ExpandIconButtonWithLabelProps) => {
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
      iconBefore={<ChevronRightIcon label={label} primaryColor={colors.N80A} />}
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

  if (props.allowInteractiveExpand) {
    return <ButtonWithTooltip label={label} {...props} />;
  }

  return (
    <ExpandLayoutWrapper>
      <ButtonWithoutTooltip label={label} {...props} />
    </ExpandLayoutWrapper>
  );
};
