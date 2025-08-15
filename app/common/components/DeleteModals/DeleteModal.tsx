import React from "react";

import { Button, Modal } from "antd";

import styles from "./DeleteModal.module.css";
import deleteImage from "../../../assets/images/delete.png";

interface DeleteModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={550}
      centered
      closable={false}
      className={styles.modalWrapper}
      maskClosable={true}
    >
      <div className={styles.modalContent}>
        <img src={deleteImage} alt="Delete" className={styles.deleteImage} />
        <p className={styles.message}>Məlumatı silməyə əminsinizmi?</p>
        <div className={styles.buttonsWrapper}>
          <Button className={styles.confirmButton} onClick={onConfirm}>
            Təsdiqlə
          </Button>

          <Button className={styles.cancelButton} onClick={onCancel}>
            İndi yox
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
