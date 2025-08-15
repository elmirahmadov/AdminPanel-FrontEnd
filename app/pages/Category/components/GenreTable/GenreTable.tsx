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
      render: (name: string, record: IGenre) => (
        <div className={styles.nameCell}>
          <div className={styles.nameText}>{name}</div>
          <Tag color="purple" className={styles.nameTag}>
            {record.name}
          </Tag>
        </div>
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
      width: 160,
      render: (_: unknown, record: IGenre) => (
        <Space size="small">
          <Tooltip title="Düzenle">
            <Button
              icon={<EditOutlined />}
              size="small"
              className={styles.actionButton}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Sil">
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              className={styles.actionButton}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        </Space>
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
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />
    </div>
  );
};

export default GenreTable;
