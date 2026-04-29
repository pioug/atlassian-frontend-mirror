/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { configPanelMessages as messages } from '@atlaskit/editor-common/extensions';
import CrossCircleIcon from '@atlaskit/icon/core/cross-circle';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const removableFieldWrapperStyles = css({
	position: 'relative',
	marginBottom: 0,
});

const wrapperWithMarginBottomStyles = css({
	marginBottom: token('space.200'),
});

const removeButtonWrapperStyles = css({
	position: 'absolute',
	right: 0,
	top: 0,
	cursor: 'pointer',

	color: token('color.icon.subtle'),

	'&:hover': {
		color: token('color.icon.danger'),
	},
});

type Props = {
	canRemoveField?: boolean;
	children: React.ReactElement;
	className?: string;
	name: string;
	onClickRemove?: (fieldName: string) => void;
} & WrappedComponentProps;

const RemovableField = ({
	name,
	canRemoveField,
	onClickRemove,
	children,
	intl,
	className,
}: Props) => {
	const onClickCallback = React.useCallback(
		() => onClickRemove && onClickRemove(name),
		[name, onClickRemove],
	);

	const hasMarginBottom = children.props.field?.type !== 'expand';

	return (
		<div
			css={[removableFieldWrapperStyles, hasMarginBottom && wrapperWithMarginBottomStyles]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
		>
			{children}
			{canRemoveField && (
				<div
					role="button"
					css={removeButtonWrapperStyles}
					data-testid={`remove-field-${name}`}
					onClick={onClickCallback}
					onKeyDown={onClickCallback}
					onFocus={onClickCallback}
					tabIndex={0}
				>
					<Tooltip content={intl.formatMessage(messages.removeField)} position="left">
						<CrossCircleIcon spacing="none" label={intl.formatMessage(messages.removeField)} />
					</Tooltip>
				</div>
			)}
		</div>
	);
};

// eslint-disable-next-line @typescript-eslint/ban-types
const _default_1: React.FC<WithIntlProps<Props>> & {
	WrappedComponent: React.ComponentType<Props>;
} = injectIntl(RemovableField);
export default _default_1;
