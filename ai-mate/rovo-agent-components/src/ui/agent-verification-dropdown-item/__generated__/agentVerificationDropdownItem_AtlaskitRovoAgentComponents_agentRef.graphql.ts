/**
 * @generated SignedSource<<9817b3677a18810cda2656cb77948845>>
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
      "name": "isVerified"
    }
  ],
  "type": "AgentStudioAssistant"
};

(node as any).hash = "1635a55a6ff272864bba57326c99a315";

export default node;
