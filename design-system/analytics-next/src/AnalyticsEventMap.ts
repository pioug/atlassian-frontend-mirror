/**
 * This map was originally used to configure the analytics codemod to run over
 * each component.
 * It is now also used as the source of truth for the instrumented components section of
 * the docs.
 * If analytics has been manually for a component and you do not wish for it to be
 * codemodded, add an `ignore: true` prop to it.
 */
export interface AnalyticsEventConfig {
  /** Path to component being wrapped with analytics */
  path: string;
  /** Path to analytics test file that will be created and/or already exists */
  testPath: string;
  /** The 'component' context value that will be exposed via analytics context */
  actionSubject: string;
  /** Any components that derive from the base component that will therefore have analytics
   * as well. E.g. any stateful version of a stateless component.
   */
  derivatives?: string[];
  /** The name of the component used in the component test file. This is also used
   * as the name of the base (unwrapped) component export in the component file path.
   * This name should be consistent, some names were manually updated so that they aligned.
   */
  component: string;
  /** A map of prop callbacks that will be instrumented with analytics.
   *  The key represents the prop callback name and the value represents the 'action'
   *  payload value that will be attached to the analytics event.
   */
  props: {
    [propName: string]: string | string[];
  };
  /** A map of prop callbacks that will be instrumented with analytics.
   *  The key represents the prop callback name and the value represents the 'action'
   *  payload value that will be attached to the analytics event.
   */
  attributes: {
    componentName: string;
    [attribute: string]: string;
  };
  /** Path to the components existing test file so that we can add mount tests to it */
  componentTestPath?: string;
  /** Signals to the codemod to not override the analytics tests in the component test
   *  file as some manual work has been done that cannot be automated.
   */
  manualComponentTestOverride?: boolean;
  /** Signals that this map entry is for test purposes and should not be part of other exports */
  test?: true;
  ignore?: boolean;
  overwrite?: string;
  overwritePackage?: string;
  refIssue?: boolean;
  rerun?: boolean;
  needsMountTest?: boolean;
}

