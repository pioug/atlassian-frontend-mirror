import React from 'react';

type Props = {
  forwardedRef?: React.Ref<HTMLTextAreaElement>;
  /**
   * Enables the resizing of the textarea:
   * auto: both directions.
   * horizontal: only along the x axis.
   * vertical: only along the y axis.
   * smart (default): vertically grows and shrinks the textarea automatically to wrap your input text.
   * none: explicitly disallow resizing on the textarea.
   */
  resize?: 'auto' | 'vertical' | 'horizontal' | 'smart' | 'none';
  /** Handler to be called when the input changes. */
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type State = {
  height: string;
};

export default class TextAreaElement extends React.Component<Props, State> {
  textareaElement: HTMLTextAreaElement | null = null;

  state = {
    height: '100%',
  };

  componentDidMount() {
    if (this.props.resize === 'smart' && this.textareaElement) {
      this.setState({
        height: `${this.textareaElement.scrollHeight}px`,
      });
    }
  }

  getTextAreaRef = (ref: HTMLTextAreaElement | null) => {
    this.textareaElement = ref;
    const { forwardedRef } = this.props;
    if (forwardedRef && typeof forwardedRef === 'object') {
      // @ts-ignore
      forwardedRef.current = ref;
    }
    if (forwardedRef && typeof forwardedRef === 'function') {
      forwardedRef(ref);
    }
  };

  handleOnChange: React.ChangeEventHandler<HTMLTextAreaElement> = event => {
    const { onChange } = this.props;
    if (this.props.resize === 'smart') {
      this.setState(
        {
          height: 'auto',
        },
        () => {
          if (this.props.resize === 'smart' && this.textareaElement) {
            this.setState({
              height: `${this.textareaElement.scrollHeight}px`,
            });
          }
        },
      );
    }

    if (onChange) {
      onChange(event);
    }
  };

  render() {
    const { resize, forwardedRef, ...rest } = this.props;
    const { height } = this.state;

    if (resize === 'smart') {
      return (
        <textarea
          ref={this.getTextAreaRef}
          style={{ height }}
          {...rest}
          onChange={this.handleOnChange}
        />
      );
    }
    return (
      <textarea
        ref={this.getTextAreaRef}
        style={{ height: '100%' }}
        {...rest}
      />
    );
  }
}
