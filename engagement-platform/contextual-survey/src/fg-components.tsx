import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { default as CompiledContextualSurvey } from './compiled/ContextualSurvey';
import { default as CompiledSurveyMarshal } from './compiled/SurveyMarshal';
// exported props for FG check
import {
	type Props as ContextualSurveyProps,
	default as EmotionContextualSurvey,
} from './components/ContextualSurvey';
import {
	default as EmotionSurveyMarshal,
	type Props as SurveyMarshalProps,
} from './components/SurveyMarshal';

export const ContextualSurvey = (props: ContextualSurveyProps) =>
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	fg('platform_contextual_survey_enable_compiled_fg') ? (
		<CompiledContextualSurvey {...props} />
	) : (
		<EmotionContextualSurvey {...props} />
	);

export const SurveyMarshal = (props: SurveyMarshalProps) =>
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	fg('platform_contextual_survey_enable_compiled_fg') ? (
		<CompiledSurveyMarshal {...props} />
	) : (
		<EmotionSurveyMarshal {...props} />
	);
