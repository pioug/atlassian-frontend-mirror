import React from 'react';

import Button from '@atlaskit/button/default/button';
import IconButton from '@atlaskit/button/icon/button';
import Heading from '@atlaskit/heading/heading';
import AnimatedIconTrigger from '@atlaskit/icon/animated-icon-trigger';
import AiSearchAnimatedIcon from '@atlaskit/icon/animated/ai-search';
import MagicWandAnimatedIcon from '@atlaskit/icon/animated/magic-wand';
import SignatureAnimatedIcon from '@atlaskit/icon/animated/signature';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

const AnimatedIconLabelExample = (): React.JSX.Element => {
	return (
		<Inline space="space.1000">
			<Stack space="space.200" alignBlock="center">
				<Heading size="small">Icons with labels:</Heading>
				<Inline space="space.100" alignBlock="center">
					<SignatureAnimatedIcon color={token('color.icon')} label="Signature required" />
					<Text weight="bold">Contract</Text>
				</Inline>
				<AnimatedIconTrigger>
					<IconButton
						label="Search with AI"
						icon={(iconProps) => <AiSearchAnimatedIcon {...iconProps} />}
					/>
				</AnimatedIconTrigger>
			</Stack>
			<Stack space="space.200" alignBlock="center">
				<Heading size="small">Icons without labels:</Heading>
				<Inline space="space.100" alignBlock="center">
					<SignatureAnimatedIcon color={token('color.text')} label="" />
					<Text color="color.text">Signed yesterday</Text>
				</Inline>
				<AnimatedIconTrigger>
					<Button iconBefore={(iconProps) => <MagicWandAnimatedIcon {...iconProps} />}>
						Suggest edits
					</Button>
				</AnimatedIconTrigger>
			</Stack>
		</Inline>
	);
};

export default AnimatedIconLabelExample;
