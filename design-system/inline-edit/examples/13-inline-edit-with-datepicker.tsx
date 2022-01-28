import React, { useState } from 'react';

import { DateTimePicker } from '@atlaskit/datetime-picker';

import InlineEdit from '../src';

const ReadView = ({ data }: { data: string }) => (
  <div style={{ padding: 10 }} data-testid="readview">
    {data || 'Select date'}
  </div>
);

export default function InlineEditWithDatepicker() {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState('');

  const EditView = () => (
    <DateTimePicker
      value={data}
      onChange={(e: string) => {
        setData(e);
        setIsEditing(false);
      }}
      testId="datepicker"
    />
  );

  return (
    <InlineEdit
      defaultValue={() => <ReadView data={data} />}
      readView={() => <ReadView data={data} />}
      editView={EditView}
      onConfirm={() => setIsEditing(false)}
      onEdit={() => setIsEditing(true)}
      isEditing={isEditing}
      hideActionButtons
      readViewFitContainerWidth
    />
  );
}
