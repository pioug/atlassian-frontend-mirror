import React from 'react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { InlineEditProps } from '../types';

import InlineEditUncontrolled from './InlineEditUncontrolled';

interface State {
  isEditing: boolean;
}

class InlineEdit<FieldValue = string> extends React.Component<
  InlineEditProps<FieldValue>,
  State
> {
  static defaultProps = {
    startWithEditViewOpen: false,
    onCancel: () => {},
  };

  editViewRef = React.createRef<HTMLElement>();

  state = {
    isEditing: this.props.startWithEditViewOpen || false,
  };

  componentDidMount() {
    if (this.props.startWithEditViewOpen && this.editViewRef.current) {
      this.editViewRef.current.focus();
    }
  }

  onConfirm = (value: string, analyticsEvent: UIAnalyticsEvent) => {
    this.setState({
      isEditing: false,
    });
    this.props.onConfirm(value, analyticsEvent);
  };

  onCancel = () => {
    this.setState({
      isEditing: false,
    });
    this.props.onCancel();
  };

  onEditRequested = () => {
    this.setState({ isEditing: true }, () => {
      if (this.editViewRef.current) {
        this.editViewRef.current.focus();
      }
    });
  };

  render() {
    return (
      <InlineEditUncontrolled<FieldValue>
        {...this.props}
        defaultValue={this.props.defaultValue}
        editView={fieldProps =>
          this.props.editView(fieldProps, this.editViewRef)
        }
        readView={this.props.readView}
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
        isEditing={this.state.isEditing}
        onEditRequested={this.onEditRequested}
      />
    );
  }
}

export default InlineEdit;
