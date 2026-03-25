/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * This file is intended to help automate renaming of tokens.
 *
 * 1. Mark the old token's 'state' as deprecated
 * 2. Add a 'replacement' attribute to the token with the value 'my.new.token'
 * 3. Create a new token matching the token above: 'my.new.token'
 * 4. Run 'yarn build tokens' to have you changes reflected in this map
 * 5. ESLint and other tools will now use this to automate replacing tokens
 *
 * These changes will then be picked up by our tooling which will attempt to
 * migrate as many of these renames as possible.
 *
 * @codegen <<SignedSource::e46353a7329c8e87640e1586a2ec2ce7>>
 * @codegenCommand yarn build tokens
 */
import type tokens from './token-names';

type Token = keyof typeof tokens | string;
type RenameMap = {
  path: string;
  state: 'experimental' | 'deprecated' | 'deleted';
  replacement?: Token;
}

const replacementMapper: RenameMap[] = [
  {
    "path": "motion.avatar.enter",
    "state": "experimental"
  },
  {
    "path": "motion.avatar.exit",
    "state": "experimental"
  },
  {
    "path": "motion.avatar.hovered",
    "state": "experimental"
  },
  {
    "path": "motion.content.enter.long",
    "state": "experimental"
  },
  {
    "path": "motion.content.enter.medium",
    "state": "experimental"
  },
  {
    "path": "motion.content.enter.short",
    "state": "experimental"
  },
  {
    "path": "motion.content.exit.long",
    "state": "experimental"
  },
  {
    "path": "motion.content.exit.medium",
    "state": "experimental"
  },
  {
    "path": "motion.content.exit.short",
    "state": "experimental"
  },
  {
    "path": "motion.flag.enter",
    "state": "experimental"
  },
  {
    "path": "motion.flag.exit",
    "state": "experimental"
  },
  {
    "path": "motion.flag.reposition",
    "state": "experimental"
  },
  {
    "path": "motion.modal.enter",
    "state": "experimental"
  },
  {
    "path": "motion.modal.exit",
    "state": "experimental"
  },
  {
    "path": "motion.popup.enter.bottom",
    "state": "experimental"
  },
  {
    "path": "motion.popup.enter.left",
    "state": "experimental"
  },
  {
    "path": "motion.popup.enter.right",
    "state": "experimental"
  },
  {
    "path": "motion.popup.enter.top",
    "state": "experimental"
  },
  {
    "path": "motion.popup.exit.bottom",
    "state": "experimental"
  },
  {
    "path": "motion.popup.exit.left",
    "state": "experimental"
  },
  {
    "path": "motion.popup.exit.right",
    "state": "experimental"
  },
  {
    "path": "motion.popup.exit.top",
    "state": "experimental"
  },
  {
    "path": "motion.spotlight.enter",
    "state": "experimental"
  },
  {
    "path": "motion.spotlight.exit",
    "state": "experimental"
  },
  {
    "path": "font.body.UNSAFE_small",
    "state": "deprecated",
    "replacement": "font.body.small"
  }
];

export default replacementMapper;
