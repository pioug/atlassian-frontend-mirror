/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC } from 'react';

import { cssMap as unboundCssMap } from '@compiled/react';

import { cssMap, jsx } from '@atlaskit/css';

import AvatarPresence, { type PresenceProps } from '../presence';
import { type AppearanceType, type IndicatorSizeType } from '../types';

interface PresenceWrapperProps extends PresenceProps {
	appearance: AppearanceType;
	size: IndicatorSizeType;
	testId?: string;
}

const styles = cssMap({
	root: {
		position: 'absolute',
		pointerEvents: 'none',
	},
});

const iconSizeMap = cssMap({
	small: { height: '12px', width: '12px' },
	medium: { height: '14px', width: '14px' },
	large: { height: '15px', width: '15px' },
	xlarge: { height: '18px', width: '18px' },
});

const circleIconOffsetMap = unboundCssMap({
	small: { bottom: 0, right: 0 },
	medium: { bottom: 0, right: 0 },
	large: { bottom: '1px', right: '1px' },
	xlarge: { bottom: '7px', right: '7px' },
});
const squareIconOffsetMap = unboundCssMap({
	root: { bottom: '-4px', right: '-4px' },
});
const hexagonIconOffsetMap = unboundCssMap({
	small: { bottom: '-1px', right: '-1px' },
	medium: { bottom: '-1px', right: '-1px' },
	large: { bottom: '4px', right: '-4px' },
	xlarge: { bottom: '17px', right: '-5px' },
});

/**
 * __Presence wrapper__
 *
 * A presence wrapper is used internally to position presence ontop of the avatar.
 */
const PresenceWrapper: FC<PresenceWrapperProps> = ({
	size,
	appearance,
	children,
	borderColor,
	presence,
	testId,
}) => {
	return (
		<span
			aria-hidden="true"
			data-testid={testId && `${testId}--presence`}
			css={[
				styles.root,
				iconSizeMap[size],
				circleIconOffsetMap[size],
				appearance === 'square' && squareIconOffsetMap.root,
				appearance === 'hexagon' && hexagonIconOffsetMap[size],
			]}
		>
			<AvatarPresence borderColor={borderColor} presence={!children ? presence : undefined}>
				{children}
			</AvatarPresence>
		</span>
	);
};

export default PresenceWrapper;
