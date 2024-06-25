import React, { type FC, type ReactNode } from 'react';

import AnimateHeight from 'react-animate-height';
import { defineMessages, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

import * as styles from './styledPanel';

const i18n = defineMessages({
	collapse: {
		id: 'bitbucket.panel-collapse.message',
		defaultMessage: 'collapse',
		description: 'Label on the panel to signal that the user can collapse the panel.',
	},
	expand: {
		id: 'bitbucket.panel-expand.message',
		defaultMessage: 'expand',
		description: 'Label on the panel to signal that the user can expand the panel.',
	},
});

export type BasePanelProps = {
	/** Content to be shown inside the panel. */
	children?: ReactNode;
	/** Header to render on the panel. Clicking the header expands and collapses the panel */
	header?: ReactNode;
};

type PanelState = BasePanelProps & {
	/** Defines whether the panel is expanded by default. */
	isExpanded: boolean;
	/** This callback is called when panel is expanded/collapsed */
	onChange: (isExpanded: boolean) => void;
};

const PanelStateless: FC<PanelState> = ({ children, header, isExpanded = false, onChange }) => {
	const intl = useIntl();
	const i18nExpandText = intl.formatMessage(i18n.expand);
	const i18nCollapseText = intl.formatMessage(i18n.collapse);

	return (
		<styles.PanelWrapper>
			<styles.PanelHeader onClick={() => onChange(!isExpanded)}>
				<styles.ButtonWrapper isHidden={isExpanded}>
					<Button
						appearance="subtle"
						aria-expanded={isExpanded}
						spacing="none"
						iconBefore={
							isExpanded ? (
								<ChevronDownIcon label={i18nCollapseText} />
							) : (
								<ChevronRightIcon label={i18nExpandText} />
							)
						}
					/>
				</styles.ButtonWrapper>
				<span>{header}</span>
			</styles.PanelHeader>
			<AnimateHeight
				duration={200}
				easing="linear"
				height={isExpanded ? 'auto' : 0}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className="panel-content"
			>
				{children}
			</AnimateHeight>
		</styles.PanelWrapper>
	);
};

export default PanelStateless;
