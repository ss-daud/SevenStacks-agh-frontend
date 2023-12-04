import React, { useState } from "react";
import TitleModal from "./TitleModal";
import SaveModal from "./SaveModal";

function ParentComponent() {
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const openTitleModal = () => {
    setIsTitleModalOpen(true);
  };

  const closeTitleModal = () => {
    setIsTitleModalOpen(false);
  };

  const openSaveModal = () => {
    setIsSaveModalOpen(true);
  };

  const closeSaveModal = () => {
    setIsSaveModalOpen(false);
  };

  return (
    <div>
      <button onClick={openTitleModal}>Open Title Modal</button>
      <button onClick={openSaveModal}>Open Save Modal</button>

      <TitleModal open={isTitleModalOpen} onClose={closeTitleModal} />
      <SaveModal open={isSaveModalOpen} onClose={closeSaveModal} />
    </div>
  );
}

export default ParentComponent;
