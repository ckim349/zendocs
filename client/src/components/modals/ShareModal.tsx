interface ShareModalProps {
  closeModal: () => void;
  handleCopy: () => void;
}
const ShareModal = ({ closeModal, handleCopy }: ShareModalProps) => {
  const handleCancel = () => {
    closeModal();
  }

  return (
    <div className="document-modal-overlay">
      <div className="document-modal">
        <h1>Use this link to share!</h1>
        <div className="share-link">
          {window.location.href}
        </div>
        <div>
          <button className="format-button" onClick={handleCopy}>
            Copy link
          </button>
          <button className="format-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShareModal