import Component from "./usa-file-input.twig";
import {
  Data,
  DisabledData,
  ErrorData,
  MultipleData,
  SpecificData,
  WildcardData,
} from "./content";

export default {
  title: "Components/File Input",
  argTypes: {
    label: { control: "text" },
    hint: { control: "text" },
    error_message: { control: "text" },
  },
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Data.args = Data;

export const Disabled = Template.bind({});
Disabled.args = DisabledData;

export const Error = Template.bind({});
Error.args = ErrorData;

export const Multiple = Template.bind({});
Multiple.args = MultipleData;

export const Specific = Template.bind({});
Specific.args = SpecificData;

export const Wildcard = Template.bind({});
Wildcard.args = WildcardData;
