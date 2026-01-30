/**
 * @generated SignedSource<<357f24b825d89a67284b9e7ef5d78f83>>
 * @lightSyntaxTransform
 * @nogrep
 * @codegen-command: yarn relay
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { Fragment, ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type agentVerificationDropdownItem_AtlaskitRovoAgentComponents_agentRef$data = {
  readonly id: string;
  readonly isVerified: boolean | null | undefined;
  readonly " $fragmentType": "agentVerificationDropdownItem_AtlaskitRovoAgentComponents_agentRef";
};
export type agentVerificationDropdownItem_AtlaskitRovoAgentComponents_agentRef$key = {
  readonly " $data"?: agentVerificationDropdownItem_AtlaskitRovoAgentComponents_agentRef$data;
  readonly " $fragmentSpreads": FragmentRefs<"agentVerificationDropdownItem_AtlaskitRovoAgentComponents_agentRef">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "name": "agentVerificationDropdownItem_AtlaskitRovoAgentComponents_agentRef",
  "selections": [
    {
      "kind": "ScalarField",
      "name": "id"
    },
    {
      "kind": "ScalarField",
      "name": "isVerified"
    }
  ],
  "type": "AgentStudioAssistant"
};

(node as any).hash = "176b570bcbf4e92ccef358e70f74443d";

export default node;
