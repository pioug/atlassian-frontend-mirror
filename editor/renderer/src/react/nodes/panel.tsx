import React from 'react';

import { PanelType } from '@atlaskit/adf-schema';
import {
	PanelInfoIcon,
	PanelSuccessIcon,
	PanelNoteIcon,
	PanelWarningIcon,
	PanelErrorIcon,
} from '@atlaskit/editor-common/icons';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import EmojiIcon from '@atlaskit/icon/core/emoji';
import TipIcon from '@atlaskit/icon/core/lightbulb';
import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import EmojiItem from './emoji';
import { PanelStyledCompiled } from './panel-compiled';
import { PanelStyledEmotion } from './panel-emotion';

export interface Props {
	allowCustomPanels?: boolean;
	children?: React.ReactNode;
	localId?: string;
	panelColor?: string;
	panelIcon?: string;
	panelIconId?: string;
	panelIconText?: string;
	panelType: PanelType;
	providers?: ProviderFactory;
}

const panelIcons: {
	[key in PanelType]: React.ComponentType<React.PropsWithChildren<{ label: string }>>;
} = {
	info: PanelInfoIcon,
	success: PanelSuccessIcon,
	note: PanelNoteIcon,
	tip: TipIcon,
	warning: PanelWarningIcon,
	error: PanelErrorIcon,
	custom: EmojiIcon,
};

const PanelStyledMigration = componentWithCondition(
	() => expValEquals('platform_editor_renderer_static_css', 'isEnabled', true),
	PanelStyledCompiled,
	PanelStyledEmotion,
);

const Panel = (props: Props): React.JSX.Element => {
	const {
		allowCustomPanels,
		panelType: type,
		panelColor,
		panelIcon,
		panelIconId,
		panelIconText,
		providers,
		children,
		localId,
	} = props;
	// only allow custom panel type if flag is set
	// otherwise fall back to info if custom panel is given
	const panelType = allowCustomPanels ? type : type === PanelType.CUSTOM ? PanelType.INFO : type;

	const getIcon = () => {
		if (panelType === PanelType.CUSTOM) {
			if (panelIcon && providers) {
				return (
					<EmojiItem
						id={panelIconId}
						text={panelIconText}
						shortName={panelIcon}
						providers={providers}
					/>
				);
			}

			return null;
		}

		const Icon = panelIcons[panelType];
		return <Icon label={`${panelType} panel`} />;
	};

	const icon = getIcon();

	const renderIcon = () => {
		if (icon) {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			return <div className={PanelSharedCssClassName.icon}>{icon}</div>;
		}
	};

	return (
		<PanelStyledMigration
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={PanelSharedCssClassName.prefix}
			data-local-id={localId}
			data-panel-type={panelType}
			data-panel-color={panelColor}
			data-panel-icon={panelIcon}
			data-panel-icon-id={panelIconId}
			data-panel-icon-text={panelIconText}
			backgroundColor={panelColor}
			hasIcon={Boolean(icon)}
		>
			{renderIcon()}
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
			<div className={PanelSharedCssClassName.content}>{children}</div>
		</PanelStyledMigration>
	);
};

export default Panel;
