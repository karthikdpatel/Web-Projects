import "./Custom-Button.scss";

import { Button } from "react-bootstrap";

export const CustomButton = (props: {
  isDisabled: boolean;
  onClick: () => void;
  id?: string;
  title?: string;
  prefixIcon?: string;
  prefixIconColor?: string;
  leadingIcon?: string;
  leadingIconColor?: string;
}) => {
  return (
    <Button
      variant="light"
      disabled={props.isDisabled}
      onClick={props.onClick}
      id={props.id}
    >
      {props.prefixIcon &&
        (props.prefixIconColor ? (
          <span
            className="material-icons"
            style={{ color: `${props.prefixIconColor}` }}
          >
            {props.prefixIcon}
          </span>
        ) : (
          <span className="material-icons">{props.prefixIcon}</span>
        ))}
      {props.title}
      {props.leadingIcon &&
        (props.leadingIconColor ? (
          <span
            className="material-icons"
            style={{ color: `${props.leadingIconColor}` }}
          >
            {props.leadingIcon}
          </span>
        ) : (
          <span className="material-icons">{props.leadingIcon}</span>
        ))}
    </Button>
  );
};
