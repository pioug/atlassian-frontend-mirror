import React from 'react';
import { md, Example, Props, code, AtlassianInternalWarning } from '@atlaskit/docs';

import TaskDecisionExample from '../examples/00-decision-item';
const TaskDecisionSource = require('!!raw-loader!../examples/00-decision-item');

const TaskDecisionProps = require('!!extract-react-types-loader!../src/components/DecisionItem');

const _default_1: any = md`
  ${(<AtlassianInternalWarning />)}

  This component provides components for rendering tasks and decisions.

  ## Usage

  Use the component in your React app as follows:

  ${code`
  import { DecisionList, DecisionItem } from '@atlaskit/task-decision';
  ReactDOM.render(<DecisionItem>A decision</DecisionItem>, container);
  ReactDOM.render(
    <DecisionList>
      <DecisionItem>A decision</DecisionItem>
      <DecisionItem>Another decision</DecisionItem>
    </DecisionList>,
    container,
  );
   };`}

   ${(
			<Example
				packageName="@atlaskit/status"
				Component={TaskDecisionExample}
				title="Status Picker"
				source={TaskDecisionSource}
			/>
		)}

  ${(<Props heading="Decision Props" props={TaskDecisionProps} />)}
`;
export default _default_1;
// TODO: Add more information for task.
