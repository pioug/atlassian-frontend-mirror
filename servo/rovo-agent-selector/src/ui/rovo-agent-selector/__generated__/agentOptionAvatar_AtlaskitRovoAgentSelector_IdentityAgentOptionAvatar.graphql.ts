/**
 * @generated SignedSource<<953530c9d35fb78f8f0e33caa791bee4>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar$data = {
  readonly identityAccount?: {
    readonly picture: AGG$URL;
  } | null;
  readonly " $fragmentType": "agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar";
};
export type agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar$key = {
  readonly " $data"?: agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar$data;
  readonly " $fragmentSpreads": FragmentRefs<"agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "__relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx"
    }
  ],
  "kind": "Fragment",
  "name": "agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar",
  "selections": [
    {
      "condition": "__relay_internal__pv__migrateagentavatarcomponenttoadsrelayprovidertsx",
      "kind": "Condition",
      "passingValue": true,
      "selections": [
        {
          "kind": "LinkedField",
          "name": "identityAccount",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "name": "picture"
            }
          ]
        }
      ]
    }
  ],
  "type": "AgentStudioAssistant"
};

(node as any).hash = "6b03891b612b75595ddf55d1177cf1e6";

export default node;
