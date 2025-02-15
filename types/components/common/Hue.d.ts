import { Component } from "react";
import { CustomPickerProps } from "../../index";

export interface HueProps extends CustomPickerProps<Hue> {
    direction?: "horizontal" | "vertical" | undefined;
}

export default class Hue extends Component<HueProps> {}
