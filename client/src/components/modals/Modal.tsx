interface ModalProps {
  closeModal: () => void;
  handleAction: () => void;
  title: string;
  actionLabel: string;
}

const Modal = ({ closeModal, handleAction, title, actionLabel }: ModalProps) => {
  const handleCancel = () => {
    closeModal();
  }

  return (
    <div className="document-modal-overlay">
      <div className="document-modal">
        <h1>{title}</h1>
        <div>
          <button className="format-button" onClick={handleAction}>
            {actionLabel}
          </button>
          <button className="format-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal;