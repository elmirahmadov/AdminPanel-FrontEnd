import React from "react";

import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag, Tooltip } from "antd";

import { type IPeriod } from "@/common/store/periods";

import styles from "./PeriodsTable.module.css";

interface PeriodsTableProps {
  periods: IPeriod[];
  loading: boolean;
  onEdit: (period: IPeriod) => void;
  onDelete: (period: IPeriod) => void;
  onViewAnimes: (period: IPeriod) => void;
  onAddAnime: (period: IPeriod) => void;
}

const PeriodsTable: React.FC<PeriodsTableProps> = ({
  periods,
  loading,
  onEdit,
  onDelete,
  onViewAnimes,
  onAddAnime,
}) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (text: string) => (
        <Tag color="blue" className={styles.idTag}>
          {text}
        </Tag>
      ),
    },
    {
      title: "İsim",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text: string, record: IPeriod) => (
        <div className={styles.nameCell}>
          <span
            className={styles.clickableName}
            onClick={() => onViewAnimes(record)}
          >
            {text}
          </span>
        </div>
      ),
    },
    {
      title: "Anime Sayısı",
      dataIndex: "animeCount",
      key: "animeCount",
      width: 120,
      render: (count: number) => (
        <span className={styles.animeCount}>{count}</span>
      ),
    },
    {
      title: "Bölüm Sayısı",
      dataIndex: "episodeCount",
      key: "episodeCount",
      width: 120,
      render: (count: number) => (
        <span className={styles.totalEpisodes}>{count}</span>
      ),
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
      width: 200,
      render: (text: string) => (
        <div className={styles.descriptionCell}>
          <span className={styles.descriptionText}>
            {text || "Açıklama yok"}
          </span>
        </div>
      ),
    },
    {
      title: "İşlemler",
      key: "actions",
      width: 150,
      render: (_: unknown, record: IPeriod) => (
        <div className={styles.actionRow}>
          <Tooltip title="Anime Ekle">
            <Button
              icon={<PlusOutlined />}
              className={styles.iconBtn}
              onClick={() => onAddAnime(record)}
            />
          </Tooltip>
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
        dataSource={periods}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} mevsim`,
        }}
        className={styles.periodsTable}
      />
    </div>
  );
};

export default PeriodsTable;
