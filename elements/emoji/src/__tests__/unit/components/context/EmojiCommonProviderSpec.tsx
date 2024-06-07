import { render } from '@testing-library/react';
import React, { useContext, useEffect, useState } from 'react';
import * as sinon from 'sinon';
import { EmojiContext } from '../../../../context/EmojiContext';
import { EmojiResource } from '../../../../api/EmojiResource';
import { EmojiCommonProvider } from '../../../../context/EmojiCommonProvider';

export const RenderContextStub = () => {
	const stubbedContext = useContext(EmojiContext);
	const [contextState, setContextState] = useState('');

	useEffect(() => {
		if (!stubbedContext) {
			return setContextState('context null');
		} else if (typeof stubbedContext.emoji.emojiProvider === 'string') {
			return setContextState('context legacy');
		}
		setContextState('context prop');
	}, [stubbedContext]);

	return <p>{contextState}</p>;
};

describe('<EmojiResourceProvider />', () => {
	test('renders children without context if no context is found', () => {
		const result = render(
			<EmojiCommonProvider>
				<RenderContextStub />
			</EmojiCommonProvider>,
		);
		expect(result.getByText('context null')).not.toBeNull();
	});
	test('provides prop context if no legacy context is provided', () => {
		const emojiProviderStub: sinon.SinonStubbedInstance<EmojiResource> =
			sinon.createStubInstance(EmojiResource);

		const result = render(
			<EmojiCommonProvider emojiProvider={emojiProviderStub}>
				<RenderContextStub />
			</EmojiCommonProvider>,
		);

		expect(result.getByText('context prop')).not.toBeNull();
	});
});
