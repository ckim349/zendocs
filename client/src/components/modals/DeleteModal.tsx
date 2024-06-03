interface DeleteModalProps {
  closeModal: () => void;
  handleDelete: () => void;
}

const DeleteModal = ({ closeModal, handleDelete }: DeleteModalProps) => {
  const handleCancel = () => {
    closeModal();
  }

  return (
    <div className="document-modal-overlay">
      <div className="document-modal">
        <h1>Confirm deletion</h1>
        <div>
          <button className="format-button" onClick={handleDelete}>
            Permanently delete
          </button>
          <button className="format-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal