import React, { useEffect, useMemo, useState } from "react";

import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Tag,
  message,
} from "antd";

import { lookupAnime } from "../../../services/api/anime.api";

import PeriodsForm from "./components/PeriodsForm";
import PeriodsHeader from "./components/PeriodsHeader";
import PeriodsTable from "./components/PeriodsTable";
import styles from "./PeriodsList.module.css";

import { type IPeriod, usePeriodsStore } from "@/common/store/periods";

const PeriodsList: React.FC = () => {
  const {
    periods,
    loading,
    fetchAllPeriods,
    getPeriodById,
    addPeriod,
    updatePeriod,
    deletePeriod,
    addAnimeToPeriod,
  } = usePeriodsStore();

  const [animeSearch, setAnimeSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IPeriod | null>(null);
  const [viewingAnimes, setViewingAnimes] = useState<IPeriod | null>(null);
  const [addAnimeModalOpen, setAddAnimeModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<IPeriod | null>(null);
  const [form] = Form.useForm();
  const [addAnimeForm] = Form.useForm();

  // Anime arama state'leri
  const [animeOptions, setAnimeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [animeSearchTimer, setAnimeSearchTimer] =
    useState<NodeJS.Timeout | null>(null);
  const [selectedAnime, setSelectedAnime] = useState<{
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    // Tüm dönemleri getir
    fetchAllPeriods();
  }, [fetchAllPeriods]);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (period: IPeriod) => {
    setEditing(period);
    form.setFieldsValue({
      name: period.name,
      startYear: period.startYear,
      endYear: period.endYear,
      description: period.description,
    });
    setModalOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await updatePeriod(editing.id, values);
    } else {
      await addPeriod(values);
    }
    setModalOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const onDelete = async (period: IPeriod) => {
    await deletePeriod(period.id);
  };

  const onViewAnimes = async (period: IPeriod) => {
    try {
      const periodWithAnimes = await getPeriodById(period.id);
      setViewingAnimes(periodWithAnimes);
    } catch (error) {
      message.error("Dönem detayları yüklenirken hata oluştu!");
    }
  };

  const onAddAnime = (period: IPeriod) => {
    setSelectedPeriod(period);
    addAnimeForm.resetFields();
    setAnimeOptions([]);
    setSelectedAnime(null);
    setAddAnimeModalOpen(true);
  };

  const handleAnimeLookup = async (query: string) => {
    if (query.length < 2) {
      setAnimeOptions([]);
      return;
    }

    // Clear previous timer
    if (animeSearchTimer) {
      clearTimeout(animeSearchTimer);
    }

    const timer = setTimeout(async () => {
      try {
        const response = await lookupAnime(query);
        const results = response.data;

        if (Array.isArray(results) && results.length > 0) {
          const options = results.map((anime: any) => ({
            value: anime.id.toString(),
            label: anime.title,
          }));
          setAnimeOptions(options);
        } else {
          setAnimeOptions([]);
        }
      } catch (error) {
        console.error("Anime lookup error:", error);
        setAnimeOptions([]);
        message.error("Anime arama sırasında hata oluştu!");
      }
    }, 300);

    setAnimeSearchTimer(timer);
  };

  const handleAnimeSelect = (animeId: string) => {
    const anime = animeOptions.find((option) => option.value === animeId);
    if (anime) {
      setSelectedAnime({ id: animeId, title: anime.label });
    }
  };

  const handleAddAnimeToPeriod = async () => {
    if (!selectedAnime || !selectedPeriod) {
      message.error("Lütfen bir anime seçin!");
      return;
    }

    try {
      const values = await addAnimeForm.validateFields();
      const episodeCount = values.episodeCount || 0;

      await addAnimeToPeriod(selectedPeriod.id, selectedAnime.id, episodeCount);
      message.success(
        `${selectedAnime.title} anime'si ${selectedPeriod.name} dönemine eklendi!`
      );
      setAddAnimeModalOpen(false);
      setSelectedAnime(null);
      setAnimeOptions([]);
    } catch (error) {
      message.error("Anime eklenirken hata oluştu!");
    }
  };

  const onBackToPeriods = () => {
    setViewingAnimes(null);
  };

  if (viewingAnimes) {
    return (
      <div className={styles.container}>
        <div className={styles.animeListView}>
          <div className={styles.animeListHeader}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={onBackToPeriods}
              className={styles.backButton}
            >
              Mevsimlere Dön
            </Button>
            <h2 className={styles.animeListTitle}>
              {viewingAnimes.name} - Anime Listesi
            </h2>
            <div className={styles.animeListStats}>
              <span className={styles.statItem}>
                <strong>Toplam Anime:</strong> {viewingAnimes.animeCount}
              </span>
              <span className={styles.statItem}>
                <strong>Toplam Bölüm:</strong> {viewingAnimes.episodeCount}
              </span>
            </div>
          </div>

          <div className={styles.animeTableContainer}>
            <Table
              dataSource={viewingAnimes.animes}
              rowKey="id"
              pagination={false}
              className={styles.animeTable}
              columns={[
                {
                  title: "ID",
                  dataIndex: "id",
                  key: "id",
                  width: 80,
                  render: (text: number) => <Tag color="blue">{text}</Tag>,
                },
                {
                  title: "Anime Adı",
                  dataIndex: "title",
                  key: "title",
                  width: 300,
                  render: (text: string) => (
                    <span className={styles.animeTitle}>{text}</span>
                  ),
                },
                {
                  title: "Bölüm Sayısı",
                  dataIndex: "seasons",
                  key: "episodeCount",
                  width: 120,
                  render: (seasons: any[]) => {
                    const totalEpisodes =
                      seasons?.reduce((total, season) => {
                        return total + (season.episodes?.length || 0);
                      }, 0) || 0;
                    return <Tag color="green">{totalEpisodes}</Tag>;
                  },
                },
                {
                  title: "Yayın Yılı",
                  dataIndex: "releaseYear",
                  key: "releaseYear",
                  width: 120,
                  render: (year: number) => <Tag color="blue">{year}</Tag>,
                },
              ]}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PeriodsHeader
        search={animeSearch}
        onSearchChange={setAnimeSearch}
        onAddClick={openAdd}
      />
      <PeriodsTable
        periods={periods}
        loading={loading}
        onEdit={openEdit}
        onDelete={onDelete}
        onViewAnimes={onViewAnimes}
        onAddAnime={onAddAnime}
      />
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        title={editing ? "Mevsimi Düzenle" : "Yeni Mevsim"}
        okText={editing ? "Güncelle" : "Oluştur"}
        width={600}
      >
        <PeriodsForm form={form} />
      </Modal>

      {/* Anime Ekleme Modal */}
      <Modal
        open={addAnimeModalOpen}
        onCancel={() => {
          setAddAnimeModalOpen(false);
          setSelectedAnime(null);
          setAnimeOptions([]);
        }}
        title={`${selectedPeriod?.name} - Anime Ekle`}
        width={500}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setAddAnimeModalOpen(false);
              setSelectedAnime(null);
              setAnimeOptions([]);
            }}
          >
            İptal
          </Button>,
          <Button
            key="add"
            type="primary"
            onClick={handleAddAnimeToPeriod}
            disabled={!selectedAnime}
          >
            Anime Ekle
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <Form.Item label="Anime Ara">
            <Select
              showSearch
              placeholder="Anime ismi yazın..."
              filterOption={false}
              onSearch={handleAnimeLookup}
              onChange={handleAnimeSelect}
              options={animeOptions}
              notFoundContent="Anime bulunamadı"
              style={{ width: "100%" }}
            />
          </Form.Item>

          {selectedAnime && (
            <div
              style={{
                background: "#f5f5f5",
                padding: 16,
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <h4>Seçilen Anime:</h4>
              <p>
                <strong>İsim:</strong> {selectedAnime.title}
              </p>
              <p>
                <strong>ID:</strong> {selectedAnime.id}
              </p>
            </div>
          )}

          <Form.Item label="Bölüm Sayısı" name="episodeCount">
            <InputNumber
              placeholder="Bölüm sayısını girin..."
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </div>
      </Modal>
    </div>
  );
};

export default PeriodsList;
