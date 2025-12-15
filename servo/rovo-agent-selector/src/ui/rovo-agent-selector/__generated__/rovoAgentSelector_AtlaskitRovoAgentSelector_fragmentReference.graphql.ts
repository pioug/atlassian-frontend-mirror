/**
 * @generated SignedSource<<edf5a57651b5998d16e4cbfd0afce2cd>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference$data = {
  readonly atlassianStudio_userSiteContext: {
    readonly userPermissions?: {
      readonly isAbleToCreateAgents: boolean | null | undefined;
    } | null | undefined;
  } | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector_RovoAgentSelectorInternal_fragmentReference">;
  readonly " $fragmentType": "rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference";
};
export type rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference$key = {
  readonly " $data"?: rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference$data;
  readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference">;
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
  "name": "rovoAgentSelector_AtlaskitRovoAgentSelector_fragmentReference",
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
      "name": "rovoAgentSelector_AtlaskitRovoAgentSelector_RovoAgentSelectorInternal_fragmentReference"
    }
  ],
  "type": "Query"
};

(node as any).hash = "927b61a2b0a85b3615d08271f29ed286";

export default node;
