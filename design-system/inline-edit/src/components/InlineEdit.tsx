import React, { useCallback, useEffect, useState } from 'react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { InlineEditProps } from '../types';

import InlineEditUncontrolled from './internal/InlineEditUncontrolled';

const noop = () => {};

const InlineEdit = <FieldValue extends any = string>(
  props: InlineEditProps<FieldValue>,
) => {
  const {
    startWithEditViewOpen = false,
    onConfirm: providedOnConfirm,
    onCancel: providedOnCancel = noop,
    defaultValue,
    editView,
    readView,
  } = props;

  const editViewRef = React.createRef<HTMLElement>();
  const [isEditing, setEditing] = useState(startWithEditViewOpen);

  useEffect(() => {
    if (startWithEditViewOpen && editViewRef.current) {
      editViewRef.current.focus();
    }
  }, [startWithEditViewOpen, editViewRef]);

  const onConfirm = useCallback(
    (value: string, analyticsEvent: UIAnalyticsEvent) => {
      setEditing(false);
      providedOnConfirm(value, analyticsEvent);
    },
    [providedOnConfirm],
  );

  const onCancel = useCallback(() => {
    setEditing(false);
    providedOnCancel();
  }, [providedOnCancel]);

  const onEditRequested = useCallback(() => {
    setEditing(true);
    if (isEditing && editViewRef.current) {
      editViewRef.current.focus();
    }
  }, [isEditing, editViewRef]);

  return (
    <InlineEditUncontrolled<FieldValue>
      {...props}
      defaultValue={defaultValue}
      editView={fieldProps => editView(fieldProps, editViewRef)}
      readView={readView}
      onConfirm={onConfirm}
      onCancel={onCancel}
      isEditing={isEditing}
      onEditRequested={onEditRequested}
    />
  );
};

export default InlineEdit;
