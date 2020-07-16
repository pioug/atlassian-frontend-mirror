import React from 'react';
import { PureComponent } from 'react';
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import { N0 } from '@atlaskit/theme/colors';
import { Button, ButtonWrapper } from './styles';
import Tooltip from '@atlaskit/tooltip';

// IMO these should live inside @atlaskit/theme
const messages = defineMessages({
  selected: {
    id: 'fabric.editor.selected',
    defaultMessage: 'Selected',
    description: 'If the item is selected or not.',
  },
});

export interface Props {
  value: string;
  label: string;
  tabIndex?: number;
  isSelected?: boolean;
  onClick: (value: string) => void;
  borderColor: string;
  checkMarkColor?: string;
}

class Color extends PureComponent<Props & InjectedIntlProps> {
  render() {
    const {
      tabIndex,
      value,
      label,
      isSelected,
      borderColor,
      checkMarkColor = N0,
      intl: { formatMessage },
    } = this.props;

    return (
      <Tooltip content={label}>
        <ButtonWrapper>
          <Button
            onClick={this.onClick}
            onMouseDown={this.onMouseDown}
            tabIndex={tabIndex}
            className={`${isSelected ? 'selected' : ''}`}
            style={{
              backgroundColor: value || 'transparent',
              border: `1px solid ${borderColor}`,
            }}
          >
            {isSelected && (
              <EditorDoneIcon
                primaryColor={checkMarkColor}
                label={formatMessage(messages.selected)}
              />
            )}
          </Button>
        </ButtonWrapper>
      </Tooltip>
    );
  }

  onMouseDown = (e: React.MouseEvent<{}>) => {
    e.preventDefault();
  };

  onClick = (e: React.MouseEvent<{}>) => {
    const { onClick, value } = this.props;
    e.preventDefault();
    onClick(value);
  };
}

export default injectIntl(Color);
