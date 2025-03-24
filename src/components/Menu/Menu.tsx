import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

import { SearchBar } from "../SearchBar/SearchBar";
import { MenuButton } from "../MenuButton/MenuButton";
import { useMPSdk } from "@/hooks";

import styles from "./Menu.module.css";

export const Menu = () => {
  const endSweepId = "4bbtbui66sy5wg5mapn4u6eha";
  const mpSdk = useMPSdk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const teleportToOffice = () => {
    mpSdk?.Sweep.moveTo(endSweepId, {
      transition: mpSdk.Sweep.Transition.FADEOUT,
    });
  };

  const recursiveMoveToOffice = async () => {
    if (!mpSdk) return;
    const nextDirection = mpSdk.Camera.Direction.FORWARD;
    mpSdk.Sweep.current.subscribe(async (currentSweep) => {
      if (currentSweep.sid && currentSweep.sid !== endSweepId) {
        await mpSdk.Camera.moveInDirection(nextDirection);
      }
    });
  };

  const navigateToOffice = async () => {
    if (!mpSdk) return;
    const nextDirection = mpSdk.Camera.Direction.FORWARD;

    mpSdk.Camera.moveInDirection(nextDirection).then(async () => {
      await mpSdk?.Camera.rotate(-90, 0);
      recursiveMoveToOffice();
    });
  };

  const allButtons = [
    { label: "Teleport to Office", onClick: teleportToOffice },
    { label: "Navigate to Office", onClick: navigateToOffice },
  ];

  return (
    <div className={styles.menu} onClick={() => setIsMenuOpen(true)}>
      <div className={styles.header}>
        <h4>Menu</h4>
        <div className={styles.icons}>
          <SearchIcon onClick={() => setIsFilterOpen(!isFilterOpen)} />
          <CloseIcon
            onClick={(event) => {
              event.stopPropagation();
              setIsMenuOpen(false);
            }}
          />
        </div>
      </div>
      {isMenuOpen && (
        <>
          <SearchBar
            value={filterValue}
            onChange={setFilterValue}
            visible={isFilterOpen}
          />
          <div className={styles.buttons}>
            {allButtons
              .filter((button) =>
                button.label
                  .toLocaleLowerCase()
                  .startsWith(filterValue.toLocaleLowerCase())
              )
              .map((button, index) => (
                <MenuButton
                  disabled={!mpSdk}
                  key={index}
                  onClick={button.onClick}
                >
                  {button.label}
                </MenuButton>
              ))}
          </div>
        </>
      )}
    </div>
  );
};
