import React from "react";
import { Table, Button, Space, Tooltip, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { IGenre } from "@/common/store/genre/genre.types";
import styles from "./GenreTable.module.css";

interface GenreTableProps {
  genres: IGenre[];
  loading: boolean;
  onEdit: (genre: IGenre) => void;
  onDelete: (genre: IGenre) => void;
}

const GenreTable: React.FC<GenreTableProps> = ({
  genres,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "Ad",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <div className={styles.nameCell}>
          <div className={styles.nameText}>{name}</div>
        </div>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (slug?: string) => (
        <span className={styles.slugText}>{slug || "-"}</span>
      ),
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
      render: (text?: string) => (
        <span className={styles.descriptionText}>{text || "-"}</span>
      ),
    },
    {
      title: "İşlemler",
      key: "actions",
      width: 150,
      render: (_: unknown, record: IGenre) => (
        <div className={styles.actionRow}>
          <Tooltip title="Düzenle">
            <Button
              icon={<EditOutlined />}
              className={styles.iconBtn}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Sil">
            <Button
              icon={<DeleteOutlined />}
              className={`${styles.iconBtn} ${styles.deleteBtn}`}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.tableCard}>
      <Table
        className={styles.table}
        columns={columns}
        dataSource={genres}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8, showSizeChanger: false }}
      />
    </div>
  );
};

export default GenreTable;
