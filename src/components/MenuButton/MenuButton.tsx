import { type FC } from "react";

import styles from "./MenuButton.module.css";

type Props = {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
};

export const MenuButton: FC<Props> = ({ children, onClick, disabled }) => {
  return (
    <button
      className={styles["menu-button"]}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
