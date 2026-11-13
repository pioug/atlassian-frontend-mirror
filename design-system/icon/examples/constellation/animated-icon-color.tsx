import React from 'react';

import AnimatedIconTrigger from '@atlaskit/icon/animated-icon-trigger';
import AiSearchAnimatedIcon from '@atlaskit/icon/animated/ai-search';
import MagicWandAnimatedIcon from '@atlaskit/icon/animated/magic-wand';
import SignatureAnimatedIcon from '@atlaskit/icon/animated/signature';
import TextReviewAnimatedIcon from '@atlaskit/icon/animated/text-review';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { token } from '@atlaskit/tokens';

const AnimatedIconColorExample = (): React.JSX.Element => {
	return (
		<AnimatedIconTrigger>
			<Inline space="space.100">
				<MagicWandAnimatedIcon color={token('color.icon.accent.purple')} label="" />
				<SignatureAnimatedIcon color={token('color.icon.accent.teal')} label="" />
				<AiSearchAnimatedIcon color={token('color.link')} label="" />
				<TextReviewAnimatedIcon color={token('color.icon.success')} label="" />
			</Inline>
		</AnimatedIconTrigger>
	);
};

export default AnimatedIconColorExample;
