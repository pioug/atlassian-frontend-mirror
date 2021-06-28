import React from 'react';
import { PureComponent } from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { MessageDescriptor } from '../../types/i18n';
import { AlignmentState } from '../../plugins/alignment/pm-plugins/types';
import { iconMap } from '../../plugins/alignment/ui/ToolbarAlignment/icon-map';
import AlignmentButton from './AlignmentButton';
import { alignmentMessages } from './messages';
import { AlignmentWrapper } from './styles';

export interface Props {
  selectedAlignment?: string;
  onClick: (value: AlignmentState) => void;
  className?: string;
}

const alignmentOptions: Array<{
  title: MessageDescriptor;
  value: AlignmentState;
}> = [
  { title: alignmentMessages.alignLeft, value: 'start' },
  { title: alignmentMessages.alignCenter, value: 'center' },
  { title: alignmentMessages.alignRight, value: 'end' },
];

class Alignment extends PureComponent<Props & InjectedIntlProps> {
  render() {
    const { onClick, selectedAlignment, className, intl } = this.props;

    return (
      <AlignmentWrapper className={className} style={{ maxWidth: 3 * 32 }}>
        {alignmentOptions.map((alignment) => {
          const { value, title } = alignment;
          const message = intl.formatMessage(title);
          return (
            <AlignmentButton
              content={iconMap[value]}
              key={value}
              value={value}
              label={message}
              onClick={onClick}
              isSelected={value === selectedAlignment}
            />
          );
        })}
      </AlignmentWrapper>
    );
  }
}

export default injectIntl(Alignment);
