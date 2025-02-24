/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { fileCardImageViewSelector } from '../../classnames';

const imageContainerStyles = css({
	display: 'flex',
	position: 'relative',
	maxWidth: '100%',
	width: '100%',
	height: '100%',
	maxHeight: '100%',
	overflow: 'hidden',
	borderRadius: token('border.radius', '3px'),
});

const imageContainerCenterStyles = css({
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
});

type ImageContainerProps = {
	children: React.ReactNode;
	centerElements?: boolean;
	testId: string;

	mediaName?: string;
	status?: string;
	progress?: number;
	selected?: boolean;
	source?: string;
};

export const ImageContainer = ({
	children,
	mediaName,
	status,
	progress,
	selected,
	source,
	centerElements,
}: ImageContainerProps) => (
	<div
		css={[imageContainerStyles, centerElements && imageContainerCenterStyles]}
		data-testid={fileCardImageViewSelector}
		/**
		 * This wrapper MUST add the classname in order to allow the editor to prevent bubbling up the click event.
		 * See the method isInteractiveElement in source platform/packages/editor/renderer/src/ui/Renderer/click-to-edit.ts
		 * Also, many other consumer tests rely on this selector.
		 */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={fileCardImageViewSelector}
		data-test-media-name={mediaName}
		data-test-status={status}
		data-test-progress={progress}
		data-test-selected={selected}
		data-test-source={source}
	>
		{children}
	</div>
);
