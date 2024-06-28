/** @jsx jsx */
import { useState } from 'react';

// not permitted to migrate atlaskit packages to compiled yet, see https://hello.atlassian.net/wiki/spaces/UAF/pages/3006969423/Migrating+AFM+platform+components+to+Compiled+a+guide
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import { OverlayButton } from '@atlaskit/editor-common/link';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

const ConfigureOverlayWrapperStyles = css({
	position: 'relative',
	left: token('space.025', '2px'),
});

const OverlayWrapper = ({
	view,
	targetElementPos,
	children,
}: {
	view: EditorView;
	targetElementPos: number | undefined;
	children: JSX.Element;
}) => {
	const [showConfigureButton, setShowConfigureButton] = useState(false);

	return (
		<span
			onMouseEnter={() => setShowConfigureButton(true)}
			onMouseLeave={() => setShowConfigureButton(false)}
			data-testid="inline-card-overlay-wrapper"
		>
			<span css={ConfigureOverlayWrapperStyles}>
				{showConfigureButton && (
					<OverlayButton editorView={view} targetElementPos={targetElementPos} />
				)}
			</span>
			{children}
		</span>
	);
};

export default OverlayWrapper;
