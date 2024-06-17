/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type CSSObject, jsx } from '@emotion/react';
import { render, screen } from '@testing-library/react';

import { CustomThemeButton, type CustomThemeButtonProps } from '../../../../index';
import { hasStyleRule } from '../../_util/style-rules';

const additions: CSSObject = {
	width: '100px',
	height: '200px',
	margin: '20px',
};

const OurButton = (props: CustomThemeButtonProps) => (
	<CustomThemeButton
		testId="button"
		// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
		theme={(current, themeProps) => {
			const { buttonStyles, spinnerStyles } = current(themeProps);
			return {
				buttonStyles: {
					...buttonStyles,
					...additions,
				},
				spinnerStyles: spinnerStyles,
			};
		}}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	/>
);

it('should render button styles defined in custom theme', () => {
	render(<OurButton>Save</OurButton>);

	const button = screen.getByTestId('button');

	expect(hasStyleRule(`.${button.className}`, additions)).toBe(true);
});

it('should render button styles defined in ADG theme if no custom theme passed in', () => {
	render(<CustomThemeButton testId="button">Save</CustomThemeButton>);

	const button = screen.getByTestId('button');

	expect(hasStyleRule(`.${button.className}`, { display: 'inline-flex' })).toBe(true);
});
