import React from 'react';

type Props = {
	onError: (error?: Error) => void;
	onLoad: () => void;
};

let _error: Error | undefined;
export const setViewerError = (error?: Error): void => {
	_error = error;
};
export const clearViewerError = (): void => {
	_error = undefined;
};

export class ImageViewer extends React.Component<Props, {}> {
	componentDidMount(): void {
		if (_error) {
			this.props.onError(_error);
		} else {
			this.props.onLoad();
		}
	}

	render(): React.JSX.Element {
		return <div>so empty</div>;
	}
}
