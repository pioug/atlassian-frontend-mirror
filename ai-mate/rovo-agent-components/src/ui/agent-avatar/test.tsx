import React from 'react';

import { IntlProvider } from 'react-intl';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { AgentAvatar, AGENT_AVATAR_CLIP_PATH } from './index';

const IMAGE_URL = 'https://example.com/avatar.png';
const FORGE_IMAGE_URL = 'https://example.com/forge-avatar.png';

jest.mock('./generated-avatars', () => ({
	GeneratedAvatar: ({ size }: { size: string }) => (
		<div data-testid="generated-avatar" data-size={size} />
	),
}));

const renderAgentAvatar = (props: React.ComponentProps<typeof AgentAvatar>) =>
	render(
		<IntlProvider locale="en">
			<AgentAvatar imageUrl={IMAGE_URL} name="Agent" {...props} />
		</IntlProvider>,
	);

const getLegacyAvatarElements = () => {
	const image = screen.getByRole('img', { name: 'Agent' });
	const innerShape = image.parentElement?.parentElement as HTMLElement;
	const avatar = innerShape.parentElement as HTMLElement;

	return { avatar, image, innerShape };
};

const expectLegacyClipPath = (element: HTMLElement) => {
	expect(element).toHaveCompiledCss(
		'clip-path',
		AGENT_AVATAR_CLIP_PATH.replace(/, /g, ',').replace(/ 0\./g, ' .').replace(/ 0%/g, ' 0'),
	);
};

const legacyCases: Array<{
	label: string;
	props: React.ComponentProps<typeof AgentAvatar>;
}> = [
	{ label: 'omitted prop', props: { size: 'small' } },
	{ label: 'false prop', props: { size: 'small', UNSAFE_useAdsAvatar: false } },
];

const setAdsAvatarGates = () => {
	failGate('avatar-custom-border');
	failGate('platform_editor_agent_mentions_drop_one_fixes');
};

describe('AgentAvatar ADS Avatar opt-in', () => {
	it.each(legacyCases)(
		'preserves the legacy renderer, clip path, border treatment, and size with the $label',
		({ props }) => {
			failGate('rovo_chat_bugfix_agent_avatar_squish');
			const { container } = renderAgentAvatar(props);

			const { avatar, image, innerShape } = getLegacyAvatarElements();
			expect(avatar.parentElement).toBe(container);
			expect(image.tagName).toBe('IMG');
			expect(avatar).toHaveStyle({ height: '24px', width: '24px' });
			expectLegacyClipPath(avatar);
			expectLegacyClipPath(innerShape);
			expect(innerShape).toHaveCompiledCss('height', '95%');
			expect(innerShape).toHaveCompiledCss('width', '95%');
		},
	);

	it.each(legacyCases)('preserves the legacy anti-squish behavior with the $label', ({ props }) => {
		passGate('rovo_chat_bugfix_agent_avatar_squish');
		renderAgentAvatar(props);

		const { avatar } = getLegacyAvatarElements();
		expect(avatar).toHaveStyle({
			height: '24px',
			minHeight: '24px',
			minWidth: '24px',
			width: '24px',
		});
	});

	it('uses ADS Avatar with a hexagon appearance for image URLs when opted in', () => {
		setAdsAvatarGates();
		const { container } = renderAgentAvatar({ size: 'small', UNSAFE_useAdsAvatar: true });

		const avatar = screen.getByRole('img', { name: 'Agent' });
		const focusContainer = screen.getByTestId('hexagon-focus-container');
		const borderContainer = screen.getByTestId('hexagon-border-container');

		expect(avatar.tagName).toBe('DIV');
		expect(avatar.parentElement).toBe(container);
		expect(avatar).toContainElement(focusContainer);
		expect(focusContainer).toContainElement(borderContainer);
		expect(avatar.querySelector('img')).toHaveAttribute('src', IMAGE_URL);
	});

	it('composes generated artwork inside ADS AvatarContent when opted in', () => {
		setAdsAvatarGates();
		renderAgentAvatar({ imageUrl: undefined, size: 'large', UNSAFE_useAdsAvatar: true });

		const avatar = screen.getByRole('img', { name: 'Agent' });
		const generatedAvatar = screen.getByTestId('generated-avatar');

		expect(avatar).toContainElement(generatedAvatar);
		expect(generatedAvatar).toHaveAttribute('data-size', 'large');
		expect(screen.getByTestId('hexagon-border-container')).toContainElement(generatedAvatar);
	});

	it('preserves Forge image precedence in the ADS renderer', () => {
		setAdsAvatarGates();
		renderAgentAvatar({
			forgeAgentIconUrl: FORGE_IMAGE_URL,
			isForgeAgent: true,
			UNSAFE_useAdsAvatar: true,
		});

		expect(screen.getByRole('img', { name: 'Agent' }).querySelector('img')).toHaveAttribute(
			'src',
			FORGE_IMAGE_URL,
		);
	});

	it.each([
		{ label: 'legacy', props: {} },
		{ label: 'ADS', props: { UNSAFE_useAdsAvatar: true } },
	])('preserves an accessible image name in the $label renderer', async ({ props }) => {
		if (props.UNSAFE_useAdsAvatar) {
			setAdsAvatarGates();
		} else {
			failGate('rovo_chat_bugfix_agent_avatar_squish');
		}
		const { container } = renderAgentAvatar(props);

		expect(screen.getByRole('img', { name: 'Agent' })).toBeInTheDocument();
		await expect(container).toBeAccessible();
	});
});
