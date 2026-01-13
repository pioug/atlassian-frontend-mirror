import React from 'react';

export type Props = {
	src: string;
	onClose?: () => void;
	onLoad: () => void;
	onError: () => void;
};

let _hasError = false;

export const setHasError = (hasError: boolean): void => {
	_hasError = hasError;
};

export class InteractiveImg extends React.Component<Props, {}> {
	componentDidMount(): void {
		if (_hasError) {
			this.props.onError();
		} else {
			this.props.onLoad();
		}
	}

	render(): React.JSX.Element {
		return <div>so empty</div>;
	}
}
