/** @jsx jsx */
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import type { MessageDescriptor } from '../../types/i18n';
import type { AlignmentState } from '../../plugins/alignment/pm-plugins/types';
import { IconMap } from '../../plugins/alignment/ui/ToolbarAlignment/icon-map';
import AlignmentButton from './AlignmentButton';
import { alignmentMessages } from '@atlaskit/editor-common/messages';
import { alignmentWrapper } from './styles';
import type { Keymap } from '../../keymaps';
import { alignLeft } from '../../keymaps';

export interface Props {
  selectedAlignment?: string;
  onClick: (value: AlignmentState) => void;
  className?: string;
}

const alignmentOptions: Array<{
  title: MessageDescriptor;
  shortcut?: Keymap;
  value: AlignmentState;
}> = [
  { title: alignmentMessages.alignLeft, shortcut: alignLeft, value: 'start' },
  {
    title: alignmentMessages.alignCenter,
    value: 'center',
  },
  { title: alignmentMessages.alignRight, value: 'end' },
];

class Alignment extends PureComponent<Props & WrappedComponentProps> {
  render() {
    const { onClick, selectedAlignment, className, intl } = this.props;

    return (
      <div css={alignmentWrapper} className={className}>
        {alignmentOptions.map((alignment) => {
          const { value, title, shortcut } = alignment;
          const message = intl.formatMessage(title);
          return (
            <AlignmentButton
              content={<IconMap alignment={value} />}
              key={value}
              value={value}
              label={message}
              shortcut={shortcut}
              onClick={onClick}
              isSelected={value === selectedAlignment}
            />
          );
        })}
      </div>
    );
  }
}

export default injectIntl(Alignment);
