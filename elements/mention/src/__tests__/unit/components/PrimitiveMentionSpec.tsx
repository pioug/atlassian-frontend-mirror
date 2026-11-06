import React from 'react';

import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import PrimitiveMention from '../../../components/Mention/PrimitiveMention';
import { MentionType } from '../../../types';

it.each([
	{ visuals: true, isRovoChat: true, styled: true },
	{ visuals: false, isRovoChat: true, styled: false },
	{ visuals: true, isRovoChat: false, styled: false },
	{ visuals: false, isRovoChat: false, styled: false },
])(
	'applies special colors with visuals=$visuals and Rovo=$isRovoChat',
	({ visuals, isRovoChat, styled }) => {
		(visuals ? mockExpEnabled : mockExpDisabled)('platform_editor_mention_rovo_special_visual');
		render(
			<PrimitiveMention
				data-testid="primitive"
				mentionType={MentionType.DEFAULT}
				isRovoChat={isRovoChat}
			>
				Rovo
			</PrimitiveMention>,
		);
		const className = screen.getByTestId('primitive').className;
		const styles = Array.from(document.styleSheets)
			.flatMap((sheet) => Array.from(sheet.cssRules))
			.filter((rule): rule is CSSStyleRule => 'selectorText' in rule)
			.filter((rule) => rule.selectorText.includes(`.${className}`))
			.map((rule) => rule.cssText)
			.join('');
		expect(styles.includes('--ds-background-neutral-bold')).toBe(styled);
		expect(styles.includes('--ds-background-neutral-bold-hovered')).toBe(styled);
		expect(styles.includes('--ds-background-neutral-bold-pressed')).toBe(styled);
		expect(styles.includes('--ds-text-inverse')).toBe(styled);
	},
);
