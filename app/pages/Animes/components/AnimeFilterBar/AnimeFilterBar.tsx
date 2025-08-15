import React from "react";
import { Input, Select, Button } from "antd";
import styles from "./AnimeFilterBar.module.css";

const { Search } = Input;
const { Option } = Select;

interface AnimeFilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  genre: string | undefined;
  onGenreChange: (v: string | undefined) => void;
  genres: string[];
  onAdd: () => void;
}

const AnimeFilterBar: React.FC<AnimeFilterBarProps> = ({
  search,
  onSearchChange,
  genre,
  onGenreChange,
  genres,
  onAdd,
}) => {
  return (
    <div className={styles.filterBar}>
      <Button type="primary" className={styles.addButton} onClick={onAdd}>
        + Anime Ekle
      </Button>
      <Input
        placeholder="Anime ara..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.searchInput}
        size="large"
      />
      <Select
        placeholder="Tümü"
        value={genre}
        onChange={onGenreChange}
        className={styles.select}
        size="large"
      >
        <Option value="">Tümü</Option>
        {genres.map((g) => (
          <Option key={g} value={g}>
            {g}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default AnimeFilterBar;