export const analyticsEventMap: AnalyticsEventConfig[] = [
  {
    path: 'avatar/src/components/Avatar.js',
    testPath: 'avatar/src/components/__tests__/analytics.js',
    actionSubject: 'avatar',
    component: 'Avatar',
    props: {
      onClick: 'clicked',
    },
    attributes: {
      componentName: 'avatar',
    },
    componentTestPath: 'avatar/src/components/__tests__/Avatar.js',
  },
  {
    path: 'blanket/src/Blanket.js',
    testPath: 'blanket/src/__tests__/analytics.js',
    actionSubject: 'blanket',
    component: 'Blanket',
    props: {
      onBlanketClicked: 'clicked',
    },
    attributes: {
      componentName: 'blanket',
    },
    componentTestPath: 'blanket/src/__tests__/blanket.js',
  },
  {
    path: 'breadcrumbs/src/components/BreadcrumbsStateless.js',
    testPath: 'breadcrumbs/__tests__/analytics.js',
    actionSubject: 'breadcrumbs',
    component: 'BreadcrumbsStateless',
    derivatives: ['Breadcrumbs'],
    props: {
      onExpand: 'expanded',
    },
    attributes: {
      componentName: 'breadcrumbs',
    },
    componentTestPath: 'breadcrumbs/__tests__/Breadcrumbs.test.js',
  },
  {
    path: 'breadcrumbs/src/components/BreadcrumbsItem.js',
    testPath: 'breadcrumbs/__tests__/analytics-item.js',
    actionSubject: 'breadcrumbsItem',
    component: 'BreadcrumbsItem',
    overwrite: 'Button',
    overwritePackage: '@atlaskit/button',
    props: {
      onClick: 'clicked',
    },
    attributes: {
      componentName: 'breadcrumbsItem',
    },
    componentTestPath: 'breadcrumbs/__tests__/Item.test.js',
    manualComponentTestOverride: true,
  },
  {
    path: 'button/src/components/Button.js',
    testPath: 'button/__tests__/analytics.js',
    actionSubject: 'button',
    component: 'Button',
    props: {
      onClick: 'clicked',
    },
    attributes: {
      componentName: 'button',
    },
    componentTestPath: 'button/src/__tests__/testDefaultBehaviour.js',
  },
  {
    path: 'comment/src/components/ActionItem.js',
    testPath: 'comment/__tests__/analytics-actionitem.js',
    actionSubject: 'commentAction',
    component: 'CommentAction',
    props: {
      onClick: 'clicked',
    },
    attributes: {
      componentName: 'commentAction',
    },
    componentTestPath: 'comment/__tests__/commentAction.js',
  },
  {
    path: 'comment/src/components/Author.js',
    testPath: 'comment/__tests__/analytics-author.js',
    actionSubject: 'commentAuthor',
    component: 'CommentAuthor',
    props: {
      onClick: 'clicked',
    },
    attributes: {
      componentName: 'commentAuthor',
    },
    componentTestPath: 'comment/__tests__/commentAuthor.js',
  },
  {
    path: 'comment/src/components/Edited.js',
    testPath: 'comment/__tests__/analytics-edited.js',
    actionSubject: 'commentEdited',
    component: 'CommentEdited',
    props: {
      onClick: 'clicked',
    },
    attributes: {
      componentName: 'commentEdited',
    },
    componentTestPath: 'comment/__tests__/commentEdited.js',
  },
  {
    path: 'comment/src/components/Time.js',
    testPath: 'comment/__tests__/analytics-time.js',
    actionSubject: 'commentTime',
    component: 'CommentTime',
    props: {
      onClick: 'clicked',
    },
    attributes: {
      componentName: 'commentTime',
    },
    componentTestPath: 'comment/__tests__/commentTime.js',
  },
  {
    path: 'calendar/src/components/Calendar.js',
    testPath: 'calendar/src/components/__tests__/analytics.js',
    actionSubject: 'calendarDate',
    component: 'Calendar',
    props: {
      onChange: 'changed',
      onSelect: 'selected',
    },
    attributes: {
      componentName: 'calendar',
    },
    componentTestPath: 'calendar/src/components/__tests__/Calendar.js',
    refIssue: true,
    rerun: true,
  },
  {
    path: 'checkbox/src/Checkbox.js',
    testPath: 'checkbox/src/__tests__/unit/analytics.js',
    actionSubject: 'checkbox',
    component: 'Checkbox',
    props: {
      onChange: 'changed',
    },
    attributes: {
      componentName: 'checkbox',
    },
    componentTestPath: 'checkbox/src/__tests__/unit/index.js',
  },
  {
    path: 'datetime-picker/src/components/DatePicker.js',
    testPath:
      'datetime-picker/src/components/__tests__/analytics-datepicker.js',
    actionSubject: 'datePicker',
    component: 'DatePicker',
    props: {
      onChange: 'selectedDate',
    },
    attributes: {
      componentName: 'datePicker',
    },
    componentTestPath: 'datetime-picker/src/components/__tests__/DatePicker.js',
  },
  {
    path: 'datetime-picker/src/components/TimePicker.js',
    testPath:
      'datetime-picker/src/components/__tests__/analytics-timepicker.js',
    actionSubject: 'timePicker',
    component: 'TimePicker',
    props: {
      onChange: 'selectedTime',
    },
    attributes: {
      componentName: 'timePicker',
    },
    componentTestPath: 'datetime-picker/src/components/__tests__/TimePicker.js',
  },
  {
    path: 'datetime-picker/src/components/DateTimePicker.js',
    testPath:
      'datetime-picker/src/components/__tests__/analytics-datetimepicker.js',
    actionSubject: 'dateTimePicker',
    component: 'DateTimePicker',
    props: {
      onChange: 'changed',
    },
    attributes: {
      componentName: 'dateTimePicker',
    },
    componentTestPath:
      'datetime-picker/src/components/__tests__/DateTimePicker.js',
  },
  {
    path: 'drawer/src/components/index.js',
    testPath: 'drawer/src/components/__tests__/unit/analytics-drawer.js',
    actionSubject: 'drawer',
    component: 'Drawer',
    props: {
      onClose: 'dismissed',
    },
    attributes: {
      componentName: 'drawer',
      trigger: 'backButton | blanket | escKey',
    },
  },
  {
    path: 'dropdown-menu/src/components/DropdownMenuStateless.js',
    testPath: 'dropdown-menu/__tests__/analytics.js',
    actionSubject: 'dropdownMenu',
    component: 'DropdownMenuStateless',
    derivatives: ['DropdownMenu'],
    overwrite: 'Droplist',
    overwritePackage: '@atlaskit/droplist',
    props: {
      onOpenChange: 'toggled',
    },
    attributes: {
      componentName: 'dropdownMenu',
    },
    componentTestPath: 'dropdown-menu/__tests__/DropdownMenuStateless.js',
  },
  {
    path: 'droplist/src/components/Droplist.js',
    testPath: 'droplist/src/__tests__/analytics.js',
    actionSubject: 'droplist',
    component: 'Droplist',
    props: {
      onOpenChange: 'toggled',
    },
    attributes: {
      componentName: 'droplist',
    },
    componentTestPath: 'droplist/src/__tests__/index.js',
  },
  {
    path: 'droplist/src/components/Item.js',
    testPath: 'droplist/src/__tests__/analytics-item.js',
    actionSubject: 'droplistItem',
    component: 'DroplistItem',
    props: {
      onActivate: 'selected',
    },
    attributes: {
      componentName: 'droplistItem',
    },
    componentTestPath: 'droplist/src/__tests__/index.js',
    manualComponentTestOverride: true,
  },
  {
    path: 'dynamic-table/src/components/Stateless.js',
    testPath: 'dynamic-table/__tests__/analytics.js',
    actionSubject: 'dynamicTable',
    component: 'DynamicTable',
    props: {
      onSort: 'sorted',
      onRankEnd: 'ranked',
    },
    attributes: {
      componentName: 'dynamicTable',
    },
    componentTestPath: 'dynamic-table/__tests__/Stateless.js',
  },
  {
    path: 'dynamic-table/src/components/Stateless.js',
    testPath: 'dynamic-table/__tests__/analytics.js',
    actionSubject: 'pageNumber',
    component: 'DynamicTable',
    props: {
      onSetPage: 'changed',
    },
    attributes: {
      componentName: 'pagination',
    },
    componentTestPath: 'dynamic-table/__tests__/Stateless.js',
  },
  {
    path: 'field-radio-group/src/RadioGroupStateless.js',
    testPath: 'field-radio-group/src/__tests__/analytics-radio-group.js',
    actionSubject: 'radioItem',
    component: 'AkFieldRadioGroup',
    derivatives: ['RadioGroup'],
    props: {
      onRadioChange: 'selected',
    },
    attributes: {
      componentName: 'fieldRadioGroup',
    },
    componentTestPath: 'field-radio-group/src/__tests__/RadioGroup.js',
  },
  {
    path: 'field-text/src/FieldTextStateless.js',
    testPath: 'field-text/src/__tests__/analytics.js',
    actionSubject: 'textField',
    component: 'FieldTextStateless',
    derivatives: ['FieldText'],
    props: {
      onBlur: 'blurred',
      onFocus: 'focused',
    },
    attributes: {
      componentName: 'fieldText',
    },
    componentTestPath: 'field-text/src/__tests__/index.js',
  },
  {
    path: 'field-text-area/src/FieldTextAreaStateless.js',
    testPath: 'field-text-area/src/__tests__/analytics.js',
    actionSubject: 'textArea',
    component: 'FieldTextAreaStateless',
    derivatives: ['FieldTextArea'],
    props: {
      onBlur: 'blurred',
      onFocus: 'focused',
    },
    attributes: {
      componentName: 'fieldTextArea',
    },
    componentTestPath: 'field-text-area/src/__tests__/index.js',
  },
  {
    path: 'flag/src/components/Flag/index.js',
    testPath: 'flag/__tests__/analytics.js',
    actionSubject: 'flag',
    component: 'Flag',
    props: {
      onBlur: 'blurred',
      onDismissed: 'dismissed',
      onFocus: 'focused',
    },
    attributes: {
      componentName: 'flag',
    },
    componentTestPath: 'flag/__tests__/Flag.js',
    manualComponentTestOverride: true,
  },
  {
    path: 'inline-dialog/src/InlineDialog/index.js',
    testPath: 'inline-dialog/__tests__/analytics.js',
    actionSubject: 'inlineDialog',
    component: 'InlineDialog',
    props: {
      onClose: 'closed',
    },
    attributes: {
      componentName: 'inlineDialog',
    },
    componentTestPath: 'inline-dialog/__tests__/index.js',
  },
  {
    path: 'inline-edit/src/components/InlineEdit.tsx',
    testPath: 'inline-edit/src/components/__tests__/analytics.ts',
    actionSubject: 'inlineEdit',
    component: 'InlineEdit',
    props: {
      onConfirm: 'confirmed',
    },
    attributes: {
      componentName: 'inlineEdit',
    },
    componentTestPath:
      'inline-edit/src/components/__tests__/unit/InlineEdit.tsx',
  },
  {
    path: 'modal-dialog/src/components/Modal.js',
    testPath: 'modal-dialog/__tests__/analytics.js',
    actionSubject: 'modalDialog',
    component: 'ModalDialog',
    props: {
      onClose: 'closed',
    },
    attributes: {
      componentName: 'modalDialog',
    },
    componentTestPath: 'modal-dialog/__tests__/modalDialog.js',
  },
  {
    path: 'navigation/src/components/js/Navigation.js',
    testPath: 'navigation/__tests__/analytics.js',
    actionSubject: 'navigation',
    component: 'Navigation',
    props: {
      onResize: 'resized',
      onResizeStart: 'resizeStarted',
    },
    attributes: {
      componentName: 'navigation',
    },
    componentTestPath: 'navigation/__tests__/Navigation.js',
  },
  {
    path: 'navigation/src/components/js/NavigationItem.js',
    testPath: 'navigation/__tests__/NavigationItem-analytics.js',
    actionSubject: 'navigationItem',
    component: 'NavigationItem',
    props: {
      onClick: 'clicked',
    },
    attributes: {
      componentName: 'navigationItem',
    },
    componentTestPath: 'navigation/__tests__/NavigationItem.js',
  },
  {
    path: 'onboarding/src/components/Spotlight.js',
    testPath: 'onboarding/__tests__/analytics.js',
    actionSubject: 'spotlight',
    component: 'Spotlight',
    props: {
      targetOnClick: 'clicked',
    },
    attributes: {
      componentName: 'spotlight',
    },
    componentTestPath: 'onboarding/__tests__/index.js',
    manualComponentTestOverride: true,
  },
  {
    path: 'pagination/src/components/Pagination.js',
    testPath: 'pagination/__tests__/analytics.js',
    actionSubject: 'pageNumber',
    component: 'Pagination',
    props: {
      onChange: 'changed',
    },
    attributes: {
      componentName: 'pagination',
    },
    componentTestPath: 'pagination/__tests__/index.js',
  },
  {
    path: 'progress-indicator/src/components/Dots.js',
    testPath: 'progress-indicator/__tests__/analytics.js',
    actionSubject: 'progressIndicator',
    component: 'ProgressDots',
    props: {
      onSelect: 'clicked',
    },
    attributes: {
      componentName: 'progressIndicator',
    },
    componentTestPath: 'progress-indicator/__tests__/index.js',
  },
  {
    path: 'radio/src/Radio.js',
    testPath: 'radio/src/__tests__/unit/analytics.js',
    actionSubject: 'radio',
    component: 'Radio',
    props: {
      onChange: 'changed',
    },
    attributes: {
      componentName: 'radio',
    },
    componentTestPath: 'radio/src/__tests__/Radio.js',
  },
  {
    path: 'select/src/Select.js',
    testPath: 'select/src/components/__tests__/unit/analytics.js',
    actionSubject: 'option',
    component: 'Select',
    props: {
      onChange: 'changed',
    },
    attributes: {
      componentName: 'select',
    },
    componentTestPath: 'select/src/components/__tests__/unit/Select.js',
    needsMountTest: true,
    refIssue: true,
  },
  {
    path: 'table-tree/src/components/Row.js',
    testPath: 'table-tree/src/__tests__/analytics.js',
    actionSubject: 'tableTree',
    component: 'Row',
    props: {
      onExpand: 'expanded',
      onCollapse: 'collapsed',
    },
    attributes: {
      componentName: 'row',
    },
    componentTestPath: 'table-tree/src/__tests__/functional.js',
    manualComponentTestOverride: true,
  },
  {
    path: 'tabs/src/components/Tabs.js',
    testPath: 'tabs/__tests__/analytics.js',
    actionSubject: 'tab',
    component: 'Tabs',
    props: {
      onSelect: 'clicked',
    },
    attributes: {
      componentName: 'tabs',
    },
    componentTestPath: 'tabs/__tests__/index.js',
  },
  {
    path: 'tag/src/Tag/index.js',
    testPath: 'tag/src/Tag/__tests__/analytics.js',
    actionSubject: 'tag',
    component: 'Tag',
    props: {
      onAfterRemoveAction: 'removed',
    },
    attributes: {
      componentName: 'tag',
    },
    componentTestPath: 'tag/src/Tag/__tests__/index.js',
    manualComponentTestOverride: true,
  },
  {
    path: 'toggle/src/ToggleStateless.js',
    testPath: 'toggle/src/__tests__/analytics.js',
    actionSubject: 'toggle',
    component: 'ToggleStateless',
    derivatives: ['Toggle'],
    props: {
      onBlur: 'blurred',
      onChange: 'changed',
      onFocus: 'focused',
    },
    attributes: {
      componentName: 'toggle',
    },
    componentTestPath: 'toggle/src/__tests__/index.js',
  },
  {
    path: 'tooltip/src/components/Tooltip.js',
    testPath: 'tooltip/src/components/__tests__/analytics.js',
    actionSubject: 'tooltip',
    component: 'Tooltip',
    props: {
      onMouseOver: 'displayed',
    },
    attributes: {
      componentName: 'tooltip',
    },
    componentTestPath: 'tooltip/src/components/__tests__/Tooltip.js',
  },
];

export const analyticsPackages = analyticsEventMap
  .filter(pkg => pkg.test !== true)
  .map(config => {
    const { path } = config;

    return path.substring(0, path.indexOf('/'));
  });

export interface InstrumentedItem {
  packageName: string;
  component: string;
  actionSubject: string;
  prop: string;
  payload: Record<string, string | string[]>;
}

export const instrumentedComponents = analyticsEventMap
  .filter(pkg => pkg.test !== true)
  .reduce<InstrumentedItem[]>((acc, config) => {
    const { path } = config;
    const packageSuffix = path.substring(0, path.indexOf('/'));
    const items: InstrumentedItem[] = [];

    Object.keys(config.props).forEach(propName => {
      const components = config.derivatives
        ? [config.component].concat(config.derivatives).join(', ')
        : config.component;

      items.push({
        packageName: `@atlaskit/${packageSuffix}`,
        component: components,
        actionSubject: config.actionSubject,
        prop: propName,
        payload: { action: config.props[propName] },
      });
    });

    return acc.concat(items);
  }, []);
