import React from 'react';

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
  IconLayout,
  IconList,
  IconLink,
  IconListNumber,
  IconQuote,
  IconStatus,
  IconPanel,
  IconPanelNote,
  IconPanelSuccess,
  IconPanelWarning,
  IconPanelError,
  IconMention,
  IconImages,
} from '@atlaskit/editor-common/quick-insert';

import { IconTable } from '@atlaskit/editor-common/icons';

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
