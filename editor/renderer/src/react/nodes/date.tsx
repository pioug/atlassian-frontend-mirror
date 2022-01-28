import React from 'react';
import { PureComponent } from 'react';
import { DateSharedCssClassName } from '@atlaskit/editor-common/styles';
import {
  isPastDate,
  timestampToString,
  timestampToTaskContext,
} from '@atlaskit/editor-common/utils';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';

export interface Props {
  timestamp: string;
  parentIsIncompleteTask?: boolean;
}

class Date extends PureComponent<Props & WrappedComponentProps, {}> {
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
