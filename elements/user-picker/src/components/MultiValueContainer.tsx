import { components, type MultiValueProps } from '@atlaskit/select';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl-next';
import { type Option, type User } from '../types';
import { messages } from './i18n';
import { isChildInput } from './utils';
import ValueContainerWrapper from './ValueContainerWrapper';

export type State = {
	valueSize: number;
	previousValueSize: number;
};

type Props = MultiValueProps<Option<User>[], true> & {
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

	private addPlaceholder = (placeholder: string): React.ReactElement => {
		const children = React.Children.map(this.props.children, (child) =>
			isChildInput(child as React.ReactChild) && this.showPlaceholder()
				? React.cloneElement(child as React.ReactElement, { placeholder })
				: child,
		);
		return <Fragment>{children}</Fragment>;
	};

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
					{(addMore) => {
						let addMoreMessages: string | string[] = addMore as unknown as string | string[];
						if (addMore && typeof addMore === 'string') {
							addMoreMessages = [addMore];
						}
						const placeholder = (addMoreMessages as string[])?.join('') ?? '';

						return this.addPlaceholder(placeholder);
					}}
				</FormattedMessage>
			);
		}
		return this.addPlaceholder(addMoreMessage);
	};

	onValueContainerClick = this.props.selectProps.onValueContainerClick;

	render() {
		const { children, innerProps, ...valueContainerProps } = this.props;
		const props = {
			...valueContainerProps,
			innerProps: this.valueContainerInnerProps,
		};

		return (
			<ValueContainerWrapper
				isEnabled={this.onValueContainerClick}
				onMouseDown={this.onValueContainerClick}
			>
				<components.ValueContainer {...props}>{this.renderChildren()}</components.ValueContainer>
			</ValueContainerWrapper>
		);
	}
}
