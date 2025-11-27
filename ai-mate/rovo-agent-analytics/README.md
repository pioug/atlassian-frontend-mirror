# RovoAgentAnalytics

Rovo Agents analytics

## Usage

`import RovoAgentAnalytics from '@atlaskit/rovo-agent-analytics';`

Detailed docs and example usage can be found
[here](https://atlaskit.atlassian.com/packages/ai-mate/rovo-agent-analytics).

## Examples

```
import { useRovoAgentActionAnalytics, AgentActions } from '@atlaskit/rovo-agent-analytics';

const { trackAgentAction } = useRovoAgentActionAnalytics({
	agentId,
	canEdit,
	touchPoint: 'browse-agent-list'
});

trackAgentAction(AgentActions.DUPLICATE);
```
