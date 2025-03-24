import { type FC } from "react";

import styles from './SearchBar.module.css';

type Props = {
  visible: boolean;
  value: string;
  onChange: (value: string) => void;
};

export const SearchBar: FC<Props> = ({ value, onChange, visible }) => {
  return (
    visible && (
      <input
        className={styles["search-bar"]}
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  );
};
