/** @jsx jsx */
import { jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import type { MessageDescriptor, WrappedComponentProps } from 'react-intl-next';

import type { Keymap } from '@atlaskit/editor-common/keymaps';
import { alignLeft } from '@atlaskit/editor-common/keymaps';
import { alignmentMessages } from '@atlaskit/editor-common/messages';

import type { AlignmentState } from '../../pm-plugins/types';
import { IconMap } from '../ToolbarAlignment/icon-map';

import AlignmentButton from './AlignmentButton';
import { alignmentWrapper } from './styles';

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

function Alignment({
  onClick,
  selectedAlignment,
  className,
  intl,
}: Props & WrappedComponentProps) {
  return (
    <div
      data-testid="alignment-buttons"
      // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
      css={alignmentWrapper}
      className={className}
    >
      {alignmentOptions.map(alignment => {
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

export default injectIntl(Alignment);
