import { components, ValueContainerProps } from '@atlaskit/select';
import React from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { messages } from './i18n';
import { isChildInput } from './utils';
import { User, Option } from '../types';

export type State = {
  valueSize: number;
  previousValueSize: number;
};

type Props = ValueContainerProps<Option<User>[], true> & {
  innerProps?: ValueContainerInnerProps;
};

type ValueContainerInnerProps = {
  ref: React.RefObject<HTMLDivElement>;
};

export class MultiValueContainer extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    return {
      valueSize: nextProps.getValue ? nextProps.getValue().length : 0,
      previousValueSize: prevState.valueSize,
    };
  }

  private valueContainerInnerProps: ValueContainerInnerProps;
  private timeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      valueSize: 0,
      previousValueSize: 0,
    };
    this.valueContainerInnerProps = { ref: React.createRef() };
  }

  componentDidUpdate() {
    const { previousValueSize, valueSize } = this.state;
    const { isFocused } = this.props.selectProps;
    if (valueSize > previousValueSize && isFocused) {
      if (this.timeoutId) {
        window.clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }

      this.scrollToBottom();
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
  }

  scrollToBottom = () => {
    this.timeoutId = window.setTimeout(() => {
      const {
        ref: { current },
      } = this.valueContainerInnerProps;
      if (current !== null) {
        const container = ReactDOM.findDOMNode(current);
        if (container instanceof HTMLDivElement) {
          container.scrollTop = container.scrollHeight;
        }
      }
      this.timeoutId = null;
    });
  };

  private showPlaceholder = () => {
    const {
      selectProps: { value },
    } = this.props;
    return value && value.length > 0;
  };

  private addPlaceholder = (placeholder: string) =>
    React.Children.map(this.props.children, (child) =>
      isChildInput(child as React.ReactChild) && this.showPlaceholder()
        ? React.cloneElement(child as React.ReactElement, { placeholder })
        : child,
    );

  private renderChildren = () => {
    const {
      selectProps: { addMoreMessage, isDisabled },
    } = this.props;
    // Do not render "Add more..." message if picker is disabled
    if (isDisabled) {
      return this.props.children;
    }
    if (addMoreMessage === undefined) {
      return (
        <FormattedMessage {...messages.addMore}>
          {(addMore) => this.addPlaceholder(addMore as string)}
        </FormattedMessage>
      );
    }
    return this.addPlaceholder(addMoreMessage);
  };

  render() {
    const { children, innerProps, ...valueContainerProps } = this.props;
    const props = {
      ...valueContainerProps,
      innerProps: this.valueContainerInnerProps,
    };
    return (
      <components.ValueContainer {...props}>
        {this.renderChildren()}
      </components.ValueContainer>
    );
  }
}
