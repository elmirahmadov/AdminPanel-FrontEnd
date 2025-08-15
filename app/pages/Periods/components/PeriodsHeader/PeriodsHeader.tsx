import React from "react";

import { PlusOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";

import styles from "./PeriodsHeader.module.css";

interface PeriodsHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

const PeriodsHeader: React.FC<PeriodsHeaderProps> = ({
  search,
  onSearchChange,
  onAddClick,
}) => {
  return (
    <div className={styles.headerContainer}>
      <Input.Search
        placeholder="Anime ismi yazın..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.searchInput}
        size="large"
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAddClick}
        className={styles.addButton}
        size="large"
      >
        Yeni Mevsim
      </Button>
    </div>
  );
};

export default PeriodsHeader;
