import React from "react";
import { Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./ForumHeader.module.css";

interface ForumHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

const ForumHeader: React.FC<ForumHeaderProps> = ({
  search,
  onSearchChange,
  onAddClick,
}) => {
  return (
    <div className={styles.headerContainer}>
      <Input.Search
        placeholder="Forum başlığı, açıklama veya kategori ile ara..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onSearch={(value) => onSearchChange(value)}
        enterButton
        className={styles.searchInput}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAddClick}
        className={styles.addButton}
      >
        Forum Ekle
      </Button>
    </div>
  );
};

export default ForumHeader;
