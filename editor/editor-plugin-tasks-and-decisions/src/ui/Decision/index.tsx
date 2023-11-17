import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { defineMessages, injectIntl } from 'react-intl-next';

import type { ContentRef } from '@atlaskit/task-decision';
import { DecisionItem } from '@atlaskit/task-decision';

const messages = defineMessages({
  placeholder: {
    id: 'fabric.editor.decisionPlaceholder',
    defaultMessage: 'Add a decision…',
    description: 'Placeholder description for an empty decision in the editor',
  },
});

interface Props {
  contentRef: ContentRef;
  showPlaceholder?: boolean;
}

export const Decision = ({
  contentRef,
  showPlaceholder,
  intl: { formatMessage },
}: Props & WrappedComponentProps) => {
  const placeholder = formatMessage(messages.placeholder);

  return (
    <DecisionItem
      contentRef={contentRef}
      placeholder={placeholder}
      showPlaceholder={showPlaceholder}
    />
  );
};

Decision.displayName = 'Decision';

export default injectIntl(Decision);
