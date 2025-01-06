/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { components, type ValueContainerProps } from '@atlaskit/select';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React from 'react';
import { type Option, type User } from '../types';
import { SizeableAvatar } from './SizeableAvatar';
import { BORDER_PADDING } from './styles';
import ValueContainerWrapper from './ValueContainerWrapper';

const placeholderIconContainer = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	paddingLeft: BORDER_PADDING,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 0,
	gridArea: '1/1/2/2',
});

const showUserAvatar = (inputValue?: string, value?: Option<User>) =>
	value && value.data && inputValue === value.label;

export class SingleValueContainer extends React.Component<ValueContainerProps<Option<User>>> {
	private renderAvatar = () => {
		const {
			hasValue,
			//@ts-ignore react-select unsupported props
			selectProps: { appearance, isFocused, inputValue, value, placeholderAvatar },
		} = this.props;

		if (isFocused || !hasValue) {
			return (
				<SizeableAvatar
					appearance={appearance}
					type={placeholderAvatar}
					src={
						showUserAvatar(inputValue, value as Option<User>)
							? (value as Option<User>).data.avatarUrl
							: undefined
					}
				/>
			);
		}
		return null;
	};

	//@ts-ignore react-select unsupported props
	onValueContainerClick = this.props.selectProps.onValueContainerClick;

	Wrapper = ({ children }: { children: React.ReactElement }) => {
		return this.onValueContainerClick ? (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values, jsx-a11y/no-static-element-interactions -- Ignored via go/DSP-18766
			<div css={css({ flexGrow: 1 })} onMouseDown={this.onValueContainerClick}>
				{children}
			</div>
		) : (
			children
		);
	};

	render() {
		const { children, ...valueContainerProps } = this.props;

		return (
			<ValueContainerWrapper
				isEnabled={this.onValueContainerClick}
				onMouseDown={this.onValueContainerClick}
			>
				<components.ValueContainer {...valueContainerProps}>
					<div css={placeholderIconContainer}>{this.renderAvatar()}</div>
					{children}
				</components.ValueContainer>
			</ValueContainerWrapper>
		);
	}
}
