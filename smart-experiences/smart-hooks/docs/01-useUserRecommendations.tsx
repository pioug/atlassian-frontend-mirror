import React from 'react';

import { AtlassianInternalWarning, Example, md, Props } from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}

  # useUserRecommendations

  Custom hook for interfacing with Platform user-ranked searching.

  Uses user-recommendations-service to retrieve users, reranked based on relevance.

  The hook also fires analytics to inform smart reranking for future interactions.

  For previous SmartUserPicker consumers, this hook is a drop-in replacement for the data
  layer of SmartUserPicker.

  ## Usage

  The useUserRecommendations hook can be used with any UI experience that deals with platform user searching.
  It works particularly well with experiences that benefit from relevance-based reranking, such as those
  involving repetitive interactions with a consistent set of users (e.g. Assignee field).

  ### with UserPicker

  Convert a @atlaskit/user-picker to a provider-backed user-picker using useUserRecommendations hook.

  ${(
		<Example
			packageName="@atlaskit/smart-hooks"
			Component={require('../examples/01-useUserRecommendations').default}
			title="useUserRecommendations with @atlaskit/user-picker"
			source={require('!!raw-loader!../examples/01-useUserRecommendations')}
		/>
	)}


  ${(
		<Props
			heading="useUserRecommendations Props"
			props={require('!!extract-react-types-loader!../src/services/use-user-recommendations')}
		/>
	)}

`;
