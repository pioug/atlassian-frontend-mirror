/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/** @jsxFrag */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { browser } from '@atlaskit/editor-common/browser';
import { helpDialogMessages as messages } from '@atlaskit/editor-common/messages';
import Heading from '@atlaskit/heading';
import type { OnCloseHandler } from '@atlaskit/modal-dialog';
import { Text } from '@atlaskit/primitives';

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
	return (
		<>
			<ModalHeader onClose={onClose} />
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
			<div css={contentWrapper}>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<div css={line} />
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<div css={content}>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<div css={column}>
						<Heading size="medium">
							<FormattedMessage {...messages.keyboardShortcuts} />
						</Heading>
						<ul>
							{formatting
								.filter((form) => {
									const keymap = form.keymap && form.keymap();
									return keymap && keymap[browser.mac ? 'mac' : 'windows'];
								})
								.map((form) => (
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
									<li css={row} key={`textFormatting-${form.name}`}>
										<Text>{form.name}</Text>
										{getComponentFromKeymap(form.keymap!())}
									</li>
								))}

							{formatting
								.filter((form) => shortcutNamesWithoutKeymap.indexOf(form.type) !== -1)
								.filter((form) => form.autoFormatting)
								.map((form) => (
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
									<li css={row} key={`autoFormatting-${form.name}`}>
										<Text>{form.name}</Text>
										{form.autoFormatting!()}
									</li>
								))}
						</ul>
					</div>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<div css={line} />
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<div css={column}>
						<Heading size="medium">
							<FormattedMessage {...messages.markdown} />
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
