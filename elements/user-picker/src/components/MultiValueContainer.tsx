import { components } from '@atlaskit/select';
import React from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import { messages } from './i18n';
import { isChildInput } from './utils';

export type State = {
  valueSize: number;
  previousValueSize: number;
};

type Props = {
  children: React.ReactChild;
  getValue: () => any[];
  selectProps: any;
};

export class MultiValueContainer extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    return {
      valueSize: nextProps.getValue ? nextProps.getValue().length : 0,
      previousValueSize: prevState.valueSize,
    };
  }

  private containerRef: React.RefObject<MultiValueContainer>;
  private timeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      valueSize: 0,
      previousValueSize: 0,
    };
    this.containerRef = React.createRef();
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
      const { current } = this.containerRef;
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
    React.Children.map<React.ReactChild, React.ReactChild>(
      this.props.children,
      child =>
        isChildInput(child) && this.showPlaceholder()
          ? React.cloneElement(child, { placeholder })
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
          {addMore => this.addPlaceholder(addMore as string)}
        </FormattedMessage>
      );
    }
    return this.addPlaceholder(addMoreMessage);
  };

  render() {
    const { children, ...valueContainerProps } = this.props;
    return (
      <components.ValueContainer
        // TODO: Remove any and pass correct types to component
        {...(valueContainerProps as any)}
        ref={this.containerRef}
      >
        {this.renderChildren()}
      </components.ValueContainer>
    );
  }
}
