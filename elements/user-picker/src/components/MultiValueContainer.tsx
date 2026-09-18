/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { Fragment } from 'react';

import { cx, cssMap, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import { components } from '@atlaskit/react-select/components';
import type { MultiValueProps } from '@atlaskit/select/types';
import { token } from '@atlaskit/tokens';

import { type Option, type User } from '../types';
import { messages } from './i18n';
import { isChildInput } from './isChildInput';
import ValueContainerWrapper from './ValueContainerWrapper';

export type State = {
	previousValueSize: number;
	valueSize: number;
};

type Props = MultiValueProps<Option<User>[], true> & {
	innerProps?: ValueContainerInnerProps;
	/** Passed through from Atlaskit Select value container (spacing compact). */
	isCompact?: boolean;
};

type ValueContainerInnerProps = {
	ref: React.RefObject<HTMLDivElement>;
};

const valueContainerStyles = cssMap({
	root: {
		gridTemplateColumns: 'auto 1fr',
		overflowX: 'hidden',
		overflowY: 'auto',
		scrollbarWidth: 'none',
		maxHeight: '100%',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&::-webkit-scrollbar': {
			width: 0,
			background: 'transparent',
		},
	},
	paddingLegacy: {
		paddingTop: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
	tagUpliftVerticalDefault: {
		paddingTop: token('space.100'),
		paddingBottom: token('space.100'),
	},
	tagUpliftVerticalCompact: {
		paddingTop: token('space.025'),
		paddingBottom: token('space.025'),
	},
	paddingLeftTight: {
		paddingLeft: token('space.075'),
	},
	paddingLeftWide: {
		paddingLeft: token('space.100'),
	},
	withFlexAndGap: {
		gridTemplateColumns: 'unset',
		flexWrap: 'wrap',
		gap: token('space.050'),
	},
});

export class MultiValueContainer extends React.PureComponent<Props, State> {
	static getDerivedStateFromProps(
		nextProps: Props,
		prevState: State,
	): {
		previousValueSize: number;
		valueSize: number;
	} {
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

	componentDidUpdate(): void {
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

	componentWillUnmount(): void {
		if (this.timeoutId) {
			window.clearTimeout(this.timeoutId);
		}
	}

	scrollToBottom = (): void => {
		this.timeoutId = window.setTimeout(() => {
			const {
				ref: { current },
			} = this.valueContainerInnerProps;
			if (current !== null) {
				current.scrollTop = current.scrollHeight;
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

	onValueContainerClick: any = this.props.selectProps.onValueContainerClick;

	render(): JSX.Element {
		const {
			children: _children,
			innerProps: _innerProps,
			hasValue,
			isCompact,
			...valueContainerProps
		} = this.props;
		const props = {
			...valueContainerProps,
			hasValue,
			isCompact,
			innerProps: this.valueContainerInnerProps,
		};

		const ffTagUplifts = fg('platform-dst-lozenge-tag-badge-visual-uplifts');
		const controlRendersValueInControl = this.props.selectProps.controlShouldRenderValue !== false;
		const tagUpliftChipRow = ffTagUplifts && hasValue && controlRendersValueInControl;

		return (
			<ValueContainerWrapper
				isEnabled={this.onValueContainerClick}
				onMouseDown={this.onValueContainerClick}
			>
				<components.ValueContainer
					{...props}
					xcss={cx(
						valueContainerStyles.root,
						!ffTagUplifts && valueContainerStyles.paddingLegacy,
						ffTagUplifts &&
							(isCompact
								? valueContainerStyles.tagUpliftVerticalCompact
								: valueContainerStyles.tagUpliftVerticalDefault),
						ffTagUplifts &&
							(tagUpliftChipRow
								? valueContainerStyles.paddingLeftWide
								: valueContainerStyles.paddingLeftTight),
						tagUpliftChipRow && valueContainerStyles.withFlexAndGap,
					)}
				>
					{this.renderChildren()}
				</components.ValueContainer>
			</ValueContainerWrapper>
		);
	}
}
