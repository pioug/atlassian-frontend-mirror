import React, { useCallback } from 'react';

import type { Command } from '@atlaskit/editor-common/types';
import { FloatingToolbarButton as Button } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import { useSmartLinkDestinationUrl } from '@atlaskit/smart-card/hook/use-smart-link-destination-url';

type OpenLinkToolbarButtonProps = {
	areAnyNewToolbarFlagsEnabled: boolean;
	editorView: EditorView;
	onClick: Command;
	title: string;
	url: string;
};

/**
 * Toolbar button that opens a Smart Link URL in a new tab, with the XPC-wrapped destination URL.
 *
 * This component is only rendered when `fg('platform_smartlink_xpc_url_wrapping')` is ON.
 * It wraps `FloatingToolbarButton` and replaces `href` with the resolved destination URL
 * (cross-product analytics parameters appended), falling back to the raw `url` when the
 * link is unresolved or not a first-party Atlassian link.
 */
export const OpenLinkToolbarButton = ({
	url,
	areAnyNewToolbarFlagsEnabled,
	editorView,
	onClick,
	title,
}: OpenLinkToolbarButtonProps): React.JSX.Element => {
	const destinationUrl = useSmartLinkDestinationUrl(url);

	const handleClick = useCallback(() => {
		onClick(editorView.state, editorView.dispatch);
	}, [editorView, onClick]);

	return (
		<Button
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="hyperlink-open-link"
			title={title}
			icon={<LinkExternalIcon label="" />}
			href={destinationUrl}
			target="_blank"
			onClick={handleClick}
			areAnyNewToolbarFlagsEnabled={areAnyNewToolbarFlagsEnabled}
		/>
	);
};
