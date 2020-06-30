import React from 'react';

import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';

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

export class Decision extends React.Component<Props & InjectedIntlProps, {}> {
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
