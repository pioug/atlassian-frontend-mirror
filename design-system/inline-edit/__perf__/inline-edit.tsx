import React, { useState } from 'react';

import { fireEvent } from '@testing-library/dom';
import {
  InteractionTaskArgs,
  PublicInteractionTask,
} from 'storybook-addon-performance';

import { FieldProps } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

import InlineEdit from '../src';

const InlineEditExample = () => {
  const [editValue, setEditValue] = useState('Field value');
  const renderEditView = (fieldProps: FieldProps<any>) => (
    <Textfield {...fieldProps} autoFocus />
  );
  const renderReadView = () => (
    <div data-testid="read-view">{editValue || 'Click to enter value'}</div>
  );

  return (
    <InlineEdit
      defaultValue={editValue}
      label="Inline edit"
      editView={renderEditView}
      readView={renderReadView}
      onConfirm={setEditValue}
      validate={() => {}}
    />
  );
};

const interactionTasks: PublicInteractionTask[] = [
  {
    name: 'Change inline edit status',
    description: 'Activate on input',
    run: async ({ container }: InteractionTaskArgs): Promise<void> => {
      const readView = container.querySelector('[data-testid="read-view"]');
      fireEvent.click(readView!);
    },
  },
];

InlineEditExample.story = {
  name: 'InlineEdit Component',
  parameters: {
    performance: {
      interactions: interactionTasks,
    },
  },
};

export default InlineEditExample;
