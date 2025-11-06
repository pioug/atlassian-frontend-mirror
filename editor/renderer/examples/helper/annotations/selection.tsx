/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import Button from '@atlaskit/button/new';
import type { InlineCommentSelectionComponentProps } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import AddCommentIcon from '@atlaskit/icon/core/migration/comment';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React from 'react';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid/v4';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import type { Position } from '@atlaskit/editor-common/src/ui/Popup/utils';
import { ExampleCreateInlineCommentComponent } from '@atlaskit/editor-test-helpers/example-helpers';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { token } from '@atlaskit/tokens';

const whiteBoxStyles = css({
	backgroundColor: token('color.background.input', 'rgb(255, 255, 255)'),
	boxShadow: token(
		'elevation.shadow.overlay',
		'rgba(9, 30, 66, 0.6) 0px 4px 8px 0px, rgba(9, 30, 66, 0.31) 0px 0px 1px',
	),
});

type Callback = (doc: JSONDocNode) => void;

const Component = (props: InlineCommentSelectionComponentProps & { setNewDocument: Callback }) => {
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
		let element = range?.commonAncestorContainer as HTMLElement;
		if (element instanceof Text) {
			element = element.parentElement!;
		}

		return element;
	}, [range]);

	const firstRangeDOMRect: DOMRect = React.useMemo(() => {
		if (showCreateComponent && firstRangeDOMRect) {
			return firstRangeDOMRect;
		}

		return range?.getClientRects()[0] as DOMRect;
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

export const ExampleSelectionInlineComponent =
	(setNewDocument: Callback) => (props: InlineCommentSelectionComponentProps) => {
		return <Component setNewDocument={setNewDocument} {...props} />;
	};
