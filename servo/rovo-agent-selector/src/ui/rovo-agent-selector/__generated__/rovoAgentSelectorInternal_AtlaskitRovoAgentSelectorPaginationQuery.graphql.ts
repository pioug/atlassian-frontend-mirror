/**
 * @generated SignedSource<<91fadf86ea86a473e252405bf65cdd63>>
 * @relayHash d34bf472df601be344a6a0d0ad2f3c21
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 3fa57598cb745b1f18c5165a30d9222b6cf1c721829715f13f10c77f8193b6b1

import type { ConcreteRequest, Query } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AgentStudioAgentQueryInput = {
  name?: string | null | undefined;
  onlyEditableAgents?: boolean | null | undefined;
  onlyFavouriteAgents?: boolean | null | undefined;
  onlyMyAgents?: boolean | null | undefined;
  onlyTemplateAgents?: boolean | null | undefined;
};
export type rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery$variables = {
  after?: string | null | undefined;
  cloudIdString: string;
  first?: number | null | undefined;
  input?: AgentStudioAgentQueryInput | null | undefined;
};
export type rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector_RovoAgentSelectorInternal_fragmentReference">;
};
export type rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery = {
  response: rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery$data;
  variables: rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "after"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "cloudIdString"
  },
  {
    "defaultValue": 30,
    "kind": "LocalArgument",
    "name": "first"
  },
  {
    "defaultValue": {
      "onlyEditableAgents": true
    },
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = {
  "kind": "Variable",
  "name": "after",
  "variableName": "after"
},
v2 = {
  "kind": "Variable",
  "name": "first",
  "variableName": "first"
},
v3 = {
  "kind": "Variable",
  "name": "input",
  "variableName": "input"
},
v4 = [
  (v1/*: any*/),
  {
    "kind": "Variable",
    "name": "cloudId",
    "variableName": "cloudIdString"
  },
  (v2/*: any*/),
  (v3/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "name": "rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery",
    "selections": [
      {
        "args": [
          (v1/*: any*/),
          {
            "kind": "Variable",
            "name": "cloudIdString",
            "variableName": "cloudIdString"
          },
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "rovoAgentSelector_AtlaskitRovoAgentSelector_RovoAgentSelectorInternal_fragmentReference"
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery",
    "selections": [
      {
        "args": (v4/*: any*/),
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
                    "kind": "ScalarField",
                    "name": "id"
                  },
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
                  },
                  {
                    "kind": "ScalarField",
                    "name": "__typename"
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
        "args": (v4/*: any*/),
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
    "id": "3fa57598cb745b1f18c5165a30d9222b6cf1c721829715f13f10c77f8193b6b1",
    "metadata": {},
    "name": "rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "141f12bb1550c1602033f3e2a0d7adfc";

export default node;
