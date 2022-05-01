import React from "react";
import styles from "./Button.module.scss";
import classNames from "classnames";

type TypesProps = {
  submit: string;
  edit: string;
  delete: string;
};

const buttonTypes = {
  submit: styles.submit,
  edit: styles.edit,
  delete: styles.delete,
};

type AppProps = {
  type: keyof TypesProps;
  text: string;
  className: string;
  onClick: () => void;
};

export const Button = ({ type, text, className, onClick }: AppProps) => {
  return (
    <button
      className={classNames(buttonTypes[type], className)}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
