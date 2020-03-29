/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import Base, { Label } from '@atlaskit/field-base';
import { name as packageName, version as packageVersion } from './version.json';
import Radio from './Radio';

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line no-console
  console.warn(
    '@atlaskit/field-radio-group has been deprecated. Please use the @atlaskit/radio package instead.',
  );
}

class FieldRadioGroupStateless extends Component {
  static defaultProps = {
    isRequired: false,
    items: [],
    label: '',
  };

  renderItems = () => {
    if (this.props.items) {
      return this.props.items.map((item, index) => (
        <Radio
          key={index}
          isDisabled={item.isDisabled}
          isRequired={this.props.isRequired}
          isSelected={item.isSelected}
          name={item.name}
          onChange={this.props.onRadioChange}
          value={item.value}
        >
          {item.label}
        </Radio>
      ));
    }
    return null;
  };

  render() {
    return (
      <div>
        <Label
          // FIXME: Once label is properly typed as required we can remove this
          label={this.props.label || ''}
          isRequired={this.props.isRequired}
        />
        <Base appearance="none" isRequired={this.props.isRequired}>
          <div aria-label={this.props.label} role="group">
            {this.renderItems()}
          </div>
        </Base>
      </div>
    );
  }
}

export { FieldRadioGroupStateless as AkFieldRadioGroupWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'fieldRadioGroup',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onRadioChange: createAndFireEventOnAtlaskit({
      action: 'selected',
      actionSubject: 'radioItem',

      attributes: {
        componentName: 'fieldRadioGroup',
        packageName,
        packageVersion,
      },
    }),
  })(FieldRadioGroupStateless),
);
