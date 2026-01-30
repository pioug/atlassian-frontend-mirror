import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

import { InternalActionName, SmartLinkAlignment } from '../../../../../../constants';
import { useFlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import { UnresolvedAction } from '../../../actions';
import { LinkIcon } from '../../../elements';
import Block from '../../block';
import ElementGroup from '../../element-group';
import { type TitleBlockViewProps } from '../types';

const styles = cssMap({
	titleBoxCard: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
	},
});

/**
 * Represents an Errored TitleBlock view.
 * This will render when a Smart Link did not successfully resolve.
 * This may be a result of a Smart Link not having the correct credentials,
 * or the backend response was errored or malformed.
 * @see TitleBlock
 */
const TitleBlockErroredView = ({
	actionGroup,
	hideRetry,
	retry: _retry,
	position,
	testId,
	title,
	icon,
	hideIcon,
	CompetitorPrompt,
	...blockProps
}: TitleBlockViewProps): React.JSX.Element => {
	const context = useFlexibleUiContext();
	const showRetry = !hideRetry && Boolean(context?.actions?.[InternalActionName.UnresolvedAction]);

	const competitorPrompt =
		CompetitorPrompt && context?.url ? (
			<CompetitorPrompt sourceUrl={context?.url} linkType={'card'} />
		) : null;

	return (
		<Block {...blockProps} testId={`${testId}-errored-view`}>
			{!hideIcon && <LinkIcon overrideIcon={icon} position={position} />}
			{competitorPrompt ? (
				<Box xcss={styles.titleBoxCard}>
					{title}
					{competitorPrompt}
				</Box>
			) : (
				title
			)}
			{showRetry && (
				<ElementGroup align={SmartLinkAlignment.Right}>
					<UnresolvedAction testId={testId} />
				</ElementGroup>
			)}
			{actionGroup}
		</Block>
	);
};

export default TitleBlockErroredView;
