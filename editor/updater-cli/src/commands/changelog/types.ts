import { PackageJson } from '../../utils/package-json';
import { Task } from '../../runner';

export type ChangeLogTasksCtx = {
  packageJson: PackageJson;
  targetVersion: string;
  sourceVersion: string;
};
export type ChangeLogTasksParams = {
  currentVersion: string;
  packageName: string;
};

export type ChangeLogTasks = Task<ChangeLogTasksCtx, ChangeLogTasksParams>;
