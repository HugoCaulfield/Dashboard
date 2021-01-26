import Modal from 'react-bootstrap/Modal'

export const MailConfirmM = props => {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-sm"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-sm">
          Validation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You must confirm your account.</p>
        <p>Go check your mails !</p>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={props.onHide}>Close</button>
      </Modal.Footer>
    </Modal>
  );
};
