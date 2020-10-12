import React from 'react';
import { Input } from './Input';

export type Props = {
  selectProps: { disableInput?: boolean };
  innerRef: (ref: React.Ref<HTMLInputElement>) => void;
};

export class PopupInput extends React.Component<Props> {
  private ref: React.Ref<HTMLInputElement> = null;

  componentDidMount() {
    if (this.ref) {
      // @ts-ignore
      this.ref.select();
    }
  }

  private handleInnerRef = (ref: React.Ref<HTMLInputElement>) => {
    this.ref = ref;
    if (this.props.innerRef) {
      this.props.innerRef(ref);
    }
  };

  render() {
    return <Input {...this.props} innerRef={this.handleInnerRef} />;
  }
}
