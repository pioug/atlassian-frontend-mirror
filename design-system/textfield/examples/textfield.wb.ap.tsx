import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './00-basic';
import HtmlPropsExample from './00-html-props';
import VariationsVrExample from './01-variations.vr.ap';
import WidthsVrExample from './01-widths.vr.ap';
import FormExampleSource from './02-form-example';
import ForwardedRefsExample from './04-forwarded-refs';
import ElementsBeforeAndAfterVrExample from './05-elements-before-and-after.vr.ap';
import MaxvalueExample from './07-maxvalue';
import CustomisationVrExample from './08-customisation.vr.ap';
import TestingExample from './99-testing';

const Basic: WorkbenchExample = wb(BasicExample);

export default Basic;
export const HtmlProps: WorkbenchExample = wb(HtmlPropsExample);
export const VariationsVr: WorkbenchExample = wb(VariationsVrExample);
export const WidthsVr: WorkbenchExample = wb(WidthsVrExample);
export const FormExample: WorkbenchExample = wb(FormExampleSource);
export const ForwardedRefs: WorkbenchExample = wb(ForwardedRefsExample);
export const ElementsBeforeAndAfterVr: WorkbenchExample = wb(ElementsBeforeAndAfterVrExample);
export const Maxvalue: WorkbenchExample = wb(MaxvalueExample);
export const CustomisationVr: WorkbenchExample = wb(CustomisationVrExample);
export const Testing: WorkbenchExample = wb(TestingExample);
