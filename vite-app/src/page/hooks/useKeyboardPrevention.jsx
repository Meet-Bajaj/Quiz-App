import { useEffect, useCallback, useMemo } from "react";

const useKeyboardPrevention = (isActive = true, options = {}) => {
  const {
    preventAll = false,
    allowedKeys = [],
    blockedKeys: defaultBlockedKeys = [
      "F11", "F12", "F5",
      "PrintScreen", "Tab",
      "Alt", "Control", "Meta","Win"
    ],
    preventContextMenu = true,
    preventSelection = true,
  } = options;

  // ✅ Memoize blocked keys to prevent unnecessary re-renders
  const blockedKeys = useMemo(() => defaultBlockedKeys, [defaultBlockedKeys]);

  const handleKeyDown = useCallback(
    (event) => {
      if (!isActive) return;

      const { key, ctrlKey, altKey, metaKey, shiftKey } = event;

      const isBlockedCombination =
        (ctrlKey && ["r", "R", "f", "F", "u", "U", "j", "J", "i", "I", "p", "P"].includes(key)) ||
        (altKey && ["Tab", "F4"].includes(key)) ||
        (metaKey && ["r", "R", "w", "W", "q", "Q"].includes(key)) ||
        (shiftKey && key === "F10");

      const isFunctionKey = /^F\d{1,2}$/.test(key);

      const shouldBlock =
        preventAll || blockedKeys.includes(key) || isBlockedCombination || isFunctionKey;

      const isAllowed = allowedKeys.includes(key);

      if (shouldBlock && !isAllowed) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [isActive, preventAll, allowedKeys, blockedKeys]
  );

  const handleKeyUp = useCallback(
    (event) => {
      if (!isActive) return;

      const { key } = event;
      if (blockedKeys.includes(key) || preventAll) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [isActive, preventAll, blockedKeys]
  );

  const handleContextMenu = useCallback(
    (event) => {
      if (isActive && preventContextMenu) {
        event.preventDefault();
      }
    },
    [isActive, preventContextMenu]
  );

  const handleSelectStart = useCallback(
    (event) => {
      if (isActive && preventSelection) {
        event.preventDefault();
      }
    },
    [isActive, preventSelection]
  );

  useEffect(() => {
    if (typeof document === "undefined" || !isActive) return;

    // ✅ Define once so cleanup works
    const handleDragStart = (e) => e.preventDefault();

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    document.addEventListener("keyup", handleKeyUp, { capture: true });
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("keyup", handleKeyUp, { capture: true });
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, [isActive, handleKeyDown, handleKeyUp, handleContextMenu, handleSelectStart]);
};

export default useKeyboardPrevention;
