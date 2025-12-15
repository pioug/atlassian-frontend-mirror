/**
 * @generated SignedSource<<0f1b59c36241b9284e19984721c552b6>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type rovoAgentSelector_RovoAgentSelector$data = {
  readonly atlassianStudio_userSiteContext: {
    readonly userPermissions?: {
      readonly isAbleToCreateAgents: boolean | null | undefined;
    } | null | undefined;
  } | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector">;
  readonly " $fragmentType": "rovoAgentSelector_RovoAgentSelector";
};
export type rovoAgentSelector_RovoAgentSelector$key = {
  readonly " $data"?: rovoAgentSelector_RovoAgentSelector$data;
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_RovoAgentSelector">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
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
  "kind": "Fragment",
  "name": "rovoAgentSelector_RovoAgentSelector",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "cloudId",
          "variableName": "cloudId"
        }
      ],
      "kind": "LinkedField",
      "name": "atlassianStudio_userSiteContext",
      "plural": false,
      "selections": [
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
      "args": [
        {
          "kind": "Variable",
          "name": "cloudId",
          "variableName": "cloudIdString"
        }
      ],
      "kind": "FragmentSpread",
      "name": "rovoAgentSelector_AtlaskitRovoAgentSelector"
    }
  ],
  "type": "Query"
};

(node as any).hash = "3694454813bfb286ea84355bfa2c8178";

export default node;
