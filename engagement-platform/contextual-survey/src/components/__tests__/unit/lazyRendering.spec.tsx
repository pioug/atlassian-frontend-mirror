import React from 'react';

import { render } from '@testing-library/react';

import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

import SurveyMarshal from '../../SurveyMarshal';

it.each([
	{ enablePlatformContextualSurveyUseAtlaskitMotion: false },
	{ enablePlatformContextualSurveyUseAtlaskitMotion: true },
])(
	'should not render anything when not open',
	({ enablePlatformContextualSurveyUseAtlaskitMotion }) => {
		setBooleanFeatureFlagResolver((flag) => {
			if (flag === 'platform_contextual_survey_use_atlaskit_motion') {
				return enablePlatformContextualSurveyUseAtlaskitMotion;
			}
			return false;
		});

		const mock = jest.fn().mockImplementation(() => null);
		render(<SurveyMarshal shouldShow={false}>{mock}</SurveyMarshal>);

		expect(mock).not.toHaveBeenCalled();
	},
);

it.each([
	{ enablePlatformContextualSurveyUseAtlaskitMotion: false },
	{ enablePlatformContextualSurveyUseAtlaskitMotion: true },
])('should render the form when open', ({ enablePlatformContextualSurveyUseAtlaskitMotion }) => {
	setBooleanFeatureFlagResolver((flag) => {
		if (flag === 'platform_contextual_survey_use_atlaskit_motion') {
			return enablePlatformContextualSurveyUseAtlaskitMotion;
		}
		return false;
	});

	const mock = jest.fn().mockImplementation(() => null);
	render(<SurveyMarshal shouldShow>{mock}</SurveyMarshal>);

	expect(mock).toHaveBeenCalled();
});
