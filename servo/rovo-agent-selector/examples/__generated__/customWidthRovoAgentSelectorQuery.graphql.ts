/**
 * @generated SignedSource<<21579b8a026c3b586c92143266f0b577>>
 * @relayHash 93fdc21a486901feae2a0612801f4cc0
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 2d6f2a440e33d9c75f120eabcb413ed67caffabe6d5c631741dd0858543052a1

import type { ConcreteRequest, Query } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type customWidthRovoAgentSelectorQuery$variables = {
  cloudId: string;
  cloudIdString: string;
};
export type customWidthRovoAgentSelectorQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference">;
};
export type customWidthRovoAgentSelectorQuery = {
  response: customWidthRovoAgentSelectorQuery$data;
  variables: customWidthRovoAgentSelectorQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "cloudId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "cloudIdString"
  }
],
v1 = {
  "kind": "Variable",
  "name": "cloudId",
  "variableName": "cloudId"
},
v2 = {
  "kind": "ScalarField",
  "name": "__typename"
},
v3 = [
  {
    "kind": "Variable",
    "name": "cloudId",
    "variableName": "cloudIdString"
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 30
  },
  {
    "kind": "Literal",
    "name": "input",
    "value": {
      "onlyEditableAgents": true
    }
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "name": "customWidthRovoAgentSelectorQuery",
    "selections": [
      {
        "args": [
          (v1/*: any*/),
          {
            "kind": "Variable",
            "name": "cloudIdString",
            "variableName": "cloudIdString"
          }
        ],
        "kind": "FragmentSpread",
        "name": "rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference"
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "customWidthRovoAgentSelectorQuery",
    "selections": [
      {
        "args": [
          (v1/*: any*/)
        ],
        "kind": "LinkedField",
        "name": "atlassianStudio_userSiteContext",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "concreteType": "AtlassianStudioUserProductPermissions",
                "kind": "LinkedField",
                "name": "userPermissions",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "name": "isAbleToCreateAgents"
                  }
                ]
              }
            ],
            "type": "AtlassianStudioUserSiteContextOutput"
          }
        ]
      },
      {
        "args": (v3/*: any*/),
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
                  (v2/*: any*/)
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
        "args": (v3/*: any*/),
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
    "id": "2d6f2a440e33d9c75f120eabcb413ed67caffabe6d5c631741dd0858543052a1",
    "metadata": {},
    "name": "customWidthRovoAgentSelectorQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "0ba01b63c1906acd00e9b5e99b220e06";

export default node;
