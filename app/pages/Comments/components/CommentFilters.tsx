import React, { useState } from "react";

import {
  DownloadOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { Button, DatePicker, Drawer, Form, Input, Select, Space } from "antd";

import styles from "./CommentFilters.module.css";

const { Search } = Input;
const { RangePicker } = DatePicker;

interface CommentFiltersProps {
  searchValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onAddComment: () => void;
  onExportCSV: () => void;
  filters: {
    animeId: string | undefined;
    seasonId: string | undefined;
    episodeId: string | undefined;
    commentType: "anime" | "episode" | undefined;
    status: string | undefined;
    dateRange: [string, string] | undefined;
  };
  onFilterChange: (key: string, value: unknown) => void;
  onFilterReset: () => void;
  animeOptions: Array<{ value: string; label: string }>;
  episodeOptions: Array<{ value: string; label: string }>;
  onSeasonFilterChange: (animeId: string) => void;
  onAnimeLookup: (query: string) => void;
}

const CommentFilters: React.FC<CommentFiltersProps> = ({
  searchValue,
  onSearchChange,
  onSearch,
  onAddComment,
  onExportCSV,
  filters,
  onFilterChange,
  onFilterReset,
  animeOptions,
  episodeOptions,
  onSeasonFilterChange,
  onAnimeLookup,
}) => {
  const [form] = Form.useForm();
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);

  const handleSeasonFilterChange = (animeId: string) => {
    onSeasonFilterChange(animeId);
    onFilterChange("animeId", animeId);
  };

  const handleEpisodeFilterChange = (seasonEpisodeId: string) => {
    if (seasonEpisodeId) {
      const [seasonId, episodeId] = seasonEpisodeId.split("-").map(Number);
      onFilterChange("seasonId", seasonId?.toString());
      onFilterChange("episodeId", episodeId?.toString());
    } else {
      onFilterChange("seasonId", undefined);
      onFilterChange("episodeId", undefined);
    }
  };

  const showFilterDrawer = () => {
    setIsFilterDrawerVisible(true);
  };

  const closeFilterDrawer = () => {
    setIsFilterDrawerVisible(false);
  };

  const handleFilterReset = () => {
    onFilterReset();
    form.resetFields();
  };

  return (
    <div className={styles.header}>
      {/* Search and Basic Filters */}
      <Space size="middle" className={styles.searchContainer}>
        <Space size="middle" className={styles.searchGroup}>
          <Search
            placeholder="Yorum, anime veya kullanıcı ara..."
            value={searchValue}
            onChange={onSearchChange}
            onSearch={onSearch}
            className={styles.searchInput}
            enterButton
          />
          <Button
            icon={<FilterOutlined />}
            onClick={showFilterDrawer}
            className={styles.filterButton}
          >
            Filtrele
          </Button>
        </Space>

        <Space size="middle" className={styles.actionGroup}>
          <Button
            icon={<DownloadOutlined />}
            onClick={onExportCSV}
            className={styles.exportButton}
          >
            CSV İndir
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddComment}
            className={styles.addCommentButton}
          >
            Yeni Yorum
          </Button>
        </Space>
      </Space>

      {/* Filter Drawer */}
      <Drawer
        title="Filtreler"
        placement="right"
        width={400}
        open={isFilterDrawerVisible}
        onClose={closeFilterDrawer}
        className={styles.filterDrawer}
        footer={
          <div className={styles.drawerFooter}>
            <Button onClick={closeFilterDrawer}>Kapat</Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleFilterReset}
              className={styles.resetButton}
            >
              Filtreleri Temizle
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" className={styles.filtersForm}>
          <Form.Item label="Anime">
            <Select
              placeholder="Anime seçin..."
              value={filters.animeId}
              onChange={handleSeasonFilterChange}
              onSearch={onAnimeLookup}
              options={animeOptions}
              allowClear
              showSearch
              filterOption={false}
              notFoundContent="Anime bulunamadı"
            />
          </Form.Item>

          <Form.Item label="Sezon & Bölüm">
            <Select
              placeholder="Sezon ve bölüm seçin..."
              value={
                filters.seasonId && filters.episodeId
                  ? `${filters.seasonId}-${filters.episodeId}`
                  : undefined
              }
              onChange={handleEpisodeFilterChange}
              options={episodeOptions}
              allowClear
              disabled={!filters.animeId}
            />
          </Form.Item>

          <Form.Item label="Yorum Türü">
            <Select
              placeholder="Yorum türü seçin..."
              value={filters.commentType}
              onChange={(value) => onFilterChange("commentType", value)}
              options={[
                { value: "anime", label: "Anime Yorumu" },
                { value: "episode", label: "Bölüm Yorumu" },
              ]}
              allowClear
            />
          </Form.Item>

          <Form.Item label="Durum">
            <Select
              placeholder="Durum seçin..."
              value={filters.status}
              onChange={(value) => onFilterChange("status", value)}
              options={[
                { value: "PENDING", label: "Bekliyor" },
                { value: "APPROVED", label: "Onaylandı" },
                { value: "REJECTED", label: "Reddedildi" },
                { value: "HIDDEN", label: "Gizlendi" },
              ]}
              allowClear
            />
          </Form.Item>

          <Form.Item label="Tarih Aralığı">
            <RangePicker
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  onFilterChange("dateRange", [
                    dates[0].toISOString(),
                    dates[1].toISOString(),
                  ]);
                } else {
                  onFilterChange("dateRange", undefined);
                }
              }}
              placeholder={["Başlangıç", "Bitiş"]}
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default CommentFilters;
