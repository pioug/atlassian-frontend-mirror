/**
 * @generated SignedSource<<a5435352f3d8a8d5c79e9c07b1c4fe33>>
 * @relayHash 3b0f1687d8cc89a312aa0e46a133624b
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 3cc43bc32ca9f61c9a9b13d844ead02a116d206f1960cd4422b0a17239e78299

import type { ConcreteRequest, Query } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AgentStudioAgentQueryInput = {
  name?: string | null | undefined;
  onlyEditableAgents?: boolean | null | undefined;
  onlyFavouriteAgents?: boolean | null | undefined;
  onlyMyAgents?: boolean | null | undefined;
  onlyTemplateAgents?: boolean | null | undefined;
};
export type rovoAgentSelector_AtlaskitRovoAgentSelectorPaginationQuery$variables = {
  after?: string | null | undefined;
  cloudId: string;
  first?: number | null | undefined;
  input?: AgentStudioAgentQueryInput | null | undefined;
};
export type rovoAgentSelector_AtlaskitRovoAgentSelectorPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector">;
};
export type rovoAgentSelector_AtlaskitRovoAgentSelectorPaginationQuery = {
  response: rovoAgentSelector_AtlaskitRovoAgentSelectorPaginationQuery$data;
  variables: rovoAgentSelector_AtlaskitRovoAgentSelectorPaginationQuery$variables;
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
    "name": "cloudId"
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
v1 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  {
    "kind": "Variable",
    "name": "cloudId",
    "variableName": "cloudId"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  },
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "name": "rovoAgentSelector_AtlaskitRovoAgentSelectorPaginationQuery",
    "selections": [
      {
        "args": (v1/*: any*/),
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
    "name": "rovoAgentSelector_AtlaskitRovoAgentSelectorPaginationQuery",
    "selections": [
      {
        "args": (v1/*: any*/),
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
        "args": (v1/*: any*/),
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
    "id": "3cc43bc32ca9f61c9a9b13d844ead02a116d206f1960cd4422b0a17239e78299",
    "metadata": {},
    "name": "rovoAgentSelector_AtlaskitRovoAgentSelectorPaginationQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "d7bdd1e2dc939a818cdc008295748109";

export default node;
