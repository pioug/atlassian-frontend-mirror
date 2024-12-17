/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { type ContentProps } from '../types';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/design-system/no-css-tagged-template-expression -- Ignored via go/DSP-18766
export const formWrapperStyle = css`
	[class^='FormHeader__FormHeaderWrapper'] {
		h1:first-child {
			font: ${token('font.heading.small')};
			margin-top: ${token('space.300')};

			> span {
				/* jira has a class override font settings on h1 > span in gh-custom-field-pickers.css */
				font-size: inherit !important;
				line-height: inherit !important;
				letter-spacing: inherit !important;
			}
		}
	}

	[class^='FormSection__FormSectionWrapper'] {
		margin-top: ${token('space.0', '0px')};
	}

	[class^='FormFooter__FormFooterWrapper'] {
		justify-content: space-between;
		margin-top: ${token('space.150', '12px')};
		margin-bottom: ${token('space.300', '24px')};
	}

	[class^='Field__FieldWrapper']:not(:first-child) {
		margin-top: ${token('space.150', '12px')};
	}
`;

export type IntegrationFormProps = {
	Content: React.ComponentType<ContentProps> | null;
	onIntegrationClose?: () => void;
	changeTab?: (index: number) => void;
};

export const IntegrationForm = ({
	Content,
	onIntegrationClose = () => undefined,
	changeTab = () => undefined,
}: IntegrationFormProps) => (
	<div css={formWrapperStyle}>
		{Content && <Content onClose={onIntegrationClose} changeTab={changeTab} />}
	</div>
);
