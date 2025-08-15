import React from "react";
import { Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./CharacterHeader.module.css";

interface CharacterHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearch: (value: string) => void;
  onAddClick: () => void;
}

const CharacterHeader: React.FC<CharacterHeaderProps> = ({
  search,
  onSearchChange,
  onSearch,
  onAddClick,
}) => {
  return (
    <div className={styles.headerContainer}>
      <Input.Search
        placeholder="Karakter veya anime adı ile ara..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onSearch={(value) => onSearch(value)}
        enterButton
        className={styles.searchInput}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAddClick}
        className={styles.addButton}
      >
        Karakter Ekle
      </Button>
    </div>
  );
};

export default CharacterHeader;
