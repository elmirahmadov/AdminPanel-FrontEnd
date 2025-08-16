import React from "react";

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Table, Tag, Tooltip } from "antd";
import type { TablePaginationConfig } from "antd/es/table";

import styles from "./CommentTable.module.css";

import type { IComment } from "@/common/store/comment/comment.types";

interface CommentTableProps {
  comments: IComment[];
  loading: boolean;
  onEdit: (comment: IComment) => void;
  onDelete: (comment: IComment) => void;
  onApprove: (comment: IComment) => void;
  onReject: (comment: IComment) => void;
  onModeration: (comment: IComment) => void;
  pagination?: TablePaginationConfig;
}

const CommentTable: React.FC<CommentTableProps> = ({
  comments,
  loading,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onModeration,
  pagination,
}) => {
  const columns = [
    {
      title: "Kullanıcı",
      key: "user",
      render: (_: unknown, record: IComment) => (
        <div className={styles.userCell}>
          <Avatar
            size="small"
            icon={<UserOutlined />}
            className={styles.userAvatar}
          />
          <span>{record.user?.username || "-"}</span>
        </div>
      ),
    },
    {
      title: "Anime",
      key: "anime",
      render: (_: unknown, record: IComment) => (
        <div className={styles.animeCell}>
          <div className={styles.animeTitle}>{record.anime?.title || "-"}</div>
        </div>
      ),
    },
    {
      title: "Episode",
      key: "episode",
      render: (_: unknown, record: IComment) => (
        <div className={styles.episodeCell}>
          {record.episode ? (
            <div className={styles.episodeInfo}>
              <span className={styles.seasonText}>
                S{record.season?.number || 1}
              </span>
              <span className={styles.episodeText}>
                B{record.episode.number || 1}
              </span>
            </div>
          ) : (
            <span>-</span>
          )}
        </div>
      ),
    },
    {
      title: "Tarih",
      key: "createdAt",
      render: (_: unknown, record: IComment) => (
        <div className={styles.dateCell}>
          <span>{new Date(record.createdAt).toLocaleDateString("tr-TR")}</span>
        </div>
      ),
    },
    {
      title: "Durum",
      key: "status",
      render: (_: unknown, record: IComment) => {
        const statusConfig = {
          APPROVED: { color: "success", text: "Onaylandı" },
          PENDING: { color: "processing", text: "Bekliyor" },
          REJECTED: { color: "error", text: "Reddedildi" },
          HIDDEN: { color: "default", text: "Gizlendi" },
        };

        const config =
          statusConfig[record.status as keyof typeof statusConfig] ||
          statusConfig.PENDING;

        return (
          <Tag
            color={
              config.color as "success" | "processing" | "error" | "default"
            }
          >
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "İşlemler",
      key: "actions",
      width: 150,
      render: (_: unknown, record: IComment) => (
        <div className={styles.actionRow}>
          <Tooltip title="Düzenle">
            <Button
              icon={<EditOutlined />}
              className={styles.iconBtn}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Moderasyon">
            <Button
              icon={<EyeOutlined />}
              className={styles.iconBtn}
              onClick={() => onModeration(record)}
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
        dataSource={comments}
        rowKey="id"
        loading={loading}
        pagination={pagination}
      />
    </div>
  );
};

export default CommentTable;
