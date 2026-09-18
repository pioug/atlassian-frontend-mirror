/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

/* eslint-disable @typescript-eslint/consistent-type-imports, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic */
import { jsx, css } from '@emotion/react';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuid } from 'uuid';

import Button from '@atlaskit/button/default/button';
// AFP-2532 TODO: Fix automatic suppressions below
import type { Position } from '@atlaskit/editor-common/src/ui/Popup/utils';
import type { InlineCommentHoverComponentProps } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer/types';
import { ExampleCreateInlineCommentComponent } from '@atlaskit/editor-test-helpers/example-helpers';
import AddCommentIcon from '@atlaskit/icon/core/comment';
import { token } from '@atlaskit/tokens';

const whiteBoxStyles = css({
	backgroundColor: token('color.background.input'),
	boxShadow: token('elevation.shadow.overlay'),
});

type Callback = (doc: JSONDocNode) => void;

const Component = (props: InlineCommentHoverComponentProps & { setNewDocument: Callback }) => {
	const {
		range,
		isAnnotationAllowed,
		onCreate,
		onClose,
		applyDraftMode,
		removeDraftMode,
		wrapperDOM,
		setNewDocument,
	} = props;
	const [showCreateComponent, setShowCreateComponent] = React.useState(false);
	const onToolbarCreateButtonClick = React.useCallback(() => {
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		applyDraftMode({ annotationId: uuid(), keepNativeSelection: true });
		setShowCreateComponent(true);
	}, [applyDraftMode]);

	const onPopupClose = React.useCallback(() => {
		setShowCreateComponent(false);
		onClose();
	}, [onClose]);

	const onPopupCreate = React.useCallback(() => {
		removeDraftMode();
		setShowCreateComponent(false);
		onClose();

		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		const id = uuid();
		const result = onCreate(id);

		if (result) {
			setNewDocument(result.doc);
		}
	}, [onClose, onCreate, removeDraftMode, setNewDocument]);

	const domTarget = React.useMemo(() => {
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		let element = range.commonAncestorContainer as HTMLElement;
		if (element instanceof Text) {
			element = element.parentElement!;
		}

		return element;
	}, [range]);

	const firstRangeDOMRect: DOMRect = React.useMemo(() => {
		if (showCreateComponent && firstRangeDOMRect) {
			return firstRangeDOMRect;
		}

		return range.getClientRects()[0] as DOMRect;
	}, [range, showCreateComponent]);

	const onPositionCalculated = React.useCallback(
		(nextPos: Position): Position => {
			const containerRect = wrapperDOM.getBoundingClientRect() as DOMRect;
			const firstRangeReact = firstRangeDOMRect;

			return {
				...nextPos,
				left: firstRangeReact.right - firstRangeReact.width / 2,
				top: Math.abs(Math.abs(containerRect.y) + firstRangeReact.y + firstRangeReact.height + 10),
			};
		},
		[firstRangeDOMRect, wrapperDOM],
	);

	React.useLayoutEffect(() => {
		const onClick = (event: MouseEvent) => {
			const { target } = event;

			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			if (!showCreateComponent && wrapperDOM.contains(target as HTMLElement)) {
				onPopupClose();
				return;
			}
		};

		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		document.addEventListener('mousedown', onClick);

		return () => {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			document.removeEventListener('mousedown', onClick);
		};
	}, [wrapperDOM, showCreateComponent, onPopupClose]);

	if (!showCreateComponent) {
		return (
			<Popup
				target={wrapperDOM}
				alignX="center"
				alignY="bottom"
				onPositionCalculated={onPositionCalculated}
			>
				<div css={whiteBoxStyles}>
					<Button
						appearance="subtle"
						iconBefore={AddCommentIcon}
						isDisabled={!isAnnotationAllowed}
						testId="createInlineCommentButton"
						onClick={onToolbarCreateButtonClick}
					>
						Comment
					</Button>
				</div>
			</Popup>
		);
	}

	return (
		<ExampleCreateInlineCommentComponent
			dom={domTarget}
			onCreate={onPopupCreate}
			onClose={onPopupClose}
			inlineNodeTypes={[]}
		/>
	);
};

export const ExampleHoverInlineComponent =
	(setNewDocument: Callback) =>
	(props: InlineCommentHoverComponentProps): jsx.JSX.Element => {
		return <Component setNewDocument={setNewDocument} {...props} />;
	};
