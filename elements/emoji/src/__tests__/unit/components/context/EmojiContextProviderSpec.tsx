import React, { PureComponent, type ContextType, useContext } from 'react';
import * as sinon from 'sinon';
import { render } from '@testing-library/react';
import { EmojiContextProvider } from '../../../../context/EmojiContextProvider';
import { EmojiContext } from '../../../../context/EmojiContext';
import EmojiResource from '../../../../api/EmojiResource';

jest.mock('../../../../api/EmojiResource');

class ClassContextChild extends PureComponent {
	static contextType = EmojiContext;
	context!: ContextType<typeof EmojiContext>;

	render() {
		const emoji = this.context?.emoji.emojiProvider.findByShortName('foo');
		return <span>{JSON.stringify(emoji)}</span>;
	}
}

const FunctionContextChild = () => {
	const emojiContext = useContext(EmojiContext);
	const emoji = emojiContext?.emoji.emojiProvider.findByShortName('foo');
	return <span>{JSON.stringify(emoji)}</span>;
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('the emoji context provider', () => {
	let emojiProviderStub: sinon.SinonStubbedInstance<EmojiResource>;
	beforeEach(() => {
		emojiProviderStub = sinon.createStubInstance(EmojiResource);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('passes down the emoji context into functional components', async () => {
		emojiProviderStub.findByShortName.returns('foo-stubbed');
		const emojiContextValue = {
			emoji: {
				emojiProvider: emojiProviderStub,
			},
		};

		const result = await render(
			<EmojiContextProvider emojiContextValue={emojiContextValue}>
				<FunctionContextChild />
			</EmojiContextProvider>,
		);

		expect(result.findByDisplayValue('foo-stubbed')).not.toBeNull();
	});

	it('passed down the emoji context into class based components', async () => {
		emojiProviderStub.findByShortName.returns('foo-stubbed');
		const emojiContextValue = {
			emoji: {
				emojiProvider: emojiProviderStub,
			},
		};

		const result = await render(
			<EmojiContextProvider emojiContextValue={emojiContextValue}>
				<ClassContextChild />
			</EmojiContextProvider>,
		);

		expect(result.findByDisplayValue('foo-stubbed')).not.toBeNull();
	});

	it('does not fetch providers if fetching on demand only', async () => {
		const onlyFetchOnDemand = true;
		const newEmojiResource = new EmojiResource({
			providers: [
				{
					url: 'test-url',
				},
			],
			options: {
				onlyFetchOnDemand,
			},
		});
		newEmojiResource.onlyFetchOnDemand = jest.fn(() => onlyFetchOnDemand);

		const emojiContextValue = {
			emoji: {
				emojiProvider: newEmojiResource,
			},
		};

		await render(
			<EmojiContextProvider emojiContextValue={emojiContextValue}></EmojiContextProvider>,
		);

		expect(newEmojiResource.fetchEmojiProvider).not.toHaveBeenCalled();
	});

	it('does fetch providers if not fetching on demand only', async () => {
		const onlyFetchOnDemand = false;
		const newEmojiResource = new EmojiResource({
			providers: [
				{
					url: 'test-url',
				},
			],
			options: {
				onlyFetchOnDemand,
			},
		});
		newEmojiResource.onlyFetchOnDemand = jest.fn(() => onlyFetchOnDemand);

		const emojiContextValue = {
			emoji: {
				emojiProvider: newEmojiResource,
			},
		};

		await render(
			<EmojiContextProvider emojiContextValue={emojiContextValue}></EmojiContextProvider>,
		);

		expect(newEmojiResource.fetchEmojiProvider).toHaveBeenCalled();
	});
});
