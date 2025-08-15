import React from "react";
import { Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./GenreHeader.module.css";

interface GenreHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

const GenreHeader: React.FC<GenreHeaderProps> = ({
  search,
  onSearchChange,
  onAddClick,
}) => {
  return (
    <div className={styles.headerRow}>
      <Input
        placeholder="Tür ara..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.searchInput}
      />
      <Button type="primary" icon={<PlusOutlined />} onClick={onAddClick}>
        Tür Ekle
      </Button>
    </div>
  );
};

export default GenreHeader;
