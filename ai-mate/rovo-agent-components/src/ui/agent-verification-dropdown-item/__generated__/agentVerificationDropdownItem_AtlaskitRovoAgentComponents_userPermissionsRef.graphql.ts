/**
 * @generated SignedSource<<3ba8bcbc18cbb9766a1547794c6c98af>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type agentVerificationDropdownItem_AtlaskitRovoAgentComponents_userPermissionsRef$data = {
  readonly isAbleToGovernAgents: boolean | null | undefined;
  readonly " $fragmentType": "agentVerificationDropdownItem_AtlaskitRovoAgentComponents_userPermissionsRef";
};
export type agentVerificationDropdownItem_AtlaskitRovoAgentComponents_userPermissionsRef$key = {
  readonly " $data"?: agentVerificationDropdownItem_AtlaskitRovoAgentComponents_userPermissionsRef$data;
  readonly " $fragmentSpreads": FragmentRefs<"agentVerificationDropdownItem_AtlaskitRovoAgentComponents_userPermissionsRef">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "name": "agentVerificationDropdownItem_AtlaskitRovoAgentComponents_userPermissionsRef",
  "selections": [
    {
      "kind": "ScalarField",
      "name": "isAbleToGovernAgents"
    }
  ],
  "type": "AtlassianStudioUserProductPermissions"
};

(node as any).hash = "5addff9015092fd6e1870a9f51056493";

export default node;
