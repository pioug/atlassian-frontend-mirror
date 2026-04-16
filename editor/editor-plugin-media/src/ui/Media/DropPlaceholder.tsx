/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { dropPlaceholderMessages } from '@atlaskit/editor-common/media';
import DocumentFilledIcon from '@atlaskit/icon/core/file';
import { token } from '@atlaskit/tokens';

import { FILE_WIDTH, MEDIA_HEIGHT } from '../../nodeviews/mediaNodeView/media';

const iconWrapperStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	color: token('color.icon.accent.blue'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	background: token('color.background.accent.blue.subtle'),
	borderRadius: token('radius.small', '3px'),
	margin: `${token('space.075')} ${token('space.050')} ${token('space.300')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${FILE_WIDTH}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minHeight: `${MEDIA_HEIGHT}px`,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const dropLineStyles = css({
	background: token('color.border.focused'),
	borderRadius: token('radius.small', '3px'),
	margin: `${token('space.025')} 0`,
	width: '100%',
	height: '2px',
});

export type PlaceholderType = 'single' | 'group';
interface Props {
	type: PlaceholderType;
}

const IconWrapperComponent = (props: WrappedComponentProps) => {
	const { intl } = props;
	const { dropPlaceholderLabel } = dropPlaceholderMessages;

	return (
		<div css={iconWrapperStyles}>
			<DocumentFilledIcon label={intl.formatMessage(dropPlaceholderLabel)} />
		</div>
	);
};

const IntlIconWrapper = injectIntl(IconWrapperComponent);

export default ({ type = 'group' }: Props): jsx.JSX.Element =>
	type === 'single' ? <div css={dropLineStyles} /> : <IntlIconWrapper />;
