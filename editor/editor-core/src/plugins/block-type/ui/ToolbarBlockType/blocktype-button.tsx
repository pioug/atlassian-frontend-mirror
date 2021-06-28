import React from 'react';
import {
  FormattedMessage,
  defineMessages,
  InjectedIntlProps,
} from 'react-intl';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import TextStyleIcon from '@atlaskit/icon/glyph/editor/text-style';

import { MessageDescriptor } from '../../../../types/i18n';
import ToolbarButton from '../../../../ui/ToolbarButton';
import {
  ButtonContent,
  Wrapper,
  ExpandIconWrapper,
} from '../../../../ui/styles';
import { NORMAL_TEXT } from '../../types';

export interface BlockTypeButtonProps {
  isSmall?: boolean;
  isReducedSpacing?: boolean;
  selected: boolean;
  disabled: boolean;
  title: MessageDescriptor;
  onClick(e: React.MouseEvent): void;
  formatMessage: InjectedIntlProps['intl']['formatMessage'];
}

export const messages = defineMessages({
  textStyles: {
    id: 'fabric.editor.textStyles',
    defaultMessage: 'Text styles',
    description:
      'Menu provides access to various heading styles or normal text',
  },
});

export const BlockTypeButton: React.StatelessComponent<BlockTypeButtonProps> = (
  props,
) => {
  const labelTextStyles = props.formatMessage(messages.textStyles);
  return (
    <ToolbarButton
      spacing={props.isReducedSpacing ? 'none' : 'default'}
      selected={props.selected}
      className="block-type-btn"
      disabled={props.disabled}
      onClick={props.onClick}
      title={labelTextStyles}
      aria-label={labelTextStyles}
      iconAfter={
        <Wrapper isSmall={props.isSmall}>
          {props.isSmall && <TextStyleIcon label={labelTextStyles} />}
          <ExpandIconWrapper>
            <ExpandIcon label="" />
          </ExpandIconWrapper>
        </Wrapper>
      }
    >
      {!props.isSmall && (
        <ButtonContent spacing={props.isReducedSpacing ? 'none' : 'default'}>
          <FormattedMessage {...(props.title || NORMAL_TEXT.title)} />
          <div style={{ overflow: 'hidden', height: 0 }}>{props.children}</div>
        </ButtonContent>
      )}
    </ToolbarButton>
  );
};
