import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { defineMessages, injectIntl } from 'react-intl-next';

import { DecisionItem } from '@atlaskit/task-decision';

const messages = defineMessages({
  placeholder: {
    id: 'fabric.editor.decisionPlaceholder',
    defaultMessage: 'Add a decision…',
    description: 'Placeholder description for an empty decision in the editor',
  },
});

interface Props {
  contentRef: any;
  showPlaceholder?: boolean;
}

export class Decision extends React.Component<
  Props & WrappedComponentProps,
  {}
> {
  static displayName = 'Decision';

  render() {
    const {
      contentRef,
      showPlaceholder,
      intl: { formatMessage },
    } = this.props;

    const placeholder = formatMessage(messages.placeholder);

    return (
      <DecisionItem
        contentRef={contentRef}
        placeholder={placeholder}
        showPlaceholder={showPlaceholder}
      />
    );
  }
}

export default injectIntl(Decision);
