import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import { useCloseOnEscapePress } from '@atlaskit/layering';
import { Stack, Text } from '@atlaskit/primitives';

import Blanket from '../src';

const BasicExample = () => {
	const [isBlanketVisible, setIsBlanketVisible] = useState(false);
	const showBlanketClick = useCallback(() => {
		setIsBlanketVisible((isBlanketVisible) => !isBlanketVisible);
	}, [setIsBlanketVisible]);
	useCloseOnEscapePress({
		onClose: showBlanketClick,
		isDisabled: !isBlanketVisible,
	});
	return (
		<Stack space="space.100" alignInline="start">
			<Text>
				Open the blanket by clicking the "Show blanket" button. To dismiss the blanket, either click
				the "Hide blanket" button or press the Escape key.
			</Text>
			<Text>
				Because shouldAllowClickThrough is enabled, onBlanketClicked is not called & elements
				underneath the blanket can be interacted with directly.
			</Text>
			<Button appearance="default" onClick={showBlanketClick}>
				{!isBlanketVisible ? 'Show blanket' : 'Hide blanket'}
			</Button>
			<Blanket isTinted={isBlanketVisible} shouldAllowClickThrough />
		</Stack>
	);
};

export default BasicExample;
