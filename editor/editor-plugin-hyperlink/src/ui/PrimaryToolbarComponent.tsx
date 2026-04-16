/* eslint-disable @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, type ComponentType, type FC } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { INPUT_METHOD, type EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { addLink, getAriaKeyshortcuts } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import LinkIcon from '@atlaskit/icon/core/link';

import type { HyperlinkPlugin } from '../hyperlinkPluginType';

type PrimaryToolbarComponentProps = {
	api: ExtractInjectionAPI<HyperlinkPlugin> | undefined;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
} & WrappedComponentProps;

const PrimaryToolbarComponentWithIntl = ({
	api,
	// TODO: ED-26959 - Analytics
	// editorAnalyticsAPI,
	intl,
}: PrimaryToolbarComponentProps) => {
	const { formatMessage } = intl;
	const content = formatMessage(messages.link);

	const onClick = useCallback(() => {
		api?.core?.actions.execute(api?.hyperlink?.commands.showLinkToolbar(INPUT_METHOD.TOOLBAR));
	}, [api]);

	return (
		<ToolbarButton
			onClick={onClick}
			aria-haspopup="dialog"
			aria-keyshortcuts={getAriaKeyshortcuts(addLink)}
			aria-label={content}
			testId={content}
			title={content}
			iconBefore={<LinkIcon label={content} color="currentColor" spacing="spacious" />}
		/>
	);
};

export const PrimaryToolbarComponent: FC<WithIntlProps<PrimaryToolbarComponentProps>> & {
	WrappedComponent: ComponentType<PrimaryToolbarComponentProps>;
} = injectIntl(PrimaryToolbarComponentWithIntl);
