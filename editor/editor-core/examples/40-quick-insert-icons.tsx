import React from 'react';

import {
  IconAction,
  IconCode,
  IconDate,
  IconDecision,
  IconDivider,
  IconList,
  IconListNumber,
  IconQuote,
  IconStatus,
  IconPanel,
  IconPanelNote,
  IconPanelSuccess,
  IconPanelWarning,
  IconPanelError,
} from '@atlaskit/editor-common/quick-insert';

import { IconTable } from '@atlaskit/editor-common/icons';

const iconWrapper = {
  display: 'grid',
  'grid-template-columns': 'repeat(auto-fill, minmax(40px, 1fr))',
  'justify-items': 'center',
  'align-items': 'center',
  gap: '20px',
  'max-width': '500px',
};

/**
 * This example is used to test the presentation of icons in the editor
 * and that their colours correctly change when the theme is changed.
 */
const QuickInsertIconsExample = () => {
  const icons = [
    IconAction,
    IconCode,
    IconDate,
    IconDecision,
    IconDivider,
    IconList,
    IconListNumber,
    IconQuote,
    IconStatus,
    IconTable,
    IconPanel,
    IconPanelNote,
    IconPanelSuccess,
    IconPanelWarning,
    IconPanelError,
  ];
  return (
    <div style={iconWrapper}>
      {icons.map((Icon, index) => (
        <Icon key={index} />
      ))}
    </div>
  );
};

export default QuickInsertIconsExample;
