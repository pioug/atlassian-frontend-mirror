/**
 * @generated SignedSource<<9008dd06ba11a7ec23e19aa1d7c635e4>>
 * @relayHash 10df1400fe5f08dbb71223dbeb55d5d0
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 7250b40e01559cc3a01468d2f306020d55d0c1feef70d34478073a59ab3f8154

import type { ConcreteRequest, Query } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AgentStudioAgentQueryInput = {
  includeDraftAgents?: boolean | null | undefined;
  name?: string | null | undefined;
  onlyEditableAgents?: boolean | null | undefined;
  onlyFavouriteAgents?: boolean | null | undefined;
  onlyMyAgents?: boolean | null | undefined;
  onlyTemplateAgents?: boolean | null | undefined;
  onlyVerifiedAgents?: boolean | null | undefined;
};
export type rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery$variables = {
  after?: string | null | undefined;
  cloudIdString: string;
  first?: number | null | undefined;
  input?: AgentStudioAgentQueryInput | null | undefined;
};
export type rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector">;
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
        "name": "rovoAgentSelector_AtlaskitRovoAgentSelector"
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
    "id": "7250b40e01559cc3a01468d2f306020d55d0c1feef70d34478073a59ab3f8154",
    "metadata": {},
    "name": "rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "a4b2382014625df84010cab1cb3005ca";

export default node;
