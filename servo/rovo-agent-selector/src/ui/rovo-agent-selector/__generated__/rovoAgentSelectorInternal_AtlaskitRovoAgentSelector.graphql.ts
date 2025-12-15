/**
 * @generated SignedSource<<77e46986484d4f01b967a5a4ab5454e8>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type rovoAgentSelectorInternal_AtlaskitRovoAgentSelector$data = {
  readonly agentStudio_getAgents: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly creatorType: string | null | undefined;
        readonly externalConfigReference: string | null | undefined;
        readonly id: string;
        readonly identityAccountId: string | null | undefined;
        readonly name: string | null | undefined;
      } | null | undefined;
    }>;
    readonly pageInfo: {
      readonly endCursor: string | null | undefined;
      readonly hasNextPage: boolean;
    };
  } | null | undefined;
  readonly " $fragmentType": "rovoAgentSelectorInternal_AtlaskitRovoAgentSelector";
};
export type rovoAgentSelectorInternal_AtlaskitRovoAgentSelector$key = {
  readonly " $data"?: rovoAgentSelectorInternal_AtlaskitRovoAgentSelector$data;
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelectorInternal_AtlaskitRovoAgentSelector">;
};

import rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery_graphql from './rovoAgentSelectorInternal_AtlaskitRovoAgentSelectorPaginationQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "agentStudio_getAgents"
];
return {
  "argumentDefinitions": [
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
  "name": "rovoAgentSelectorInternal_AtlaskitRovoAgentSelector",
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
    }
  ],
  "type": "Query"
};
})();

(node as any).hash = "8881dad000db26a08109dc078351cc30";

export default node;
