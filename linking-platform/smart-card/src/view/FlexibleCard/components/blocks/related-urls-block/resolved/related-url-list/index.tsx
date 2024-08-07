import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl-next';

import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/utility/migration/chevron-up';
import { Inline, Pressable, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { messages } from '../../../../../../../messages';
import { getFormattedMessageAsString } from '../../../../../components/utils';
import Text from '../../../../elements/text';
import { type ResolvedResultProps } from './types';
import ResolvedResultsStack from './resolved-result-stack';

const RelatedUrlList = ({
	resolvedResults,
	title,
	renderers,
	testId,
	initializeOpened,
}: ResolvedResultProps) => {
	const [isOpen, setIsOpen] = useState(initializeOpened);
	const chevronClickHandler = useCallback(() => setIsOpen(!isOpen), [isOpen]);
	const ChevronComponent = isOpen ? ChevronUpIcon : ChevronDownIcon;
	const intl = useIntl();

	return resolvedResults.length > 0 ? (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<Stack testId={testId} xcss={xcss({ width: '100%' })}>
			<Pressable
				onClick={chevronClickHandler}
				testId={`${testId}-expand-title`}
				backgroundColor="color.background.neutral.subtle"
				aria-expanded={!!isOpen}
				padding="space.0"
				paddingInlineEnd="space.050"
			>
				<Inline alignBlock="center" space="space.050" spread="space-between">
					<Text
						overrideCss={css({
							fontWeight: token('font.weight.medium', '500'),
						})}
						message={{ descriptor: title }}
					/>
					<ChevronComponent
						LEGACY_margin="0 -4px"
						label={getFormattedMessageAsString(intl, title)}
						color="currentColor"
					/>
				</Inline>
			</Pressable>
			{isOpen && (
				<ResolvedResultsStack
					resolvedResults={resolvedResults}
					testId={testId}
					renderers={renderers}
				/>
			)}
		</Stack>
	) : (
		<Text testId={testId} message={{ descriptor: messages.related_work_items_not_found }} />
	);
};

export default RelatedUrlList;
