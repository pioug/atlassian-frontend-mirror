import React from 'react';

import { IconTable } from '@atlaskit/editor-common/icons';
import {
  IconAction,
  IconCode,
  IconCustomPanel,
  IconDate,
  IconDecision,
  IconDivider,
  IconEmoji,
  IconExpand,
  IconFallback,
  IconHeading,
  IconImages,
  IconLayout,
  IconLink,
  IconList,
  IconListNumber,
  IconLoom,
  IconMention,
  IconPanel,
  IconPanelError,
  IconPanelNote,
  IconPanelSuccess,
  IconPanelWarning,
  IconQuote,
  IconStatus,
} from '@atlaskit/editor-common/quick-insert';

const iconWrapper = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
  justifyItems: 'center',
  alignItems: 'center',
  gap: '20px',
  maxWidth: '500px',
};

/**
 * This example is used to test the presentation of icons in the editor
 * and that their colours correctly change when the theme is changed.
 */
const QuickInsertIconsExample = () => {
  const icons = [
    IconAction,
    IconCode,
    IconCustomPanel,
    IconDate,
    IconDecision,
    IconDivider,
    IconEmoji,
    IconExpand,
    IconFallback,
    IconLayout,
    IconList,
    IconLink,
    IconListNumber,
    IconQuote,
    IconStatus,
    IconTable,
    IconPanel,
    IconPanelNote,
    IconPanelSuccess,
    IconPanelWarning,
    IconPanelError,
    IconMention,
    IconImages,
    IconLoom,
  ];
  return (
    <div style={iconWrapper}>
      {icons.map((Icon, index) => (
        <Icon key={index} />
      ))}
      <IconHeading level={1} />
      <IconHeading level={2} />
      <IconHeading level={3} />
      <IconHeading level={4} />
      <IconHeading level={5} />
      <IconHeading level={6} />
    </div>
  );
};

export default QuickInsertIconsExample;
