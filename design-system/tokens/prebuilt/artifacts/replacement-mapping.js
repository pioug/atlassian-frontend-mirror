"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
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
 * @codegen <<SignedSource::986b26dc28b6a7d1da0912b44171d859>>
 * @codegenCommand yarn build tokens
 */

var replacementMapper = [{
  "path": "motion.avatar.enter",
  "state": "experimental"
}, {
  "path": "motion.avatar.exit",
  "state": "experimental"
}, {
  "path": "motion.avatar.hovered",
  "state": "experimental"
}, {
  "path": "motion.blanket.enter",
  "state": "experimental"
}, {
  "path": "motion.blanket.exit",
  "state": "experimental"
}, {
  "path": "motion.duration.instant",
  "state": "experimental"
}, {
  "path": "motion.duration.long",
  "state": "experimental"
}, {
  "path": "motion.duration.medium",
  "state": "experimental"
}, {
  "path": "motion.duration.short",
  "state": "experimental"
}, {
  "path": "motion.duration.xlong",
  "state": "experimental"
}, {
  "path": "motion.duration.xshort",
  "state": "experimental"
}, {
  "path": "motion.duration.xxlong",
  "state": "experimental"
}, {
  "path": "motion.duration.xxshort",
  "state": "experimental"
}, {
  "path": "motion.easing.in.practical",
  "state": "experimental"
}, {
  "path": "motion.easing.inout.bold",
  "state": "experimental"
}, {
  "path": "motion.easing.out.practical",
  "state": "experimental"
}, {
  "path": "motion.easing.out.bold",
  "state": "experimental"
}, {
  "path": "motion.easing.spring",
  "state": "experimental"
}, {
  "path": "motion.flag.enter",
  "state": "experimental"
}, {
  "path": "motion.flag.exit",
  "state": "experimental"
}, {
  "path": "motion.flag.reposition",
  "state": "experimental"
}, {
  "path": "motion.keyframe.fade.in",
  "state": "experimental"
}, {
  "path": "motion.keyframe.fade.out",
  "state": "experimental"
}, {
  "path": "motion.keyframe.scale.in.medium",
  "state": "experimental"
}, {
  "path": "motion.keyframe.scale.in.small",
  "state": "experimental"
}, {
  "path": "motion.keyframe.scale.out.medium",
  "state": "experimental"
}, {
  "path": "motion.keyframe.scale.out.small",
  "state": "experimental"
}, {
  "path": "motion.keyframe.slide.in.bottom.short",
  "state": "experimental"
}, {
  "path": "motion.keyframe.slide.in.left.half",
  "state": "experimental"
}, {
  "path": "motion.keyframe.slide.in.left.short",
  "state": "experimental"
}, {
  "path": "motion.keyframe.slide.in.right.short",
  "state": "experimental"
}, {
  "path": "motion.keyframe.slide.in.top.short",
  "state": "experimental"
}, {
  "path": "motion.keyframe.slide.out.bottom.short",
  "state": "experimental"
}, {
  "path": "motion.keyframe.slide.out.left.half",
  "state": "experimental"
}, {
  "path": "motion.keyframe.slide.out.left.short",
  "state": "experimental"
}, {
  "path": "motion.keyframe.slide.out.right.short",
  "state": "experimental"
}, {
  "path": "motion.keyframe.slide.out.top.short",
  "state": "experimental"
}, {
  "path": "motion.modal.enter",
  "state": "experimental"
}, {
  "path": "motion.modal.exit",
  "state": "experimental"
}, {
  "path": "motion.popup.enter.bottom",
  "state": "experimental"
}, {
  "path": "motion.popup.enter.left",
  "state": "experimental"
}, {
  "path": "motion.popup.enter.right",
  "state": "experimental"
}, {
  "path": "motion.popup.enter.top",
  "state": "experimental"
}, {
  "path": "motion.popup.exit.bottom",
  "state": "experimental"
}, {
  "path": "motion.popup.exit.left",
  "state": "experimental"
}, {
  "path": "motion.popup.exit.right",
  "state": "experimental"
}, {
  "path": "motion.popup.exit.top",
  "state": "experimental"
}, {
  "path": "motion.spotlight.enter",
  "state": "experimental"
}, {
  "path": "motion.spotlight.exit",
  "state": "experimental"
}];
var _default = exports.default = replacementMapper;