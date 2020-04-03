import { Task, PrintableOutput } from '../../runner';
import { DependenciesList } from '../../utils/npm';
import {
  PackageJsonPatch,
  PackageJson,
  PackageJsonPatchGroup,
} from '../../utils/package-json';

export type UpdateTaskCtx = {
  packageJson: PackageJson;
  packageJsonPath: string;
  packages: PackageJsonPatchGroup;
  packageJsonPatch: PackageJsonPatch;
  deps: DependenciesList;
  changelogs: PrintableOutput;
};

export type UpdateTaskParams = {
  packages: Array<string>;
  flags: UpdateTaskFlags;
};

export type UpdateTaskFlags = {
  exclude?: Array<string>;
  force?: boolean;
  preset?: 'editor';
};

export type UpdateTask = Task<UpdateTaskCtx, UpdateTaskParams>;
