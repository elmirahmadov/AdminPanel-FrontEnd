import React from "react";
import { Modal, Button } from "antd";
import styles from "./AnimeDeleteModal.module.css";

interface AnimeDeleteModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  animeTitle?: string;
  loading?: boolean;
}

const AnimeDeleteModal: React.FC<AnimeDeleteModalProps> = ({
  open,
  onCancel,
  onConfirm,
  animeTitle,
  loading,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Sil"
      okButtonProps={{ danger: true, loading }}
      cancelText="Vazgeç"
      title="Anime Sil"
      destroyOnHidden
    >
      <div className={styles.deleteContent}>
        Bu animeyi silmek istediğinize emin misiniz?
        {animeTitle && (
          <>
            <br />
            <b>{animeTitle}</b>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AnimeDeleteModal;
