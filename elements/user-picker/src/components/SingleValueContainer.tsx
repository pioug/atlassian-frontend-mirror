/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { components, type ValueContainerProps } from '@atlaskit/select';
import { type Option, type User } from '../types';
import { SizeableAvatar } from './SizeableAvatar';
import ValueContainerWrapper from './ValueContainerWrapper';
import { token } from '@atlaskit/tokens';
import { css, cssMap, jsx } from '@compiled/react';
import { getAppearanceForAppType } from '@atlaskit/avatar';
import { fg } from '@atlaskit/platform-feature-flags';

const valueContainerStyles = cssMap({
	root: {
		gridTemplateColumns: 'auto 1fr',
		paddingTop: token('space.075'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.0'),
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
});

const placeholderIconContainer = css({
	paddingLeft: token('space.075', '6px'),
	gridArea: '1/1/2/2',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 0,
});

const wrapperStyle = css({ flexGrow: 1 });

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
					avatarAppearanceShape={
						value &&
						(value as Option<User>).data &&
						fg('jira_ai_agent_avatar_user_picker_user_option')
							? getAppearanceForAppType((value as Option<User>).data.appType)
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
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlassian/a11y/no-static-element-interactions -- Ignored via go/DSP-18766
			<div css={wrapperStyle} onMouseDown={this.onValueContainerClick}>
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
				<components.ValueContainer {...valueContainerProps} xcss={valueContainerStyles.root}>
					<div css={placeholderIconContainer}>{this.renderAvatar()}</div>
					{children}
				</components.ValueContainer>
			</ValueContainerWrapper>
		);
	}
}
