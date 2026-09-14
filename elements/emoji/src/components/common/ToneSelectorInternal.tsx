/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { css, jsx } from '@compiled/react';
import { useIntl } from 'react-intl';

import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next/withAnalyticsEvents';
import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';

import type { EmojiDescription, EmojiDescriptionWithVariations, ToneValueType } from '../../types';
import { createAndFireEventInElementsChannel } from '../../util/analytics/analytics';
import { toneSelectedEvent } from '../../util/analytics/toneSelectedEvent';
import { toneSelectorOpenedEvent } from '../../util/analytics/toneSelectorOpenedEvent';
import { messages } from '../i18n';
import EmojiRadioButton from './EmojiRadioButton';
import { toneSelectorTestId } from './ToneSelector';
import type { Props } from './ToneSelector';
import { setSkinToneAriaLabelText } from './setSkinToneAriaLabelText';
import { isRefreshEmojiPickerEnabled } from './isRefreshEmojiPickerEnabled';

const hidden = css({
	opacity: 0,
	visibility: 'hidden',
	display: 'none',
});

const extractAllTones = (emoji: EmojiDescriptionWithVariations): EmojiDescription[] => {
	if (emoji.skinVariations) {
		return [emoji, ...emoji.skinVariations];
	}
	return [emoji];
};

type PropsWithAnalyticsEventsPropsType = Props & WithAnalyticsEventsProps;

export const ToneSelectorInternal = (props: PropsWithAnalyticsEventsPropsType): JSX.Element => {
	const { createAnalyticsEvent, emoji, onToneSelected, onToneClose, selectedTone, isVisible } =
		props;
	const isMounted = useRef(false);
	const selectedToneRadioRef = useRef<HTMLInputElement>(null);
	// Refs for all radio inputs — used for FG-gated arrow-key focus management
	const radioRefs = useRef<(HTMLInputElement | null)[]>([]);
	const { formatMessage } = useIntl();

	const emojiToneCollection = useMemo(() => {
		var selectedToneIndex: number = -1;
		const toneColletion = extractAllTones(emoji).map((tone, index) => {
			const isSelected = index === selectedTone;
			if (isSelected) {
				selectedToneIndex = index;
			}
			return {
				...tone,
				isSelected: isSelected,
				label: setSkinToneAriaLabelText(tone.name),
				toneIndex: index,
			};
		});

		// push description of selected tone to the end of the array
		// so that it gets rendered last/rightmost
		toneColletion.push(toneColletion.splice(selectedToneIndex, 1)[0]);

		return toneColletion;
	}, [emoji, selectedTone]);

	useEffect(() => {
		if (isVisible) {
			selectedToneRadioRef.current?.focus();
		}
	}, [isVisible, selectedToneRadioRef]);

	const fireAnalyticsEvent = (event: AnalyticsEventPayload) => {
		if (createAnalyticsEvent) {
			createAndFireEventInElementsChannel(event)(createAnalyticsEvent);
		}
	};

	const onArrowKey = useCallback((currentIndex: number, direction: -1 | 1) => {
		const len = radioRefs.current.length;
		const nextIndex = (currentIndex + direction + len) % len;
		radioRefs.current[nextIndex]?.focus();
	}, []);

	const onToneSelectedHandler = (toneValue: ToneValueType) => () => {
		if (selectedTone === toneValue && onToneClose) {
			onToneClose();
			return;
		}

		onToneSelected(toneValue);

		const toneList = ['default', 'light', 'mediumLight', 'medium', 'mediumDark', 'dark'];

		fireAnalyticsEvent(
			toneSelectedEvent({
				skinToneModifier: toneList[toneValue],
			}),
		);
	};

	if (!isMounted.current) {
		fireAnalyticsEvent(toneSelectorOpenedEvent({}));
	}

	isMounted.current = true;

	return (
		<div
			role="radiogroup"
			data-testid={toneSelectorTestId}
			id="emoji-picker-tone-selector"
			aria-label={formatMessage(messages.emojiSelectSkinToneListAriaLabelText)}
			css={!isVisible && hidden}
		>
			{emojiToneCollection.map((tone, renderIndex) => {
				return isRefreshEmojiPickerEnabled() ? (
					<EmojiRadioButton
						ref={(el) => {
							radioRefs.current[renderIndex] = el;
							if (tone.isSelected && selectedToneRadioRef) {
								(selectedToneRadioRef as React.MutableRefObject<HTMLInputElement | null>).current =
									el;
							}
						}}
						defaultChecked={tone.isSelected}
						ariaLabelText={tone.label}
						key={`${tone.id}`}
						emoji={tone}
						onArrowKey={(direction) => onArrowKey(renderIndex, direction)}
						onSelected={onToneSelectedHandler(tone.toneIndex)}
						selectOnHover
					/>
				) : (
					<EmojiRadioButton
						ref={tone.isSelected ? selectedToneRadioRef : null}
						defaultChecked={tone.isSelected}
						ariaLabelText={tone.label}
						key={`${tone.id}`}
						emoji={tone}
						onSelected={onToneSelectedHandler(tone.toneIndex)}
						selectOnHover
					/>
				);
			})}
		</div>
	);
};
