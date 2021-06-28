import React from 'react';
import { PureComponent } from 'react';
import TaskItem from './TaskItem';
import {
  Appearance,
  BaseItem,
  ContentRef,
  TaskDecisionProvider,
  TaskState,
  DecisionState,
} from '../types';
import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

export interface Props {
  taskId: string;
  isDone?: boolean;
  onChange?: (taskId: string, isChecked: boolean) => void;
  contentRef?: ContentRef;
  children?: any;
  taskDecisionProvider?: Promise<TaskDecisionProvider>;
  objectAri?: string;
  showPlaceholder?: boolean;
  placeholder?: string;
  appearance?: Appearance;
  disabled?: boolean;
  dataAttributes?: { [key: string]: string | number };
}

export interface State {
  isDone?: boolean;
}

export default class ResourcedTaskItem extends PureComponent<Props, State> {
  public static defaultProps: Partial<Props> = {
    appearance: 'inline',
  };
  private mounted: boolean = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      isDone: props.isDone,
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.subscribe(
      this.props.taskDecisionProvider,
      this.props.objectAri,
      this.props.isDone,
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.isDone !== this.props.isDone) {
      // This only occurs for Actions (DONE vs TODO), since Decisions only support DECIDED.
      // If the document is refreshed or changed, we need to reset the local state to match the new
      // source of truth from the revised data.
      this.onUpdate(nextProps.isDone ? 'DONE' : 'TODO');
    }
    if (
      nextProps.taskDecisionProvider !== this.props.taskDecisionProvider ||
      nextProps.objectAri !== this.props.objectAri
    ) {
      this.unsubscribe();
      this.subscribe(
        nextProps.taskDecisionProvider,
        nextProps.objectAri,
        nextProps.isDone,
      );
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.mounted = false;
  }

  private subscribe(
    taskDecisionProvider?: Promise<TaskDecisionProvider>,
    objectAri?: string,
    isDone?: boolean,
  ) {
    if (taskDecisionProvider && objectAri) {
      taskDecisionProvider.then((provider) => {
        if (!this.mounted) {
          return;
        }
        const { taskId } = this.props;
        const objectKey = { localId: taskId, objectAri };
        const item: BaseItem<TaskState> = {
          ...objectKey,
          state: isDone ? 'DONE' : 'TODO',
          lastUpdateDate: new Date(),
          type: 'TASK',
        };
        provider.subscribe({ localId: taskId, objectAri }, this.onUpdate, item);
      });
    }
  }

  private unsubscribe() {
    const { taskDecisionProvider, taskId, objectAri } = this.props;
    if (taskDecisionProvider && objectAri) {
      taskDecisionProvider.then((provider) => {
        provider.unsubscribe({ localId: taskId, objectAri }, this.onUpdate);
      });
    }
  }

  private onUpdate = (state: TaskState | DecisionState) => {
    this.setState({ isDone: state === 'DONE' });
  };

  private handleOnChange = (taskId: string, isDone: boolean) => {
    const { taskDecisionProvider, objectAri, onChange } = this.props;
    // Optimistically update the task
    this.setState({ isDone });

    if (taskDecisionProvider && objectAri) {
      // Call provider to update task
      taskDecisionProvider.then((provider) => {
        if (!this.mounted) {
          return;
        }
        provider.toggleTask(
          { localId: taskId, objectAri },
          isDone ? 'DONE' : 'TODO',
        );

        // onChange could trigger a rerender, in order to get the correct state
        // we should only call onChange once the internal state have been modified
        if (onChange) {
          onChange(taskId, isDone);
        }
      });
    } else {
      // No provider - state managed by consumer
      if (onChange) {
        onChange(taskId, isDone);
      }
    }
  };

  render() {
    const { isDone } = this.state;
    const {
      appearance,
      children,
      contentRef,
      objectAri,
      showPlaceholder,
      placeholder,
      taskId,
      disabled,
      dataAttributes,
    } = this.props;

    return (
      <FabricElementsAnalyticsContext
        data={{
          objectAri,
        }}
      >
        <TaskItem
          isDone={isDone}
          taskId={taskId}
          onChange={this.handleOnChange}
          appearance={appearance}
          contentRef={contentRef}
          showPlaceholder={showPlaceholder}
          placeholder={placeholder}
          disabled={disabled}
          dataAttributes={dataAttributes}
        >
          {children}
        </TaskItem>
      </FabricElementsAnalyticsContext>
    );
  }
}
