/**
 * @generated SignedSource<<b5dd495e526095e66bf7c72140a7e1b8>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type rovoAgentSelector_AtlaskitRovoAgentSelector$data = {
  readonly agentStudio_getAgents: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly creatorType?: string | null;
        readonly externalConfigReference?: string | null;
        readonly id?: string;
        readonly identityAccountId?: string | null;
        readonly name?: string | null;
        readonly selectorAgent?: {
          readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_agent">;
        } | null;
        readonly " $fragmentSpreads": FragmentRefs<"agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar">;
      } | null;
    }>;
    readonly pageInfo: {
      readonly endCursor: string | null;
      readonly hasNextPage: boolean;
    };
  } | null;
  readonly " $fragmentType": "rovoAgentSelector_AtlaskitRovoAgentSelector";
};
export type rovoAgentSelector_AtlaskitRovoAgentSelector$key = {
  readonly " $data"?: rovoAgentSelector_AtlaskitRovoAgentSelector$data;
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector">;
};

import rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery_graphql from './rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "agentStudio_getAgents"
],
v1 = {
  "kind": "ScalarField",
  "name": "id"
},
v2 = {
  "kind": "ScalarField",
  "name": "name"
},
v3 = {
  "kind": "ScalarField",
  "name": "externalConfigReference"
},
v4 = {
  "kind": "ScalarField",
  "name": "identityAccountId"
},
v5 = {
  "kind": "ScalarField",
  "name": "creatorType"
},
v6 = {
  "kind": "FragmentSpread",
  "name": "agentOptionAvatar_AtlaskitRovoAgentSelector_IdentityAgentOptionAvatar"
};
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider"
    },
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
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "first",
        "cursor": "after",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "first",
          "cursor": "after"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [],
      "operation": rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery_graphql
    }
  },
  "name": "rovoAgentSelector_AtlaskitRovoAgentSelector",
  "selections": [
    {
      "alias": "agentStudio_getAgents",
      "args": [
        {
          "kind": "Variable",
          "name": "cloudId",
          "variableName": "cloudIdString"
        },
        {
          "kind": "Variable",
          "name": "input",
          "variableName": "input"
        }
      ],
      "concreteType": "AgentStudioAgentsConnection",
      "kind": "LinkedField",
      "name": "__RovoAgent_agentStudio_getAgents_connection",
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
                  "condition": "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider",
                  "kind": "Condition",
                  "passingValue": false,
                  "selections": [
                    (v1/*: any*/),
                    (v2/*: any*/),
                    (v3/*: any*/),
                    (v4/*: any*/),
                    (v5/*: any*/)
                  ]
                },
                (v6/*: any*/),
                {
                  "condition": "__relay_internal__pv__atlaskitrovoagentselectorhubsmanagementrovoagentcreationfixrelayprovider",
                  "kind": "Condition",
                  "passingValue": true,
                  "selections": [
                    {
                      "fragment": {
                        "kind": "InlineFragment",
                        "selections": [
                          {
                            "kind": "InlineDataFragmentSpread",
                            "name": "rovoAgentSelector_agent",
                            "selections": [
                              (v1/*: any*/),
                              (v2/*: any*/),
                              (v3/*: any*/),
                              (v4/*: any*/),
                              (v5/*: any*/),
                              (v6/*: any*/)
                            ],
                            "argumentDefinitions": []
                          }
                        ],
                        "type": "AgentStudioAssistant"
                      },
                      "kind": "AliasedInlineFragmentSpread",
                      "name": "selectorAgent"
                    }
                  ]
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
    }
  ],
  "type": "Query"
};
})();

(node as any).hash = "8898283636f551cbf95680664a804dcc";

export default node;
