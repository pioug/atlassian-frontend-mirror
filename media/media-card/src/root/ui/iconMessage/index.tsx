import React from 'react';
import { IconMessageWrapper } from './styled';
import { messages } from '@atlaskit/media-ui';
import { FormattedMessage } from 'react-intl';

export type InternalIconMessageProps = {
  messageDescriptor: FormattedMessage.MessageDescriptor;
  animated?: boolean;
  reducedFont?: boolean;
};

type CreatingPreviewProps = {
  disableAnimation?: boolean;
};

export const IconMessage: React.FC<InternalIconMessageProps> = ({
  messageDescriptor,
  animated = false,
  reducedFont = false,
}) => {
  return (
    <IconMessageWrapper animated={animated} reducedFont={reducedFont}>
      <FormattedMessage {...messageDescriptor} />
    </IconMessageWrapper>
  );
};

export const CreatingPreview: React.FC<CreatingPreviewProps> = ({
  disableAnimation,
}) => (
  <IconMessage
    messageDescriptor={messages.creating_preview}
    animated={!disableAnimation}
  />
);

export const PreviewUnavailable: React.FC = (props) => (
  <IconMessage {...props} messageDescriptor={messages.preview_unavailable} />
);

export const FailedToLoad: React.FC = (props) => (
  <IconMessage {...props} messageDescriptor={messages.failed_to_load} />
);

export const FailedToUpload: React.FC = (props) => (
  <IconMessage {...props} messageDescriptor={messages.failed_to_upload} />
);

export const PreviewCurrentlyUnavailable: React.FC = (props) => (
  <IconMessage
    {...props}
    messageDescriptor={messages.preview_currently_unavailable}
    reducedFont
  />
);
