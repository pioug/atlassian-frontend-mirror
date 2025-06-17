/**
 * This file is a temporary hack to allow the editor to have references to the QuickInsertPlugin type.
 *
 * There is bug in tsconfig references generation, where it only adds references to the immediate dependencies of the project.
 * and not transitive dependencies. Typescript doesn't look into transitive dependencies tp update cached declarations of a package.
 *
 * Typecheck team is working on a fix for this issue.
 **/
import { type QuickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';

export type tmpQuickInsertPlugin = QuickInsertPlugin;
