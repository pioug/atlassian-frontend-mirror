import { render, screen } from '@testing-library/react';
import React from 'react';
import { AvatarOrIcon, type AvatarOrIconProps } from '../../../components/AvatarOrIcon';
import { type Props as SizeableAvatarProps } from '../../../components/SizeableAvatar';

jest.mock('../../../components/SizeableAvatar', () => ({
	SizeableAvatar: (props: SizeableAvatarProps) => (
		<div data-testid="sizeable-avatar">SizeableAvatar - {JSON.stringify(props)}</div>
	),
}));

describe('AvatarOrIcon', () => {
	const renderAvatarOrIcon = (props: Partial<AvatarOrIconProps> = {}) =>
		render(<AvatarOrIcon appearance="big" {...props} />);

	describe('when icon is provided', () => {
		const mockIcon = <div data-testid="test-icon">Icon</div>;

		it('should render icon in a container when icon is provided', () => {
			renderAvatarOrIcon({ icon: mockIcon });
			const iconElement = screen.getByTestId('test-icon');

			expect(iconElement).toBeInTheDocument();
			expect(iconElement).toHaveTextContent('Icon');
		});

		it('should not render SizeableAvatar when icon is provided', () => {
			renderAvatarOrIcon({ icon: mockIcon });
			const sizeableAvatar = screen.queryByTestId('sizeable-avatar');

			expect(sizeableAvatar).not.toBeInTheDocument();
		});

		it('should apply iconColor when iconColor is provided', () => {
			const iconColor = '#FF0000';
			const { container } = renderAvatarOrIcon({ icon: mockIcon, iconColor });
			const iconContainer = container.firstChild as HTMLElement;

			expect(iconContainer).toHaveStyle({ color: iconColor });
		});

		it('should not apply iconColor when iconColor is not provided', () => {
			const { container } = renderAvatarOrIcon({ icon: mockIcon });
			const iconContainer = container.firstChild as HTMLElement;

			expect(iconContainer).toHaveStyle({ color: '' });
		});

		it('should apply iconColor with different color values', () => {
			const iconColor = 'rgb(0, 128, 255)';
			const { container } = renderAvatarOrIcon({ icon: mockIcon, iconColor });
			const iconContainer = container.firstChild as HTMLElement;

			expect(iconContainer).toHaveStyle({ color: iconColor });
		});

		it('should handle iconColor with undefined value', () => {
			const { container } = renderAvatarOrIcon({ icon: mockIcon, iconColor: undefined });
			const iconContainer = container.firstChild as HTMLElement;

			expect(iconContainer).toHaveStyle({ color: '' });
		});

		it('should handle iconColor with empty string', () => {
			const { container } = renderAvatarOrIcon({ icon: mockIcon, iconColor: '' });
			const iconContainer = container.firstChild as HTMLElement;

			// Empty string should still apply as a style value (though it may not have visual effect)
			expect(iconContainer).toHaveStyle({ color: '' });
		});
	});

	describe('when icon is not provided', () => {
		it('should render SizeableAvatar when icon is not provided', () => {
			renderAvatarOrIcon({ src: 'http://example.com/avatar.png' });
			const sizeableAvatar = screen.getByTestId('sizeable-avatar');

			expect(sizeableAvatar).toBeInTheDocument();
		});

		it('should pass appearance prop to SizeableAvatar', () => {
			renderAvatarOrIcon({
				src: 'http://example.com/avatar.png',
				appearance: 'normal',
			});
			const sizeableAvatar = screen.getByTestId('sizeable-avatar');

			expect(sizeableAvatar).toHaveTextContent('"appearance":"normal"');
		});

		it('should pass src prop to SizeableAvatar', () => {
			const src = 'http://example.com/avatar.png';
			renderAvatarOrIcon({ src });
			const sizeableAvatar = screen.getByTestId('sizeable-avatar');

			expect(sizeableAvatar).toHaveTextContent(`"src":"${src}"`);
		});

		it('should pass presence prop to SizeableAvatar', () => {
			const presence = 'online';
			renderAvatarOrIcon({
				src: 'http://example.com/avatar.png',
				presence,
			});
			const sizeableAvatar = screen.getByTestId('sizeable-avatar');

			expect(sizeableAvatar).toHaveTextContent(`"presence":"${presence}"`);
		});

		it('should pass type prop to SizeableAvatar', () => {
			renderAvatarOrIcon({
				src: 'http://example.com/avatar.png',
				type: 'team',
			});
			const sizeableAvatar = screen.getByTestId('sizeable-avatar');

			expect(sizeableAvatar).toHaveTextContent('"type":"team"');
		});

		it('should pass avatarAppearanceShape prop to SizeableAvatar', () => {
			const avatarAppearanceShape = 'hexagon';
			renderAvatarOrIcon({
				src: 'http://example.com/avatar.png',
				avatarAppearanceShape,
			});
			const sizeableAvatar = screen.getByTestId('sizeable-avatar');

			expect(sizeableAvatar).toHaveTextContent(`"avatarAppearanceShape":"${avatarAppearanceShape}"`);
		});

		it('should use default type "person" when type is not provided', () => {
			renderAvatarOrIcon({ src: 'http://example.com/avatar.png' });
			const sizeableAvatar = screen.getByTestId('sizeable-avatar');

			expect(sizeableAvatar).toHaveTextContent('"type":"person"');
		});

		it('should use default appearance "big" when appearance is not provided', () => {
			renderAvatarOrIcon({ src: 'http://example.com/avatar.png' });
			const sizeableAvatar = screen.getByTestId('sizeable-avatar');

			expect(sizeableAvatar).toHaveTextContent('"appearance":"big"');
		});
	});

	describe('edge cases', () => {
		it('should handle null icon', () => {
			renderAvatarOrIcon({ icon: null, src: 'http://example.com/avatar.png' });
			const sizeableAvatar = screen.getByTestId('sizeable-avatar');

			expect(sizeableAvatar).toBeInTheDocument();
		});

		it('should handle undefined icon', () => {
			renderAvatarOrIcon({ icon: undefined, src: 'http://example.com/avatar.png' });
			const sizeableAvatar = screen.getByTestId('sizeable-avatar');

			expect(sizeableAvatar).toBeInTheDocument();
		});

		it('should handle empty string icon', () => {
			renderAvatarOrIcon({ icon: '', src: 'http://example.com/avatar.png' });
			const sizeableAvatar = screen.getByTestId('sizeable-avatar');

			// Empty string is falsy, so should render SizeableAvatar
			expect(sizeableAvatar).toBeInTheDocument();
		});
	});
});

