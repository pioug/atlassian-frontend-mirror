/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';

import { easeOut } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { useIsSidebarDragging } from '../../common/hooks';

const transitionDuration = '0.22s';

const shadowStyles = css({
	width: 3,
	position: 'absolute',
	background: token('color.border'),
	insetBlockEnd: 0,
	insetBlockStart: 0,
	insetInlineStart: -1,
	opacity: 0.5,
	pointerEvents: 'none',
	transitionDuration: transitionDuration,
	transitionProperty: 'left, opacity, width',
	transitionTimingFunction: easeOut,
});

const draggingStyles = css({
	width: 6,
	background: token('color.background.neutral.subtle'),
	insetInlineStart: token('space.negative.075'),
	opacity: 0.8,
});

const Shadow = ({ testId }: { testId?: string }): jsx.JSX.Element => {
	const isDragging = useIsSidebarDragging();

	return <div data-testid={testId} css={[shadowStyles, isDragging && draggingStyles]} />;
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Shadow;
