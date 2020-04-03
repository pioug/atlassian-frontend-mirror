import React from 'react';
import { PureComponent } from 'react';
import {
  isPastDate,
  timestampToString,
  timestampToTaskContext,
  DateSharedCssClassName,
} from '@atlaskit/editor-common';
import { injectIntl, InjectedIntlProps } from 'react-intl';

export interface Props {
  timestamp: string;
  parentIsIncompleteTask?: boolean;
}

class Date extends PureComponent<Props & InjectedIntlProps, {}> {
  render() {
    const { timestamp, parentIsIncompleteTask, intl } = this.props;
    const className =
      !!parentIsIncompleteTask && isPastDate(timestamp)
        ? 'date-node date-node-highlighted'
        : 'date-node';
    return (
      <span className={DateSharedCssClassName.DATE_WRAPPER}>
        <span
          className={className}
          data-node-type="date"
          data-timestamp={timestamp}
        >
          {parentIsIncompleteTask
            ? timestampToTaskContext(timestamp, intl)
            : timestampToString(timestamp, intl)}
        </span>
      </span>
    );
  }
}

export default injectIntl(Date);
