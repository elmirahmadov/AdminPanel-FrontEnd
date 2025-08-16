import React from "react";

import {
  DeleteOutlined,
  EditOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Button, Space, Switch, Table, Tag, Tooltip } from "antd";

import styles from "./ForumTable.module.css";

import type { IForum } from "../../../../common/store/forum/forum.types";

interface ForumTableProps {
  forums: IForum[];
  loading: boolean;
  onEdit: (forum: IForum) => void;
  onDelete: (forum: IForum) => void;
  onViewTopics: (forum: IForum) => void;
  onToggleStatus: (forum: IForum, isActive: boolean) => void;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const ForumTable: React.FC<ForumTableProps> = ({
  forums,
  loading,
  onEdit,
  onDelete,
  onViewTopics,
  onToggleStatus,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}) => {
  const columns = [
    {
      title: "Başlık",
      dataIndex: "title",
      key: "title",
      width: 250,
      render: (_: unknown, record: IForum) => (
        <div className={styles.titleCell}>
          <div
            className={styles.titleText}
            onClick={() => onViewTopics(record)}
            style={{ cursor: "pointer" }}
          >
            {record.title || "-"}
          </div>
        </div>
      ),
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (category?: string) => (
        <Tag color="blue" className={styles.categoryTag}>
          {category || "Genel"}
        </Tag>
      ),
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
      width: 300,
      render: (text?: string) => (
        <div className={styles.descriptionCell}>
          <span className={styles.descriptionText}>
            {text || "Açıklama bulunmuyor"}
          </span>
        </div>
      ),
    },
    {
      title: "Durum",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (_: unknown, record: IForum) => (
        <div className={styles.statusSwitchContainer}>
          <Switch
            checked={record.isActive}
            className={styles.statusSwitch}
            onChange={(checked) => onToggleStatus(record, checked)}
          />
        </div>
      ),
    },
    {
      title: "Konular",
      dataIndex: "topicCount",
      key: "topicCount",
      width: 100,
      render: (count?: number) => (
        <div className={styles.topicCount}>
          <MessageOutlined className={styles.topicIcon} />
          <span>{count || 0}</span>
        </div>
      ),
    },
    {
      title: "İşlemler",
      key: "actions",
      width: 150,
      render: (_: unknown, record: IForum) => (
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
    <div className={styles.tableContainer}>
      <Table
        columns={columns}
        dataSource={forums}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} forum`,
          onChange: onPageChange,
          onShowSizeChange: onPageSizeChange,
        }}
      />
    </div>
  );
};

export default ForumTable;
