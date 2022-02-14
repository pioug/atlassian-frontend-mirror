import EditorAlignLeftIcon from '@atlaskit/icon/glyph/editor/align-left';
import EditorAlignRightIcon from '@atlaskit/icon/glyph/editor/align-right';
import EditorAlignCenterIcon from '@atlaskit/icon/glyph/editor/align-center';
import { MessageDescriptor, useIntl } from 'react-intl-next';
import { messages } from './messages';
import React from 'react';

const iconAndMessageMap: {
  [key: string]: {
    Component: React.ComponentType<any>;
    label: MessageDescriptor;
  };
} = {
  start: { Component: EditorAlignLeftIcon, label: messages.alignLeft },
  end: { Component: EditorAlignRightIcon, label: messages.alignRight },
  center: { Component: EditorAlignCenterIcon, label: messages.alignCenter },
};

type Props = {
  alignment: string;
};

export const IconMap = (props: Props) => {
  const { Component, label } = iconAndMessageMap[props.alignment];
  const intl = useIntl();

  return <Component label={intl.formatMessage(label)} />;
};
