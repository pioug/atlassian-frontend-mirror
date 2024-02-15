import React from 'react';

import type { MessageDescriptor } from 'react-intl-next';
import { useIntl } from 'react-intl-next';

import { alignmentMessages as messages } from '@atlaskit/editor-common/messages';
import EditorAlignCenterIcon from '@atlaskit/icon/glyph/editor/align-center';
import EditorAlignLeftIcon from '@atlaskit/icon/glyph/editor/align-left';
import EditorAlignRightIcon from '@atlaskit/icon/glyph/editor/align-right';
import type { GlyphProps } from '@atlaskit/icon/types';

const iconAndMessageMap: {
  [key: string]: {
    Component: React.ComponentType<GlyphProps>;
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
