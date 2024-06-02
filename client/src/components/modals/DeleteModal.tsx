import Modal from "./Modal";

interface DeleteModalProps {
  closeModal: () => void;
  handleDelete: () => void;
}

const DeleteModal = ({ closeModal, handleDelete }: DeleteModalProps) => {

  return (
    <Modal
      closeModal={closeModal}
      handleAction={handleDelete}
      title="Confirm document deletion"
      actionLabel="Permanently delete"
    >
    </Modal>
  )
}

export default DeleteModal