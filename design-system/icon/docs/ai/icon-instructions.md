# Translating from Tailwind

An example diff of a migration from Tailwind generated code to ADS generated code.

```diff
+import AddIcon from '@atlaskit/icon/core/add';
-<div className="w-4 h-4 text-blue-600">
-  <svg>...</svg>
-</div>
+<AddIcon label="Add item" />

-<span className="inline-flex items-center">
-  <svg className="w-4 h-4 mr-2">...</svg>
-  Text
-</span>
+<AddIcon label="Add item" />
+Text
```

# Common Icon mapping mistakes

❌ `folder` → ✅ `folder-closed` or `folder-open` ❌ `user` → ✅ `person` ❌ `play` → ✅
`video-play` ❌ `arrow` → ✅ `arrow-right`, `arrow-left`, etc. ❌ `chevron` → ✅ `chevron-down`,
`chevron-up`, etc.

# 🚨 Important, **YOU MUST** check the orientiation of the dots in the icon

If the icon has three dots:

- three vertical dots: `<ShowMoreVerticalIcon />`
- three horizontal dots: `<ShowMoreHorizontalIcon />`

# Primary SideNavigation label and `elemBefore` icon combo

If the side navigation primary menu items have the follow label, accompany it with the correct icon
in `elemBefore`. This applies to `LinkMenuItem`, `ButtonMenuItem` and `FlyoutMenuItem`

## Key table

| Label text (in children) | Icon (`elemBefore`) |
| ------------------------ | ------------------- |
| Spaces                   | `<SpacesIcon>`      |
| Apps                     | `<AppsIcon>`        |
| Focus areas              | `<FocusAreaIcon>`   |

## App external links in SideNavigation

```tsx
<LinkMenuItem
	href="/dashboard"
	elemBefore={<SpacesIcon label="" />}
	isSelected={currentPath === '/dashboard'} // 🚨 CRITICAL: Always check current page
>
	Dashboard
</LinkMenuItem>
```

```diff
-import TeamsIcon from '@atlaskit/icon/core/teams';
+import { TeamsIcon } from '@atlaskit/logo';

<LinkMenuItem
	href="/"
	elemBefore={
		<TeamsIcon
			label=""
			size="xsmall"
			shouldUseNewLogoDesign
		/>
	}
	elemAfter={<LinkExternalIcon label="" size="small" />}
>
	Teams
</LinkMenuItem>
```

## LinkMenuItem

For navigation links to different pages/sections:

```tsx
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';

<LinkMenuItem
	href="/dashboard"
	elemBefore={<DashboardIcon label="" />}
	isSelected={currentPath === '/dashboard'} // 🚨 CRITICAL: Always check current page
>
	Dashboard
</LinkMenuItem>;
```

## ButtonMenuItem

For actions that trigger functionality without navigation:

```tsx
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';

<ButtonMenuItem
	onClick={handleAction}
	elemBefore={<AddIcon label="" />}
	isSelected={isModalOpen} // 🚨 CRITICAL: Use for active states
>
	Create Project
</ButtonMenuItem>;
```

## FlyoutMenuItem

For hierarchical navigation (use only for starred/recent items):

```tsx
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';

<FlyoutMenuItem>
	<FlyoutMenuItemTrigger elemBefore={<ProjectIcon label="" />}>Projects</FlyoutMenuItemTrigger>
	<FlyoutMenuItemContent>
		<MenuList>
			<LinkMenuItem href="/projects/web-app">Web Application</LinkMenuItem>
			<LinkMenuItem href="/projects/mobile-app">Mobile Application</LinkMenuItem>
		</MenuList>
	</FlyoutMenuItemContent>
</FlyoutMenuItem>;
```

## Expandable Menu Pattern

Create expandable sections using state with `ButtonMenuItem`:

```tsx
const [isExpanded, setIsExpanded] = useState(false);

<ButtonMenuItem
	onClick={() => setIsExpanded(!isExpanded)}
	elemBefore={<SettingsIcon label="" />}
	elemAfter={isExpanded ? <ChevronDownIcon label="" /> : <ChevronRightIcon label="" />}
>
	Team Settings
</ButtonMenuItem>;
{
	isExpanded && (
		<LinkMenuItem href="/team/members" elemBefore={<div style={{ width: '24px' }} />}>
			Members
		</LinkMenuItem>
	);
}
```

# Table of Icons to use

Replace `COMPONENT_NAME` and `ENTRYPOINT` in this examples with values from the table below.

```tsx
import COMPONENT_NAME from '@atlaskit/icon/core/ENTRYPOINT';
```

| Component Name                   | Entrypoint                       | Keywords                                                                                                                                                      |
| -------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AccessibilityIcon                | accessibility                    | accessibility, icon, core, a11y, accessibility, WCAG                                                                                                          |
| AddIcon                          | add                              | add, plus, create, new, icon, core, create, plus, jira status                                                                                                 |
| AiAgentIcon                      | ai-agent                         | ai-agent, aiagent, icon, core, Rovo, AI, chat agent, ai                                                                                                       |
| AiChatIcon                       | ai-chat                          | ai-chat, aichat, icon, core, Rovo, AI, chat agent, ai                                                                                                         |
| AiGenerativeTextSummaryIcon      | ai-generative-text-summary       | ai-generative-text-summary, aigenerativetextsummary, icon, core, summarize, summarise, summary, automation, AI                                                |
| AlertIcon                        | alert                            | alert, icon, core, alert, event, operations                                                                                                                   |
| AlignImageCenterIcon             | align-image-center               | align-image-center, alignimagecenter, icon, core, content, media, image, alignment, centre                                                                    |
| AlignImageLeftIcon               | align-image-left                 | align-image-left, alignimageleft, icon, core, content, media, image, alignment, left                                                                          |
| AlignImageRightIcon              | align-image-right                | align-image-right, alignimageright, icon, core, content, media, image, alignment, right                                                                       |
| AlignTextCenterIcon              | align-text-center                | align-text-center, aligntextcenter, icon, core, alignment, text, content                                                                                      |
| AlignTextLeftIcon                | align-text-left                  | align-text-left, aligntextleft, icon, core, alignment, text, content, summary                                                                                 |
| AlignTextRightIcon               | align-text-right                 | align-text-right, aligntextright, icon, core, alignment, text, content                                                                                        |
| AngleBracketsIcon                | angle-brackets                   | angle-brackets, anglebrackets, icon, core, code, <>, </>, syntax, jira status                                                                                 |
| ApiIcon                          | api                              | api, icon, core, application programming interface, api, operations                                                                                           |
| AppIcon                          | app                              | app, icon, core, add-on, add on, plugin, external app, third-party app                                                                                        |
| AppSwitcherIcon                  | app-switcher                     | app-switcher, appswitcher, icon, core, application switcher, change product, switch product, product switcher                                                 |
| AppSwitcherLegacyIcon            | app-switcher-legacy              | app-switcher-legacy, appswitcherlegacy, icon, core, application switcher, change product, switch product, product switcher                                    |
| AppsIcon                         | apps                             | apps, icon, core, third-party, applications                                                                                                                   |
| ArchiveBoxIcon                   | archive-box                      | archive-box, archivebox, icon, core, file box                                                                                                                 |
| ArrowDownIcon                    | arrow-down                       | arrow-down, arrowdown, icon, core, down, bottom, sorting                                                                                                      |
| ArrowDownLeftIcon                | arrow-down-left                  | arrow-down-left, arrowdownleft, icon, core, diagonal arrow, down, left, south west                                                                            |
| ArrowDownRightIcon               | arrow-down-right                 | arrow-down-right, arrowdownright, icon, core, diagonal arrow, down, right, south east                                                                         |
| ArrowLeftIcon                    | arrow-left                       | arrow-left, arrowleft, back, previous, icon, core, back, previous                                                                                             |
| ArrowRightIcon                   | arrow-right                      | arrow-right, arrowright, forward, next, icon, core, forward, next, link                                                                                       |
| ArrowUpIcon                      | arrow-up                         | arrow-up, arrowup, icon, core, improvement, jira status                                                                                                       |
| ArrowUpLeftIcon                  | arrow-up-left                    | arrow-up-left, arrowupleft, icon, core, diagonal arrow, up, right, north east                                                                                 |
| ArrowUpRightIcon                 | arrow-up-right                   | arrow-up-right, arrowupright, icon, core, open, diagonal arrow                                                                                                |
| AssetsIcon                       | assets                           | assets, icon, core, assets, CMDB, configuration management database                                                                                           |
| AtlassianIntelligenceIcon        | atlassian-intelligence           | atlassian-intelligence, atlassianintelligence, icon, core, AI                                                                                                 |
| AttachmentIcon                   | attachment                       | attachment, paperclip, icon, core, paperclip, attach, attachment                                                                                              |
| AudioIcon                        | audio                            | audio, music, note, sound, icon, core, music, musical note                                                                                                    |
| AutomationIcon                   | automation                       | automation, icon, core, lightningbolt, automation rule                                                                                                        |
| BacklogIcon                      | backlog                          | backlog, icon, core, rows                                                                                                                                     |
| BasketballIcon                   | basketball                       | basketball, icon, core, ball, sports, basketball                                                                                                              |
| BoardIcon                        | board                            | board, icon, core, columns, active sprint                                                                                                                     |
| BoardsIcon                       | boards                           | boards, icon, core                                                                                                                                            |
| BookWithBookmarkIcon             | book-with-bookmark               | book-with-bookmark, bookwithbookmark, icon, core, knowledge base, article                                                                                     |
| BorderIcon                       | border                           | border, icon, core, border, image border, content border, editor, confluence                                                                                  |
| BranchIcon                       | branch                           | branch, icon, core, git branch, bitbucket branch, branches, jira status                                                                                       |
| BriefcaseIcon                    | briefcase                        | briefcase, icon, core, suitcase, toolbox, operations, business                                                                                                |
| BugIcon                          | bug                              | bug, icon, core, bug report, test                                                                                                                             |
| CalendarIcon                     | calendar                         | calendar, date, icon, core, date, month, day, year, jira status                                                                                               |
| CalendarPlusIcon                 | calendar-plus                    | calendar-plus, calendarplus, icon, core, calendar, add, plus, schedule                                                                                        |
| CameraIcon                       | camera                           | camera, photo, icon, core                                                                                                                                     |
| CaptureIcon                      | capture                          | capture, icon, core, focus, focus area, capture                                                                                                               |
| CardIcon                         | card                             | card, icon, core, card                                                                                                                                        |
| CashIcon                         | cash                             | cash, icon, core, currency, money, cash, dollar, bill, work type                                                                                              |
| ChangesIcon                      | changes                          | changes, icon, core, jira status, horizontal arrows                                                                                                           |
| ChartBarIcon                     | chart-bar                        | chart-bar, chartbar, icon, core, graph, bar, analytics, report                                                                                                |
| ChartMatrixIcon                  | chart-matrix                     | chart-matrix, chartmatrix, icon, core, dot chart, graph, matrix,                                                                                              |
| ChartPieIcon                     | chart-pie                        | chart-pie, chartpie, icon, core, segment, chart, graph, pie                                                                                                   |
| ChartTrendIcon                   | chart-trend                      | chart-trend, charttrend, icon, core, reports, graph, impact effort,                                                                                           |
| ChatWidgetIcon                   | chat-widget                      | chat-widget, chatwidget, icon, core, chat, widget, virtual service agent, vsa                                                                                 |
| CheckCircleIcon                  | check-circle                     | check-circle, checkcircle, tick, icon, core, tick, yes, completed, filled                                                                                     |
| CheckMarkIcon                    | check-mark                       | check-mark, checkmark, icon, core, tick                                                                                                                       |
| CheckboxCheckedIcon              | checkbox-checked                 | checkbox-checked, checkboxchecked, icon, core, filled, checked, select all                                                                                    |
| CheckboxIndeterminateIcon        | checkbox-indeterminate           | checkbox-indeterminate, checkboxindeterminate, icon, core, filled, mixed                                                                                      |
| CheckboxUncheckedIcon            | checkbox-unchecked               | checkbox-unchecked, checkboxunchecked, icon, core, unchecked                                                                                                  |
| ChevronDoubleLeftIcon            | chevron-double-left              | chevron-double-left, chevrondoubleleft, icon, core, double chevron, previous year, left                                                                       |
| ChevronDoubleRightIcon           | chevron-double-right             | chevron-double-right, chevrondoubleright, icon, core, double chevron, right, next year                                                                        |
| ChevronDownIcon                  | chevron-down                     | chevron-down, chevrondown, expand, collapse, icon, core, chevron down, expand, open                                                                           |
| ChevronLeftIcon                  | chevron-left                     | chevron-left, chevronleft, back, previous, icon, core, chevron left, back, previous                                                                           |
| ChevronRightIcon                 | chevron-right                    | chevron-right, chevronright, forward, next, icon, core, chevron right, next, collapsed, expand, show children                                                 |
| ChevronUpIcon                    | chevron-up                       | chevron-up, chevronup, expand, collapse, icon, core, chevron up, close dropdown menu, collapse                                                                |
| ChildWorkItemsIcon               | child-work-items                 | child-work-items, childworkitems, icon, core, children, child, related, work items                                                                            |
| ClipboardIcon                    | clipboard                        | clipboard, icon, core, clipboard, paste                                                                                                                       |
| ClockIcon                        | clock                            | clock, icon, core, time, recent, history                                                                                                                      |
| CloseIcon                        | close                            | close, icon, core, cross, x, close, remove                                                                                                                    |
| CloudArrowUpIcon                 | cloud-arrow-up                   | cloud-arrow-up, cloudarrowup, icon, core, deployments, up arrow                                                                                               |
| CollapseHorizontalIcon           | collapse-horizontal              | collapse-horizontal, collapsehorizontal, icon, core, collapse, width, horizontal arrows                                                                       |
| CollapseVerticalIcon             | collapse-vertical                | collapse-vertical, collapsevertical, icon, core, collapse, height, vertical arrows                                                                            |
| CommentIcon                      | comment                          | comment, chat, speech, icon, core, speech bubble                                                                                                              |
| CommentAddIcon                   | comment-add                      | comment-add, commentadd, icon, core, speech bubble, plus                                                                                                      |
| CommitIcon                       | commit                           | commit, icon, core, git commit, bitbucket commit                                                                                                              |
| CompassIcon                      | compass                          | compass, icon, core, template                                                                                                                                 |
| ComponentIcon                    | component                        | component, block, lego, icon, core, lego, brick, block                                                                                                        |
| ContentWidthNarrowIcon           | content-width-narrow             | content-width-narrow, contentwidthnarrow, icon, core, content, media, image, width, fixed, narrow                                                             |
| ContentWidthWideIcon             | content-width-wide               | content-width-wide, contentwidthwide, icon, core, content, media, image, width, fixed, wide                                                                   |
| ContentWrapLeftIcon              | content-wrap-left                | content-wrap-left, contentwrapleft, icon, core, content, media, image, alignment, left, inline, wrap                                                          |
| ContentWrapRightIcon             | content-wrap-right               | content-wrap-right, contentwrapright, icon, core, content, media, image, alignment, right, inline, wrap                                                       |
| CopyIcon                         | copy                             | copy, duplicate, icon, core, copy, object                                                                                                                     |
| CreditCardIcon                   | credit-card                      | credit-card, creditcard, icon, core, payment, invoice                                                                                                         |
| CrossIcon                        | cross                            | cross, close, x, cancel, icon, core, cross, x, close, remove                                                                                                  |
| CrossCircleIcon                  | cross-circle                     | cross-circle, crosscircle, close, x, cancel, icon, core, x, exit, clear, no, filled                                                                           |
| CurlyBracketsIcon                | curly-brackets                   | curly-brackets, curlybrackets, icon, core, curly brackets, braces, smart value                                                                                |
| CustomizeIcon                    | customize                        | customize, icon, core, customise, configure, modify, preferences, settings, sliders                                                                           |
| DashboardIcon                    | dashboard                        | dashboard, window, grid, icon, core, activity, view                                                                                                           |
| DataFlowIcon                     | data-flow                        | data-flow, dataflow, icon, core, relationship, data, flow chart                                                                                               |
| DataNumberIcon                   | data-number                      | data-number, datanumber, icon, core, numbers, 123, proforma, datatype                                                                                         |
| DataStringIcon                   | data-string                      | data-string, datastring, icon, core, string, letters, abc, proforma, datatype                                                                                 |
| DatabaseIcon                     | database                         | database, icon, core, spreadsheet, table, data, cells                                                                                                         |
| DecisionIcon                     | decision                         | decision, icon, core, fork, diagonal arrow                                                                                                                    |
| DefectIcon                       | defect                           | defect, icon, core, defect, fragile, cracked, work type                                                                                                       |
| DeleteIcon                       | delete                           | delete, icon, core, trash, bin, remove                                                                                                                        |
| DepartmentIcon                   | department                       | department, icon, core, organization, organisation, org chart, hierarchy                                                                                      |
| DeviceMobileIcon                 | device-mobile                    | device-mobile, devicemobile, icon, core, iphone, mobile phone, cell phone                                                                                     |
| DevicesIcon                      | devices                          | devices, icon, core, devices, assets, laptop, phone, hardware, work type                                                                                      |
| DiscoveryIcon                    | discovery                        | discovery, icon, core, discovery, note, filled, onboarding, status                                                                                            |
| DownloadIcon                     | download                         | download, cloud, icon, core, down arrow, file download                                                                                                        |
| DragHandleHorizontalIcon         | drag-handle-horizontal           | drag-handle-horizontal, draghandlehorizontal, icon, core, drag handler, reorder, move, reorder horizontal                                                     |
| DragHandleVerticalIcon           | drag-handle-vertical             | drag-handle-vertical, draghandlevertical, icon, core, drag handler, reorder, move, reorder vertical                                                           |
| EditIcon                         | edit                             | edit, pencil, write, icon, core, pencil, pencil on page                                                                                                       |
| EditBulkIcon                     | edit-bulk                        | edit-bulk, editbulk, icon, core, edit, pencil, multiple, bulk, change                                                                                         |
| EmailIcon                        | email                            | email, icon, core, envelope, message                                                                                                                          |
| EmojiIcon                        | emoji                            | emoji, emoticon, smiley, icon, core, smiley face, emoticon                                                                                                    |
| EmojiAddIcon                     | emoji-add                        | emoji-add, emojiadd, icon, core, smiley face, emoticon, plus                                                                                                  |
| EmojiCasualIcon                  | emoji-casual                     | emoji-casual, emojicasual, icon, core, emoij, casual, sunglasses, chill, relaxed                                                                              |
| EmojiNeutralIcon                 | emoji-neutral                    | emoji-neutral, emojineutral, icon, core, emoji, neutral, ambivalent                                                                                           |
| EmojiRemoveIcon                  | emoji-remove                     | emoji-remove, emojiremove, icon, core, emoji, remove, strikethrough                                                                                           |
| EpicIcon                         | epic                             | epic, icon, core, lightning bolt, jira status, filled                                                                                                         |
| ErrorIcon                        | error                            | error, warning, alert, icon, core, filled, status, danger, exclamation, !, error                                                                              |
| ExclamationSquareIcon            | exclamation-square               | exclamation-square, exclamationsquare, icon, core, !, exclaim, square, work type                                                                              |
| ExpandHorizontalIcon             | expand-horizontal                | expand-horizontal, expandhorizontal, icon, core, expand, width, horizontal arrows, maximum width, stretch, fit                                                |
| ExpandVerticalIcon               | expand-vertical                  | expand-vertical, expandvertical, icon, core, expand, height, vertical arrows, maximum height, stretch, fit                                                    |
| EyeOpenIcon                      | eye-open                         | eye-open, eyeopen, icon, core, watch, visible, visbility, permissions                                                                                         |
| EyeOpenFilledIcon                | eye-open-filled                  | eye-open-filled, eyeopenfilled, icon, core, watching, visible, visbility, permissions, filled                                                                 |
| EyeOpenStrikethroughIcon         | eye-open-strikethrough           | eye-open-strikethrough, eyeopenstrikethrough, icon, core, unwatch, invisible, visibility, permissions                                                         |
| FeedIcon                         | feed                             | feed, icon, core, feed, updates, release notes, what's new                                                                                                    |
| FeedbackIcon                     | feedback                         | feedback, announce, speaker, megaphone, icon, core, diagonal arrow, chat bubble, survey, critique                                                             |
| FieldIcon                        | field                            | field, icon, core, field, form, input, label                                                                                                                  |
| FieldAlertIcon                   | field-alert                      | field-alert, fieldalert, icon, core, field, alert, warning, change                                                                                            |
| FieldCheckboxGroupIcon           | field-checkbox-group             | field-checkbox-group, fieldcheckboxgroup, icon, core, form, field, input type, checkbox, multi-select, options                                                |
| FieldDropdownIcon                | field-dropdown                   | field-dropdown, fielddropdown, icon, core, form, field, select, dropdown                                                                                      |
| FieldRadioGroupIcon              | field-radio-group                | field-radio-group, fieldradiogroup, icon, core, form, field, input type, radio, single-select, options                                                        |
| FileIcon                         | file                             | file, document, paper, page, sheet, icon, core, document, file, paper                                                                                         |
| FilesIcon                        | files                            | files, icon, core, documents, files, papers                                                                                                                   |
| FilterIcon                       | filter                           | filter, icon, core, funnel, refine                                                                                                                            |
| FlagIcon                         | flag                             | flag, icon, core, important, emoji category                                                                                                                   |
| FlagFilledIcon                   | flag-filled                      | flag-filled, flagfilled, icon, core, flag, important, filled                                                                                                  |
| FlaskIcon                        | flask                            | flask, icon, core, labs, test, erlenmeyer flask, beaker                                                                                                       |
| FocusAreaIcon                    | focus-area                       | focus-area, focusarea, icon, core, focus, focus area, capture                                                                                                 |
| FolderClosedIcon                 | folder-closed                    | folder-closed, folderclosed, icon, core, directory                                                                                                            |
| FolderOpenIcon                   | folder-open                      | folder-open, folderopen, icon, core, directory                                                                                                                |
| FormIcon                         | form                             | form, icon, core, form, fields                                                                                                                                |
| FullscreenEnterIcon              | fullscreen-enter                 | fullscreen-enter, fullscreenenter, icon, core, full screen                                                                                                    |
| FullscreenExitIcon               | fullscreen-exit                  | fullscreen-exit, fullscreenexit, icon, core, un-full screen, un-fullscreen                                                                                    |
| GlassesIcon                      | glasses                          | glasses, icon, core, glasses, knowledge, learning, spectacles, education                                                                                      |
| GlobeIcon                        | globe                            | globe, icon, core, world                                                                                                                                      |
| GoalIcon                         | goal                             | goal, icon, core, target                                                                                                                                      |
| GridIcon                         | grid                             | grid, icon, core, view all content, tile view, layout, grid, tiles                                                                                            |
| GrowDiagonalIcon                 | grow-diagonal                    | grow-diagonal, growdiagonal, icon, core, grow, width and height, diagonal arrows                                                                              |
| GrowHorizontalIcon               | grow-horizontal                  | grow-horizontal, growhorizontal, icon, core, grow, width, horizontal arrows                                                                                   |
| GrowVerticalIcon                 | grow-vertical                    | grow-vertical, growvertical, icon, core, grow, height, vertical arrows                                                                                        |
| HashtagIcon                      | hashtag                          | hashtag, icon, core, tag, topic, pound                                                                                                                        |
| HeadphonesIcon                   | headphones                       | headphones, icon, core, audio, music, headphones                                                                                                              |
| HeartIcon                        | heart                            | heart, icon, core, like, love, emoji category                                                                                                                 |
| HighlightIcon                    | highlight                        | highlight, icon, core, highlight, highlighter, stabilo, pen                                                                                                   |
| HomeIcon                         | home                             | home, icon, core, house, building                                                                                                                             |
| ImageIcon                        | image                            | image, picture, photo, icon, core, picture, asset                                                                                                             |
| ImageFullscreenIcon              | image-fullscreen                 | image-fullscreen, imagefullscreen, icon, core, image, fullscreen, enlarge                                                                                     |
| ImageInlineIcon                  | image-inline                     | image-inline, imageinline, icon, core, image, layout, inline                                                                                                  |
| ImageScaledIcon                  | image-scaled                     | image-scaled, imagescaled, icon, core, image, layout, scaled                                                                                                  |
| InboxIcon                        | inbox                            | inbox, icon, core, document tray, work, letter, post                                                                                                          |
| IncidentIcon                     | incident                         | incident, icon, core, witches hat, traffic cone, jira status                                                                                                  |
| InformationIcon                  | information                      | information, icon, core, info, filled, status, information                                                                                                    |
| InformationCircleIcon            | information-circle               | information-circle, informationcircle, icon, core, information, circle, info                                                                                  |
| KeyResultIcon                    | key-result                       | key-result, keyresult, icon, core, target, bullseye, key result, arrow, bow, archery, OKR                                                                     |
| LayoutOneColumnIcon              | layout-one-column                | layout-one-column, layoutonecolumn, icon, core, layout, column, 1 col                                                                                         |
| LayoutThreeColumnsIcon           | layout-three-columns             | layout-three-columns, layoutthreecolumns, icon, core, layout, columns, 3 col, 3 cols                                                                          |
| LayoutThreeColumnsSidebarsIcon   | layout-three-columns-sidebars    | layout-three-columns-sidebars, layoutthreecolumnssidebars, icon, core, layout, columns, 3 col, 3 cols, sidebars, asides                                       |
| LayoutTwoColumnsIcon             | layout-two-columns               | layout-two-columns, layouttwocolumns, icon, core, layout, columns, 2 col, 2 cols                                                                              |
| LayoutTwoColumnsSidebarLeftIcon  | layout-two-columns-sidebar-left  | layout-two-columns-sidebar-left, layouttwocolumnssidebarleft, icon, core, layout, columns, 2 col, 2 cols, sidebar, aside                                      |
| LayoutTwoColumnsSidebarRightIcon | layout-two-columns-sidebar-right | layout-two-columns-sidebar-right, layouttwocolumnssidebarright, icon, core, layout, columns, 2 col, 2 cols, sidebar, aside                                    |
| LibraryIcon                      | library                          | library, icon, core, library, drawer, drawers, filing cabinet                                                                                                 |
| LightbulbIcon                    | lightbulb                        | lightbulb, idea, hint, icon, core, idea, initiative, tip, learnings                                                                                           |
| LinkIcon                         | link                             | link, icon, core, url, hyperlink, website, www, http,                                                                                                         |
| LinkBrokenIcon                   | link-broken                      | link-broken, linkbroken, icon, core, unlink, remove link, break link, url, hyperlink, website, www, https                                                     |
| LinkExternalIcon                 | link-external                    | link-external, linkexternal, icon, core, new tab, new window, open in, url, hyperlink, www, http, https, website, external, shortcut, diagonal arrow, offsite |
| ListBulletedIcon                 | list-bulleted                    | list-bulleted, listbulleted, icon, core, bullets, unordered list                                                                                              |
| ListChecklistIcon                | list-checklist                   | list-checklist, listchecklist, icon, core, list, check mark, to-do, requirements, checklist, work type                                                        |
| ListNumberedIcon                 | list-numbered                    | list-numbered, listnumbered, icon, core, list, numbers                                                                                                        |
| LobbyBellIcon                    | lobby-bell                       | lobby-bell, lobbybell, icon, core, ding, risks                                                                                                                |
| LocationIcon                     | location                         | location, pin, gps, map, icon, core, map, pin, address                                                                                                        |
| LockLockedIcon                   | lock-locked                      | lock-locked, locklocked, icon, core, permissions, no access, restricted, security, secure, forbidden, authentication                                          |
| LockUnlockedIcon                 | lock-unlocked                    | lock-unlocked, lockunlocked, icon, core, open permissions, unrestricted access, security, insecure, authentication                                            |
| LogInIcon                        | log-in                           | log-in, login, icon, core, sign in, enter, account                                                                                                            |
| LogOutIcon                       | log-out                          | log-out, logout, icon, core, sign out, exit, account                                                                                                          |
| MagicWandIcon                    | magic-wand                       | magic-wand, magicwand, icon, core, magic, wand, suggestion                                                                                                    |
| MarkdownIcon                     | markdown                         | markdown, icon, core, markdown, md, markup                                                                                                                    |
| MarketplaceIcon                  | marketplace                      | marketplace, store, shop, icon, core, app store, storefront, stand, third-party developer                                                                     |
| MaximizeIcon                     | maximize                         | maximize, icon, core, diagonal, resize, enlarge                                                                                                               |
| MegaphoneIcon                    | megaphone                        | megaphone, icon, core, announcement, bullhorn, feedback, news                                                                                                 |
| MentionIcon                      | mention                          | mention, user, person, @, icon, core, at symbol, @, tag, username                                                                                             |
| MenuIcon                         | menu                             | menu, hamburger, navigation, switcher, app switcher, icon, core, menu, top navigation, 3 lines, hamburger                                                     |
| MergeFailureIcon                 | merge-failure                    | merge-failure, mergefailure, icon, core, git merge, bitbucket merge, merge fail, cross, x                                                                     |
| MergeSuccessIcon                 | merge-success                    | merge-success, mergesuccess, icon, core, git merge, bitbucket merge, merge success, check mark                                                                |
| MicrophoneIcon                   | microphone                       | microphone, icon, core, mic, mic on, voice, speak                                                                                                             |
| MinimizeIcon                     | minimize                         | minimize, icon, core, minimize, dock                                                                                                                          |
| MinusIcon                        | minus                            | minus, icon, core, rule, horizontal line, divider, minus, subtract                                                                                            |
| MinusSquareIcon                  | minus-square                     | minus-square, minussquare, icon, core, square, minus, subtract, work type                                                                                     |
| NodeIcon                         | node                             | node, icon, core, page, dot, page tree, navigation                                                                                                            |
| NoteIcon                         | note                             | note, icon, core, note, post-it, sticky                                                                                                                       |
| NotificationIcon                 | notification                     | notification, bell, alarm, icon, core, bell, alert                                                                                                            |
| NotificationMutedIcon            | notification-muted               | notification-muted, notificationmuted, icon, core, bell, alert, notification, mute                                                                            |
| ObjectiveIcon                    | objective                        | objective, icon, core, target, bullseye, objective                                                                                                            |
| OfficeBuildingIcon               | office-building                  | office-building, officebuilding, icon, core, organization, organisation, business                                                                             |
| OnCallIcon                       | on-call                          | on-call, oncall, icon, core, phone, on-call, support                                                                                                          |
| OperationsIcon                   | operations                       | operations, icon, core, incident management, alerting, opsgenie, it operations, it ops, radar                                                                 |
| PageIcon                         | page                             | page, file, document, icon, core, single page, feed, document, jira status                                                                                    |
| PagesIcon                        | pages                            | pages, icon, core, multiple pages, feeds, documents                                                                                                           |
| PaintBucketIcon                  | paint-bucket                     | paint-bucket, paintbucket, icon, core, paint, bucket, fill, background, customize                                                                             |
| PaintPaletteIcon                 | paint-palette                    | paint-palette, paintpalette, icon, core, background, customize                                                                                                |
| PanelLeftIcon                    | panel-left                       | panel-left, panelleft, icon, core, detail view, left rail, drawer, preview panel, sidebar                                                                     |
| PanelRightIcon                   | panel-right                      | panel-right, panelright, icon, core, detail view, right rail, drawer, preview panel, sidebar                                                                  |
| PenIcon                          | pen                              | pen, icon, core, pen tool, nib, fountain pen, design, work type                                                                                               |
| PeopleGroupIcon                  | people-group                     | people-group, peoplegroup, person, user, group, icon, core, users, customers, people                                                                          |
| PersonIcon                       | person                           | person, person, user, avatar, icon, core, user, customer                                                                                                      |
| PersonAddIcon                    | person-add                       | person-add, personadd, icon, core, user, customer, plus                                                                                                       |
| PersonAddedIcon                  | person-added                     | person-added, personadded, icon, core, user, customer, check, tick                                                                                            |
| PersonAvatarIcon                 | person-avatar                    | person-avatar, personavatar, icon, core, user, customer                                                                                                       |
| PersonOffboardIcon               | person-offboard                  | person-offboard, personoffboard, icon, core, user, customer, right arrow                                                                                      |
| PersonRemoveIcon                 | person-remove                    | person-remove, personremove, icon, core, person, remove, delete, unfollow                                                                                     |
| PersonWarningIcon                | person-warning                   | person-warning, personwarning, icon, core, person, warning, alert                                                                                             |
| PhoneIcon                        | phone                            | phone, icon, core, call, dial out                                                                                                                             |
| PinIcon                          | pin                              | pin, icon, core, push pin, thumbtack, tack                                                                                                                    |
| PinFilledIcon                    | pin-filled                       | pin-filled, pinfilled, icon, core, push pin, thumbtack, tack, filled                                                                                          |
| PlusSquareIcon                   | plus-square                      | plus-square, plussquare, icon, core, square, plus, add, work type                                                                                             |
| PowerPlugIcon                    | power-plug                       | power-plug, powerplug, icon, core, plug-in, add-on, socket                                                                                                    |
| PremiumIcon                      | premium                          | premium, icon, core, AI, sparkles, stars, new, feature                                                                                                        |
| PresenterModeIcon                | presenter-mode                   | presenter-mode, presentermode, icon, core, pointer, cursor, presentation, present                                                                             |
| PrinterIcon                      | printer                          | printer, icon, core, print                                                                                                                                    |
| PriorityBlockerIcon              | priority-blocker                 | priority-blocker, priorityblocker, icon, core, blocked, showstopper, work type status                                                                         |
| PriorityCriticalIcon             | priority-critical                | priority-critical, prioritycritical, icon, core, priority, work type status                                                                                   |
| PriorityHighIcon                 | priority-high                    | priority-high, priorityhigh, icon, core, priority, work type status                                                                                           |
| PriorityHighestIcon              | priority-highest                 | priority-highest, priorityhighest, icon, core, priority, work type status                                                                                     |
| PriorityLowIcon                  | priority-low                     | priority-low, prioritylow, icon, core, priority, work type status                                                                                             |
| PriorityLowestIcon               | priority-lowest                  | priority-lowest, prioritylowest, icon, core, priority, work type status                                                                                       |
| PriorityMajorIcon                | priority-major                   | priority-major, prioritymajor, icon, core, priority, work type status                                                                                         |
| PriorityMediumIcon               | priority-medium                  | priority-medium, prioritymedium, icon, core, priority, work type status                                                                                       |
| PriorityMinorIcon                | priority-minor                   | priority-minor, priorityminor, icon, core, priority, work type status                                                                                         |
| PriorityTrivialIcon              | priority-trivial                 | priority-trivial, prioritytrivial, icon, core, priority, work type status                                                                                     |
| ProblemIcon                      | problem                          | problem, icon, core, stop, priority, work type status                                                                                                         |
| ProjectIcon                      | project                          | project, icon, core, rocket, rocketship, spaceship                                                                                                            |
| ProjectStatusIcon                | project-status                   | project-status, projectstatus, icon, core, status, traffic lights                                                                                             |
| ProjectionScreenIcon             | projection-screen                | projection-screen, projectionscreen, icon, core, present, presentation, projector screen, keynote                                                             |
| PullRequestIcon                  | pull-request                     | pull-request, pullrequest, icon, core, git pull request, bitbucket pull request, jira status                                                                  |
| PulseIcon                        | pulse                            | pulse, icon, core, pulse, wave, heartbeat, health                                                                                                             |
| QuestionCircleIcon               | question-circle                  | question-circle, questioncircle, help, icon, core, help, answers, faq, jira status                                                                            |
| QuotationMarkIcon                | quotation-mark                   | quotation-mark, quotationmark, icon, core, quote, testimonial, blockquote, jira status                                                                        |
| RadioCheckedIcon                 | radio-checked                    | radio-checked, radiochecked, icon, core, radio, input type, selected                                                                                          |
| RadioUncheckedIcon               | radio-unchecked                  | radio-unchecked, radiounchecked, icon, core, radio, input type, unselected                                                                                    |
| RedoIcon                         | redo                             | redo, icon, core, editor, redo, backwards                                                                                                                     |
| RefreshIcon                      | refresh                          | refresh, cycle, icon, core, refresh, reload, update, circular arrows, replay                                                                                  |
| ReleaseIcon                      | release                          | release, icon, core, ship, boat                                                                                                                               |
| RetryIcon                        | retry                            | retry, icon, core, try again,                                                                                                                                 |
| RoadmapIcon                      | roadmap                          | roadmap, icon, core                                                                                                                                           |
| ScalesIcon                       | scales                           | scales, icon, core, scales, rule, law                                                                                                                         |
| ScorecardIcon                    | scorecard                        | scorecard, icon, core, tick, check, circle, unfinished                                                                                                        |
| ScreenIcon                       | screen                           | screen, desktop, computer, monitor, icon, core, display, monitor, desktop                                                                                     |
| ScreenPlusIcon                   | screen-plus                      | screen-plus, screenplus, icon, core, screen, display, monitor, plus, add                                                                                      |
| SearchIcon                       | search                           | search, find, magnify, icon, core, magnifying glass                                                                                                           |
| SendIcon                         | send                             | send, mail, icon, core, submit, paper airplane, paper aeroplane                                                                                               |
| SettingsIcon                     | settings                         | settings, cog, options, configuration, icon, core, system preferences, gear, cog                                                                              |
| ShapesIcon                       | shapes                           | shapes, icon, core, objects, whiteboard, asset, graphic                                                                                                       |
| ShareIcon                        | share                            | share, icon, core, share, access                                                                                                                              |
| ShieldIcon                       | shield                           | shield, icon, core, security, secure, safety, defence, protection, guard                                                                                      |
| ShieldStrikethroughIcon          | shield-strikethrough             | shield-strikethrough, shieldstrikethrough, icon, core, ️security, secure, safety, defence, protection, guard, strikethrough, classification                   |
| ShortcutIcon                     | shortcut                         | shortcut, export, icon, core, addshortcut, square, plus                                                                                                       |
| ShowMoreHorizontalIcon           | show-more-horizontal             | show-more-horizontal, showmorehorizontal, icon, core, ellipses, three dots, meatball, more actions                                                            |

<<<<<<< HEAD | ShowMoreVerticalIcon | show-more-vertical | show-more-vertical, showmorevertical,
more, menu, options, kebab-menu, ellipsis-vertical, show-more-vertical, three-dots, vertical-dots,
actions, overflow, settings | ======= | ShowMoreVerticalIcon | show-more-vertical |
show-more-vertical, showmorevertical, icon, core, three dots, kebab, more actions |

> > > > > > > 2feb43959334d (Updates to icons and heading) | ShrinkDiagonalIcon | shrink-diagonal |
> > > > > > > shrink-diagonal, shrinkdiagonal, icon, core, resize, diagonal arrows | |
> > > > > > > ShrinkHorizontalIcon | shrink-horizontal | shrink-horizontal, shrinkhorizontal, icon,
> > > > > > > core, contract, width, horizontal arrows | | ShrinkVerticalIcon | shrink-vertical |
> > > > > > > shrink-vertical, shrinkvertical, icon, core, contract, height, vertical arrows | |
> > > > > > > SidebarCollapseIcon | sidebar-collapse | sidebar-collapse, sidebarcollapse, icon,
> > > > > > > core, navigation, close sidebar | | SidebarExpandIcon | sidebar-expand |
> > > > > > > sidebarexpand, icon, core, navigation, open sidebar | | SmartLinkIcon | smart-link |
> > > > > > > smart-link, smartlink, icon, core, smart link | | SmartLinkCardIcon | smart-link-card
> > > > > > > | smart-link-card, smartlinkcard, icon, core, smart link, url, card, link preview | |
> > > > > > > SmartLinkEmbedIcon | smart-link-embed | smart-link-embed, smartlinkembed, icon, core,
> > > > > > > smart link, url, embed | | SmartLinkInlineIcon | smart-link-inline |
> > > > > > > smart-link-inline, smartlinkinline, icon, core, smart link, url, inline | |
> > > > > > > SmartLinkListIcon | smart-link-list | smart-link-list, smartlinklist, icon, core,
> > > > > > > smart link, url, embed, list, table, linked search results | | SnippetIcon | snippet |
> > > > > > > snippet, icon, core, scissors, cut | | SortAscendingIcon | sort-ascending |
> > > > > > > sort-ascending, sortascending, icon, core, data, sort, up | | SortDescendingIcon |
> > > > > > > sort-descending | sort-descending, sortdescending, icon, core, data, sort, down | |
> > > > > > > SpreadsheetIcon | spreadsheet | spreadsheet, icon, core, table, cells, data | |
> > > > > > > SprintIcon | sprint | sprint, icon, core, loop, iterate | | StarStarredIcon |
> > > > > > > star-starred | star-starred, starstarred, icon, core, favourite, star, starred, filled
> > > > > > > | | StarUnstarredIcon | star-unstarred | star-unstarred, starunstarred, icon, core,
> > > > > > > favourite, star | | StatusDiscoveryIcon | status-discovery | status-discovery,
> > > > > > > statusdiscovery, icon, core, discovery, note, filled, onboarding, status | |
> > > > > > > StatusErrorIcon | status-error | status-error, statuserror, icon, core, filled,
> > > > > > > status, danger, exclamation, !, error | | StatusInformationIcon | status-information |
> > > > > > > status-information, statusinformation, icon, core, info, filled, status, information |
> > > > > > > | StatusSuccessIcon | status-success | status-success, statussuccess, icon, core,
> > > > > > > tick, completed, success, filled, check mark, status | | StatusVerifiedIcon |
> > > > > > > status-verified | status-verified, statusverified, icon, core, verified badge, status
> > > > > > > | | StatusWarningIcon | status-warning | status-warning, statuswarning, icon, core,
> > > > > > > alert, filled, exclamation, !, warning, status | | StopwatchIcon | stopwatch |
> > > > > > > stopwatch, icon, core, timer | | StoryIcon | story | story, icon, core, bookmark, work
> > > > > > > type | | StrokeWeightExtraLargeIcon | stroke-weight-extra-large |
> > > > > > > stroke-weight-extra-large, strokeweightextralarge, icon, core, border, weight,
> > > > > > > thickness, stroke, confluence, editor, whiteboards, thickest | | StrokeWeightLargeIcon
> > > > > > > | stroke-weight-large | stroke-weight-large, strokeweightlarge, icon, core, border,
> > > > > > > weight, thickness, stroke, thick, confluence, editor, whiteboards | |
> > > > > > > StrokeWeightMediumIcon | stroke-weight-medium | stroke-weight-medium,
> > > > > > > strokeweightmedium, icon, core, border, weight, stroke, medium, thickness, confluence,
> > > > > > > editor, whiteboards | | StrokeWeightSmallIcon | stroke-weight-small |
> > > > > > > stroke-weight-small, strokeweightsmall, icon, core, border, weight, thickness, stroke,
> > > > > > > confluence, editor, whiteboards, thin | | SubtasksIcon | subtasks | subtasks, icon,
> > > > > > > core, todo, checklist, work type | | SuccessIcon | success | success, icon, core,
> > > > > > > tick, completed, success, filled, check mark, status | | SupportIcon | support |
> > > > > > > support, icon, core, support, help, life raft, life ring, lifebuoy, life preserver | |
> > > > > > > TableCellClearIcon | table-cell-clear | table-cell-clear, tablecellclear, icon, core,
> > > > > > > table, cell, clear, empty | | TableCellMergeIcon | table-cell-merge |
> > > > > > > table-cell-merge, tablecellmerge, icon, core, table, cell, merge, combine, join | |
> > > > > > > TableCellSplitIcon | table-cell-split | table-cell-split, tablecellsplit, icon, core,
> > > > > > > table, cell, split, divide, separate | | TableColumnAddLeftIcon |
> > > > > > > table-column-add-left | table-column-add-left, tablecolumnaddleft, icon, core, table,
> > > > > > > column, add, plus, left, before | | TableColumnAddRightIcon | table-column-add-right |
> > > > > > > table-column-add-right, tablecolumnaddright, icon, core, table, column, add, right,
> > > > > > > after | | TableColumnDeleteIcon | table-column-delete | table-column-delete,
> > > > > > > tablecolumndelete, icon, core, table, column, delete, remove, x | |
> > > > > > > TableColumnMoveLeftIcon | table-column-move-left | table-column-move-left,
> > > > > > > tablecolumnmoveleft, icon, core, table, column, move, left, arrow | |
> > > > > > > TableColumnMoveRightIcon | table-column-move-right | table-column-move-right,
> > > > > > > tablecolumnmoveright, icon, core, table, column, move, right, arrow | |
> > > > > > > TableColumnsDistributeIcon | table-columns-distribute | table-columns-distribute,
> > > > > > > tablecolumnsdistribute, icon, core, table, columns, distribute, even, equidistant | |
> > > > > > > TableRowAddAboveIcon | table-row-add-above | table-row-add-above, tablerowaddabove,
> > > > > > > icon, core, table, row, add, plus, above, up | | TableRowAddBelowIcon |
> > > > > > > table-row-add-below | table-row-add-below, tablerowaddbelow, icon, core, table, row,
> > > > > > > add, plus, below, down | | TableRowDeleteIcon | table-row-delete | table-row-delete,
> > > > > > > tablerowdelete, icon, core, table, row, delete, remove, x | | TableRowMoveDownIcon |
> > > > > > > table-row-move-down | table-row-move-down, tablerowmovedown, icon, core, table, row,
> > > > > > > move, down, arrow, after | | TableRowMoveUpIcon | table-row-move-up |
> > > > > > > table-row-move-up, tablerowmoveup, icon, core, table, row, move, up, arrow, above | |
> > > > > > > TagIcon | tag | tag, icon, core, label, topic | | TakeoutFoodIcon | takeout-food |
> > > > > > > takeout-food, takeoutfood, icon, core, takeaway, takeout, food, burger, drink | |
> > > > > > > TargetIcon | target | target, icon, core, target, bullseye | | TaskIcon | task | task,
> > > > > > > check, tick, icon, core, single task, todo, list, check mark, tick | |
> > > > > > > TaskInProgressIcon | task-in-progress | task-in-progress, taskinprogress, icon, core,
> > > > > > > calendar, task, status, in progress | | TaskToDoIcon | task-to-do | task-to-do,
> > > > > > > tasktodo, icon, core, calendar, task, to-do, todo, status | | TasksIcon | tasks |
> > > > > > > tasks, icon, core, multiple tasks, todo, list, check mark, tick | | TeamsIcon | teams
> > > > > > > | teams, icon, core, infinite love, people, persons, customers, users | | TextIcon |
> > > > > > > text | text, icon, core, character, font, letter, type, typography, text | |
> > > > > > > TextBoldIcon | text-bold | text-bold, textbold, icon, core, text, type, bold, font | |
> > > > > > > TextHeadingIcon | text-heading | text-heading, textheading, icon, core, text, heading,
> > > > > > > H, editor, text style | | TextIndentLeftIcon | text-indent-left | text-indent-left,
> > > > > > > textindentleft, icon, core, text, outdent, left, arrow | | TextIndentRightIcon |
> > > > > > > text-indent-right | text-indent-right, textindentright, icon, core, text, indent,
> > > > > > > right, arrow | | TextItalicIcon | text-italic | text-italic, textitalic, icon, core,
> > > > > > > text, type, italic, font | | TextShortenIcon | text-shorten | text-shorten,
> > > > > > > textshorten, icon, core, text, shorten, abbreviate, condense, AI | |
> > > > > > > TextSpellcheckIcon | text-spellcheck | text-spellcheck, textspellcheck, icon, core,
> > > > > > > text, spelling, typo, spellcheck | | TextStrikethroughIcon | text-strikethrough |
> > > > > > > text-strikethrough, textstrikethrough, icon, core, text, strikethrough, editor, cross
> > > > > > > out | | TextStyleIcon | text-style | text-style, textstyle, icon, core, characters,
> > > > > > > font, letters, type, typography | | TextUnderlineIcon | text-underline |
> > > > > > > text-underline, textunderline, icon, core, text, underline, U, editor | | TextWrapIcon
> > > > > > > | text-wrap | text-wrap, textwrap, icon, core, text, wrap, line wrap | | ThemeIcon |
> > > > > > > theme | theme, icon, core, theme, light mode, dark mode, theme switcher | |
> > > > > > > ThumbsDownIcon | thumbs-down | thumbs-down, thumbsdown, icon, core, vote, downvote,
> > > > > > > dislike, feedback, hand | | ThumbsUpIcon | thumbs-up | thumbs-up, thumbsup, icon,
> > > > > > > core, vote, upvote, like, feedback, hand | | TimelineIcon | timeline | timeline, icon,
> > > > > > > core, gantt, calendar | | ToolsIcon | tools | tools, icon, core, tools, wrench,
> > > > > > > spanner, screwdriver | | TransitionIcon | transition | transition, icon, core,
> > > > > > > connector, movement | | TranslateIcon | translate | translate, icon, core, language,
> > > > > > > translation, globe | | TreeIcon | tree | tree, icon, core, hierarchy, org chart,
> > > > > > > structure | | UndoIcon | undo | undo, icon, core, editor, undo, backwards | |
> > > > > > > UploadIcon | upload | upload, cloud, icon, core, up arrow, file upload | |
> > > > > > > VehicleCarIcon | vehicle-car | vehicle-car, vehiclecar, icon, core, car,
> > > > > > > transportation, delivery | | VideoIcon | video | video, icon, core, video file, video
> > > > > > > content | | VideoNextIcon | video-next | video-next, videonext, icon, core, next,
> > > > > > > skip, video control | | VideoNextOverlayIcon | video-next-overlay |
> > > > > > > video-next-overlay, videonextoverlay, icon, core, next, skip, video control, overlay |
> > > > > > > | VideoPauseIcon | video-pause | video-pause, videopause, icon, core, pause, video
> > > > > > > control | | VideoPauseOverlayIcon | video-pause-overlay | video-pause-overlay,
> > > > > > > videopauseoverlay, icon, core, pause, video control, overlay | | VideoPlayIcon |
> > > > > > > video-play | video-play, videoplay, icon, core, play, video control | |
> > > > > > > VideoPlayOverlayIcon | video-play-overlay | video-play-overlay, videoplayoverlay,
> > > > > > > icon, core, play, video control, overlay | | VideoPreviousIcon | video-previous |
> > > > > > > video-previous, videoprevious, icon, core, previous, rewind, video control | |
> > > > > > > VideoPreviousOverlayIcon | video-previous-overlay | video-previous-overlay,
> > > > > > > videopreviousoverlay, icon, core, previous, rewind, video control, overlay | |
> > > > > > > VideoSkipBackwardFifteenIcon | video-skip-backward-fifteen |
> > > > > > > video-skip-backward-fifteen, videoskipbackwardfifteen, icon, core, skip, backward, 15
> > > > > > > seconds, video control | | VideoSkipBackwardTenIcon | video-skip-backward-ten |
> > > > > > > video-skip-backward-ten, videoskipbackwardten, icon, core, skip, backward, 10 seconds,
> > > > > > > video control | | VideoSkipForwardFifteenIcon | video-skip-forward-fifteen |
> > > > > > > video-skip-forward-fifteen, videoskipforwardfifteen, icon, core, skip, forward, 15
> > > > > > > seconds, video control | | VideoSkipForwardTenIcon | video-skip-forward-ten |
> > > > > > > video-skip-forward-ten, videoskipforwardten, icon, core, skip, forward, 10 seconds,
> > > > > > > video control | | VideoStopIcon | video-stop | video-stop, videostop, icon, core,
> > > > > > > stop, video control | | VideoStopOverlayIcon | video-stop-overlay |
> > > > > > > video-stop-overlay, videostopoverlay, icon, core, stop, video control, overlay | |
> > > > > > > VolumeHighIcon | volume-high | volume-high, volumehigh, icon, core, volume, high,
> > > > > > > unmuted, audio | | VolumeLowIcon | volume-low | volume-low, volumelow, icon, core,
> > > > > > > volume, low, quiet, audio | | VolumeMutedIcon | volume-muted | volume-muted,
> > > > > > > volumemuted, icon, core, volume, muted, no sound, audio | | WarningIcon | warning |
> > > > > > > warning, alert, icon, core, filled, status, exclamation, !, warning | | WhiteboardIcon
> > > > > > > | whiteboard | whiteboard, icon, core, whiteboard, canvas, drawing | | WorkItemIcon |
> > > > > > > work-item | work-item, workitem, icon, core, work item, task, issue | | WorkItemsIcon
> > > > > > > | work-items | work-items, workitems, icon, core, work items, tasks, issues | |
> > > > > > > ZoomInIcon | zoom-in | zoom-in, zoomin, icon, core, zoom, magnify, enlarge | <<<<<<<
> > > > > > > HEAD

# | ZoomOutIcon | zoom-out | zoom-out, zoomout, icon, core, zoom, reduce, shrink |

| ZoomOutIcon | zoom-out | zoom-out, zoomout, icon, core, zoom, reduce, shrink |

> > > > > > > 2feb43959334d (Updates to icons and heading)
