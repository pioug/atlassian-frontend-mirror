import React, { useContext, useEffect, useState } from 'react';

import { render } from '@testing-library/react';
import * as sinon from 'sinon';

import { EmojiResource } from '../../../../api/EmojiResource';
import { EmojiCommonProvider } from '../../../../context/EmojiCommonProvider';
import { EmojiContext } from '../../../../context/EmojiContext';

export const RenderContextStub = (): React.JSX.Element => {
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

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
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

const CreditStatus = () => {
	const context = useContext(EmojiContext);
	const status = context?.emoji.getAICreditStatus?.({ featureName: 'emojiPicker-createEmoji' });
	return <p>{status ? (status.isBlocked ? 'blocked' : 'allowed') : 'no check'}</p>;
};

it('updates the credit callback without fetching the emoji resource again', () => {
	const emojiProvider = sinon.createStubInstance(EmojiResource);
	const blocked = jest.fn(() => ({ isBlocked: true as const, renderCustomContent: () => null }));
	const allowed = jest.fn(() => ({ isBlocked: false as const }));
	const { getByText, rerender } = render(
		<EmojiCommonProvider emojiProvider={emojiProvider} getAICreditStatus={blocked}>
			<CreditStatus />
		</EmojiCommonProvider>,
	);
	expect(getByText('blocked')).toBeInTheDocument();
	expect(blocked).toHaveBeenCalledWith({ featureName: 'emojiPicker-createEmoji' });
	expect(emojiProvider.fetchEmojiProvider.callCount).toBe(1);
	rerender(
		<EmojiCommonProvider emojiProvider={emojiProvider} getAICreditStatus={allowed}>
			<CreditStatus />
		</EmojiCommonProvider>,
	);
	expect(getByText('allowed')).toBeInTheDocument();
	expect(allowed).toHaveBeenCalledWith({ featureName: 'emojiPicker-createEmoji' });
	rerender(
		<EmojiCommonProvider emojiProvider={emojiProvider}>
			<CreditStatus />
		</EmojiCommonProvider>,
	);
	expect(getByText('no check')).toBeInTheDocument();
	expect(emojiProvider.fetchEmojiProvider.callCount).toBe(1);
});
