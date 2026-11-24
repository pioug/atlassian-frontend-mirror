/**
 * @generated SignedSource<<93463746bc6a61c04587823ba1e957ea>>
 * @relayHash 9608ff2fc7403705c9b445abd3e91477
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 86dd125d287a6c1338bcea956b5eeb07d1db1ddb9300ec0afbaed8f9b977e202

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AgentStudioAgentCreatorType = "CODE_REVIEWER" | "CUSTOMER" | "FORGE" | "GUIDED" | "OOTB" | "REMOTE_A2A" | "ROVO_CHAT" | "ROVO_DEV" | "%future added value";
export type AgentStudioAgentQueryInput = {
  creatorTypes?: ReadonlyArray<AgentStudioAgentCreatorType> | null;
  includeDraftAgents?: boolean | null;
  includeJiraCodingAgent?: boolean | null;
  includeRovoChatAgent?: boolean | null;
  name?: string | null;
  onlyCodingAgents?: boolean | null;
  onlyEditableAgents?: boolean | null;
  onlyFavouriteAgents?: boolean | null;
  onlyMyAgents?: boolean | null;
  onlyPublishedEditableAgents?: boolean | null;
  onlyPublishedEditableAgentsWithForge?: boolean | null;
  onlyTagKeys?: ReadonlyArray<string> | null;
  onlyTemplateAgents?: boolean | null;
  onlyUnpublishedAgents?: boolean | null;
  onlyVerifiedAgents?: boolean | null;
};
export type rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery$variables = {
  after?: string | null;
  cloudIdString: string;
  enableAgentCreationFix: boolean;
  first?: number | null;
  input?: AgentStudioAgentQueryInput | null;
};
export type rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector">;
};
export type rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery = {
  response: rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery$data;
  variables: rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery$variables;
};
({
  "enableAgentCreationFix": enableAgentCreationFix_provider,
  "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider": enableAgentCreationFix_provider
} as {
  readonly __relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider: {
    readonly get: () => boolean;
  };
  readonly enableAgentCreationFix: {
    readonly get: () => boolean;
  };
});

import enableAgentCreationFix_provider from '@atlaskit/rovo-agent-selector/hubs-management-rovo-agent-creation-fix.relayprovider';

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cloudIdString"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "enableAgentCreationFix"
},
v3 = {
  "defaultValue": 30,
  "kind": "LocalArgument",
  "name": "first"
},
v4 = {
  "defaultValue": {
    "onlyEditableAgents": true
  },
  "kind": "LocalArgument",
  "name": "input"
},
v5 = {
  "kind": "Variable",
  "name": "after",
  "variableName": "after"
},
v6 = {
  "kind": "Variable",
  "name": "first",
  "variableName": "first"
},
v7 = {
  "kind": "Variable",
  "name": "input",
  "variableName": "input"
},
v8 = [
  (v5/*: any*/),
  {
    "kind": "Variable",
    "name": "cloudId",
    "variableName": "cloudIdString"
  },
  (v6/*: any*/),
  (v7/*: any*/)
],
v9 = {
  "kind": "ScalarField",
  "name": "__typename"
},
v10 = {
  "kind": "ScalarField",
  "name": "id"
},
v11 = [
  {
    "kind": "ScalarField",
    "name": "name"
  },
  {
    "kind": "ScalarField",
    "name": "externalConfigReference"
  },
  {
    "kind": "ScalarField",
    "name": "identityAccountId"
  },
  {
    "kind": "ScalarField",
    "name": "creatorType"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "name": "rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery",
    "selections": [
      {
        "args": [
          (v5/*: any*/),
          {
            "kind": "Variable",
            "name": "cloudIdString",
            "variableName": "cloudIdString"
          },
          (v6/*: any*/),
          (v7/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "rovoAgentSelector_AtlaskitRovoAgentSelector"
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      {
        "defaultValue": null,
        "kind": "LocalArgument",
        "name": "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider"
      }
    ],
    "kind": "Operation",
    "name": "rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery",
    "selections": [
      {
        "args": (v8/*: any*/),
        "concreteType": "AgentStudioAgentsConnection",
        "kind": "LinkedField",
        "name": "agentStudio_getAgents",
        "plural": false,
        "selections": [
          {
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "name": "hasNextPage"
              },
              {
                "kind": "ScalarField",
                "name": "endCursor"
              }
            ]
          },
          {
            "concreteType": "AgentStudioAgentEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "concreteType": "AgentStudioAssistant",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "name": "identityAccount",
                    "plural": false,
                    "selections": [
                      (v9/*: any*/),
                      {
                        "kind": "ScalarField",
                        "name": "picture"
                      },
                      (v10/*: any*/)
                    ]
                  },
                  (v10/*: any*/),
                  (v9/*: any*/),
                  {
                    "condition": "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider",
                    "kind": "Condition",
                    "passingValue": false,
                    "selections": (v11/*: any*/)
                  },
                  {
                    "condition": "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider",
                    "kind": "Condition",
                    "passingValue": true,
                    "selections": (v11/*: any*/)
                  }
                ]
              },
              {
                "kind": "ScalarField",
                "name": "cursor"
              }
            ]
          }
        ]
      },
      {
        "args": (v8/*: any*/),
        "filters": [
          "cloudId",
          "input"
        ],
        "handle": "connection",
        "key": "RovoAgent_agentStudio_getAgents",
        "kind": "LinkedHandle",
        "name": "agentStudio_getAgents"
      }
    ]
  },
  "params": {
    "id": "86dd125d287a6c1338bcea956b5eeb07d1db1ddb9300ec0afbaed8f9b977e202",
    "metadata": {},
    "name": "rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery",
    "operationKind": "query",
    "text": null,
    "providedVariables": {
      "enableAgentCreationFix": enableAgentCreationFix_provider,
      "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider": enableAgentCreationFix_provider
    }
  }
};
})();

(node as any).hash = "8898283636f551cbf95680664a804dcc";

export default node;
