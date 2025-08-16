import React from "react";

import { Button, Modal } from "antd";

import styles from "./DeleteModal.module.css";

interface DeleteModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onCancel,
  onConfirm,
  title = "Silme Onayı",
  message = "Bu veriyi silmek istediğinizden emin misiniz?",
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
      centered
      closable={false}
      className={styles.modalWrapper}
      maskClosable={true}
      styles={{
        mask: {
          background: "rgba(24, 28, 39, 0.85)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <div className={styles.modalContent}>
        <div className={styles.textContainer}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.buttonsWrapper}>
          <Button
            className={styles.confirmButton}
            onClick={onConfirm}
            type="primary"
            danger
          >
            Sil
          </Button>

          <Button
            className={styles.cancelButton}
            onClick={onCancel}
            type="default"
          >
            İptal
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
