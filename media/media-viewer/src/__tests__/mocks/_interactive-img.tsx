import React from 'react';

export type Props = {
  src: string;
  onClose?: () => void;
  onLoad: () => void;
  onError: () => void;
};

type State = 'error' | 'success';

let _state: State = 'error';

export const setState = (state: State) => {
  _state = state;
};

export class InteractiveImg extends React.Component<Props, {}> {
  componentDidMount() {
    if (_state === 'error') {
      this.props.onError();
    } else {
      this.props.onLoad();
    }
  }

  render() {
    return <div>so empty</div>;
  }
}
