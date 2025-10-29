/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/** @jsxFrag */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import { helpDialogMessages as messages } from '@atlaskit/editor-common/messages';
import Heading from '@atlaskit/heading';
import type { OnCloseHandler } from '@atlaskit/modal-dialog';
import { Text } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { Format } from './Format';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';
import { column, content, contentWrapper, line, row } from './styles';
import { getComponentFromKeymap, shortcutNamesWithoutKeymap } from './utils';

interface ModalContentProps {
	formatting: Format[];
	onClose: OnCloseHandler | undefined;
}

export const ModalContent = ({ formatting, onClose }: ModalContentProps) => {
	const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
		? getBrowserInfo()
		: browserLegacy;
	return (
		<>
			<ModalHeader onClose={onClose} />
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage, @atlassian/a11y/no-noninteractive-tabindex -- Ignored via go/DSP-18766 */}
			<div css={contentWrapper} tabIndex={0}>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<div css={line} />
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<div css={content}>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<div css={column}>
						<Heading size="medium">
							<FormattedMessage
								// Ignored via go/ees005
								// eslint-disable-next-line react/jsx-props-no-spreading
								{...messages.keyboardShortcuts}
							/>
						</Heading>
						<ul>
							{formatting
								.filter((form) => {
									const keymap = form.keymap && form.keymap();
									return keymap && keymap[browser.mac ? 'mac' : 'windows'];
								})
								.map((form) => {
									// Ignored via go/ees005
									// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
									const keymap = form.keymap!;
									return (
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
										<li css={row} key={`textFormatting-${form.name}`}>
											<Text>{form.name}</Text>
											{getComponentFromKeymap(keymap())}
										</li>
									);
								})}

							{formatting
								.filter((form) => shortcutNamesWithoutKeymap.indexOf(form.type) !== -1)
								.filter((form) => form.autoFormatting)
								.map((form) => {
									// Ignored via go/ees005
									// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
									const autoFormatting = form.autoFormatting!;
									return (
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
										<li css={row} key={`autoFormatting-${form.name}`}>
											<Text>{form.name}</Text>
											{autoFormatting()}
										</li>
									);
								})}
						</ul>
					</div>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<div css={line} />
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<div css={column}>
						<Heading size="medium">
							<FormattedMessage
								// Ignored via go/ees005
								// eslint-disable-next-line react/jsx-props-no-spreading
								{...messages.markdown}
							/>
						</Heading>
						<ul>
							{formatting
								.filter((form) => shortcutNamesWithoutKeymap.indexOf(form.type) === -1)
								.map(
									(form) =>
										form.autoFormatting && (
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
											<li key={`autoFormatting-${form.name}`} css={row}>
												<span>{form.name}</span>
												{form.autoFormatting()}
											</li>
										),
								)}
						</ul>
					</div>
				</div>
			</div>
			<ModalFooter />
		</>
	);
};

export default ModalContent;
