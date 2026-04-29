/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/** @jsxFrag */
import { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { jsx } from '@emotion/react';
import { FormattedMessage, useIntl } from 'react-intl';

import { getBrowserInfo } from '@atlaskit/editor-common/browser';
import { helpDialogMessages as messages } from '@atlaskit/editor-common/messages';
import Heading from '@atlaskit/heading';
import type { OnCloseHandler } from '@atlaskit/modal-dialog';
import { Text } from '@atlaskit/primitives/compiled';

import type { Format } from './Format';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';
import { column, content, contentWrapper, line, row } from './styles';
import { getComponentFromKeymap, shortcutNamesWithoutKeymap } from './utils';

interface ModalContentProps {
	formatting: Format[];
	onClose: OnCloseHandler | undefined;
}

export const ModalContent = ({ formatting, onClose }: ModalContentProps): jsx.JSX.Element => {
	const browser = getBrowserInfo();
	const intl = useIntl();
	return (
		<Fragment>
			<ModalHeader onClose={onClose} />
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={contentWrapper}
				tabIndex={0}
				role={'region'}
				aria-label={intl.formatMessage(messages.editorHelp)}
			>
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
							{/* eslint-disable-next-line @atlassian/perf-linting/no-expensive-computations-in-render -- Ignored via go/ees017 (to be fixed) */}
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

							{/* eslint-disable-next-line @atlassian/perf-linting/no-expensive-computations-in-render -- Ignored via go/ees017 (to be fixed) */}
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
							{/* eslint-disable-next-line @atlassian/perf-linting/no-expensive-computations-in-render -- Ignored via go/ees017 (to be fixed) */}
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
		</Fragment>
	);
};

export default ModalContent;
