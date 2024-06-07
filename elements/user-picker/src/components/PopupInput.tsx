import React from 'react';
import { Input, type Props } from './Input';

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
