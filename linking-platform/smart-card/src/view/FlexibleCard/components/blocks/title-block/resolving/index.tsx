/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';

import { SmartLinkSize } from '../../../../../../constants';
import { LoadingSkeletonNew, LoadingSkeletonOld } from '../../../common/loading-skeleton';
import { getIconWidthNew } from '../../../utils';
import Block from '../../block';
import { type TitleBlockViewProps } from '../types';

import TitleBlockResolvingViewOld from './TitleBlockResolvingViewOld';

const iconStyle = cssMap({
	xlarge: {
		flex: '0 0 auto',
		height: '2rem',
		minHeight: '2rem',
		maxHeight: '2rem',
		width: '2rem',
		minWidth: '2rem',
		maxWidth: '2rem',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'span, svg, img': {
			height: '2rem',
			minHeight: '2rem',
			maxHeight: '2rem',
			width: '2rem',
			minWidth: '2rem',
			maxWidth: '2rem',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		svg: {
			padding: 0,
		},
	},
	large: {
		flex: '0 0 auto',
		height: '1.5rem',
		minHeight: '1.5rem',
		maxHeight: '1.5rem',
		width: '1.5rem',
		minWidth: '1.5rem',
		maxWidth: '1.5rem',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'span, svg, img': {
			height: '1.5rem',
			minHeight: '1.5rem',
			maxHeight: '1.5rem',
			width: '1.5rem',
			minWidth: '1.5rem',
			maxWidth: '1.5rem',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		svg: {
			padding: 0,
		},
	},
	medium: {
		flex: '0 0 auto',
		height: '1rem',
		minHeight: '1rem',
		maxHeight: '1rem',
		width: '1rem',
		minWidth: '1rem',
		maxWidth: '1rem',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'span, svg, img': {
			height: '1rem',
			minHeight: '1rem',
			maxHeight: '1rem',
			width: '1rem',
			minWidth: '1rem',
			maxWidth: '1rem',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		svg: {
			padding: 0,
		},
	},
	small: {
		flex: '0 0 auto',
		height: '0.75rem',
		minHeight: '0.75rem',
		maxHeight: '0.75rem',
		width: '0.75rem',
		minWidth: '0.75rem',
		maxWidth: '0.75rem',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'span, svg, img': {
			height: '0.75rem',
			minHeight: '0.75rem',
			maxHeight: '0.75rem',
			width: '0.75rem',
			minWidth: '0.75rem',
			maxWidth: '0.75rem',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		svg: {
			padding: 0,
		},
	},
});

/**
 * This represents a TitleBlock for a Smart Link that is currently waiting
 * for a request to finish.
 * This should render when a Smart Link has sent a request.
 * @see TitleBlock
 */
const TitleBlockResolvingViewNew = ({
	actionGroup,
	testId,
	title,
	hideIcon,
	...blockProps
}: TitleBlockViewProps) => {
	const { size = SmartLinkSize.Medium } = blockProps;

	if (fg('platform-smart-card-icon-migration')) {
		const iconWidth = getIconWidthNew(size);

		return (
			<Block {...blockProps} testId={`${testId}-resolving-view`}>
				{!hideIcon && (
					<span style={{ width: iconWidth, height: iconWidth }} data-testid={`${testId}-icon`}>
						<LoadingSkeletonNew
							width={iconWidth}
							height={iconWidth}
							testId={`${testId}-icon-loading`}
						/>
					</span>
				)}
				{title}
				{actionGroup}
			</Block>
		);
	}

	return (
		<Block {...blockProps} testId={`${testId}-resolving-view`}>
			{!hideIcon && (
				<span css={[iconStyle[size]]} data-testid={`${testId}-icon`}>
					<LoadingSkeletonOld testId={`${testId}-icon-loading`} />
				</span>
			)}
			{title}
			{actionGroup}
		</Block>
	);
};

const TitleBlockResolvingView = (props: TitleBlockViewProps): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <TitleBlockResolvingViewNew {...props} />;
	} else {
		return <TitleBlockResolvingViewOld {...props} />;
	}
};

export default TitleBlockResolvingView;
