import React from "react";
import { Table, Button, Space, Tooltip, Tag } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { ICharacter } from "@/common/store/character/character.types";
import styles from "./CharacterTable.module.css";

interface CharacterTableProps {
  characters: ICharacter[];
  loading: boolean;
  onView: (character: ICharacter) => void;
  onEdit: (character: ICharacter) => void;
  onDelete: (character: ICharacter) => void;
}

const CharacterTable: React.FC<CharacterTableProps> = ({
  characters,
  loading,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "Anime",
      key: "anime",
      width: 200,
      render: (_: unknown, record: ICharacter) => {
        const withAnime = record as unknown as {
          anime?: {
            id?: string | number;
            title?: string;
            name?: string;
            slug?: string;
          };
          animeTitle?: string;
          animeName?: string;
        };
        const animeTitle =
          withAnime.anime?.title ||
          withAnime.animeTitle ||
          withAnime.animeName ||
          "-";
        return (
          <div className="cellContent" title={animeTitle}>
            {animeTitle}
          </div>
        );
      },
    },
    {
      title: "Ad",
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (text?: string) => (
        <div className="cellContent" title={text || "-"}>
          {text || "-"}
        </div>
      ),
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role?: string) => {
        const r = (role || "").toUpperCase();
        const colorMap: Record<string, string> = {
          MAIN: "green",
          SUPPORTING: "blue",
          ANTAGONIST: "red",
          CAMEO: "purple",
        };
        const labelMap: Record<string, string> = {
          MAIN: "Başrol",
          SUPPORTING: "Yardımcı",
          ANTAGONIST: "Karşıt",
          CAMEO: "Kısa Görünüm",
        };
        return r ? (
          <Tag color={colorMap[r] || "default"}>{labelMap[r] || r}</Tag>
        ) : (
          <span>-</span>
        );
      },
    },
    {
      title: "Seslendiren",
      dataIndex: "voiceActor",
      key: "voiceActor",
      width: 150,
      render: (text?: string) => (
        <div className="cellContent" title={text || "-"}>
          {text || "-"}
        </div>
      ),
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
      width: 250,
      render: (text?: string) => (
        <div className="cellContent" title={text || "-"}>
          {text || "-"}
        </div>
      ),
    },
    {
      title: "İşlemler",
      key: "actions",
      width: 150,
      render: (_: unknown, record: ICharacter) => (
        <div className={styles.actionRow}>
          <Tooltip title="Görüntüle">
            <Button
              icon={<EyeOutlined />}
              className={styles.iconBtn}
              onClick={() => onView(record)}
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
        dataSource={characters}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />
    </div>
  );
};

export default CharacterTable;
