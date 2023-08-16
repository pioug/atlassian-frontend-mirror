import React from 'react';

import {
  IconAction,
  IconCode,
  IconDecision,
  IconDivider,
  IconList,
  IconListNumber,
  IconQuote,
  IconStatus,
} from '@atlaskit/editor-common/quick-insert';

import { IconTable } from '@atlaskit/editor-common/icons';

const iconWrapper = {
  display: 'flex',
  'flex-wrap': 'wrap',
  'justify-content': 'space-between',
  gap: '20px',
  width: '500px',
  padding: '20px',
};

/**
 * This example is used to test the presentation of icons in the editor
 * and that their colours correctly change when the theme is changed.
 */
const QuickInsertIconsExample = () => {
  const icons = [
    IconAction,
    IconCode,
    IconDecision,
    IconDivider,
    IconList,
    IconListNumber,
    IconQuote,
    IconStatus,
    IconTable,
  ];
  return (
    <div style={iconWrapper}>
      {icons.map((Icon, index) => (
        <div key={index}>
          <Icon />
        </div>
      ))}
    </div>
  );
};

export default QuickInsertIconsExample;
