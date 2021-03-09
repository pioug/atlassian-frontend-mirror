import React from 'react';

type Props = {
  onError: (error?: Error) => void;
  onLoad: () => void;
};

let _error: Error | undefined;
export const setViewerError = (error?: Error) => {
  _error = error;
};
export const clearViewerError = () => {
  _error = undefined;
};

export class ImageViewer extends React.Component<Props, {}> {
  componentDidMount() {
    if (_error) {
      this.props.onError(_error);
    } else {
      this.props.onLoad();
    }
  }

  render() {
    return <div>so empty</div>;
  }
}
