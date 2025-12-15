/**
 * @generated SignedSource<<39c8992dbd5bb882f678fd6640aeaf38>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type rovoAgentSelector_AtlaskitRovoAgentSelector$data = {
  readonly atlassianStudio_userSiteContext: {
    readonly userPermissions?: {
      readonly isAbleToCreateAgents: boolean | null | undefined;
    } | null | undefined;
  } | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelectorInternal_AtlaskitRovoAgentSelector">;
  readonly " $fragmentType": "rovoAgentSelector_AtlaskitRovoAgentSelector";
};
export type rovoAgentSelector_AtlaskitRovoAgentSelector$key = {
  readonly " $data"?: rovoAgentSelector_AtlaskitRovoAgentSelector$data;
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector">;
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
  "name": "rovoAgentSelector_AtlaskitRovoAgentSelector",
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
          "name": "cloudIdString",
          "variableName": "cloudIdString"
        }
      ],
      "kind": "FragmentSpread",
      "name": "rovoAgentSelectorInternal_AtlaskitRovoAgentSelector"
    }
  ],
  "type": "Query"
};

(node as any).hash = "d57721784d3b3262aa36fe6cb5984857";

export default node;
