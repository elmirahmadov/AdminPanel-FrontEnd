import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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

import PeriodsForm from "./components/PeriodsForm";
import PeriodsHeader from "./components/PeriodsHeader";
import PeriodsTable from "./components/PeriodsTable";
import styles from "./PeriodsList.module.css";

import { type IPeriod, usePeriodsStore } from "@/common/store/periods";
import DeleteModal from "@/common/components/DeleteModals/DeleteModal";
import { Loading } from "@/common/components/Loading";
import { lookupAnime } from "../../../services/api/anime.api";

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingPeriod, setDeletingPeriod] = useState<IPeriod | null>(null);
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Anime list pagination state
  const [animeCurrentPage, setAnimeCurrentPage] = useState(1);
  const [animePageSize, setAnimePageSize] = useState(10);

  useEffect(() => {
    // Tüm dönemleri getir
    fetchAllPeriods();
  }, [fetchAllPeriods]);

  // Loading durumunda Loading component'ini göster
  if (loading && !viewingAnimes) {
    return <Loading />;
  }

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

  const onDelete = (period: IPeriod) => {
    setDeletingPeriod(period);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingPeriod) {
      await deletePeriod(deletingPeriod.id);
      setDeleteModalOpen(false);
      setDeletingPeriod(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeletingPeriod(null);
  };

  const onViewAnimes = async (period: IPeriod) => {
    try {
      const periodWithAnimes = await getPeriodById(period.id);
      setViewingAnimes(periodWithAnimes);
      // Pagination state'lerini sıfırla
      setAnimeCurrentPage(1);
      setAnimePageSize(10);
    } catch (error) {}
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
      }
    }, 300);

    setAnimeSearchTimer(timer);
  };

  const handleAnimeSelect = (animeId: string) => {
    console.log("Anime selected:", animeId);
    const anime = animeOptions.find((option) => option.value === animeId);
    if (anime) {
      setSelectedAnime({ id: animeId, title: anime.label });
      console.log("Selected anime set:", { id: animeId, title: anime.label });
    }
  };

  const handleAddAnimeToPeriod = async () => {
    console.log("handleAddAnimeToPeriod called");
    console.log("selectedAnime:", selectedAnime);
    console.log("selectedPeriod:", selectedPeriod);

    if (!selectedAnime || !selectedPeriod) {
      console.log("Missing selectedAnime or selectedPeriod");
      return;
    }

    try {
      console.log("Adding anime to period:", {
        periodId: selectedPeriod.id,
        animeId: selectedAnime.id,
        episodeCount: 0,
      });

      await addAnimeToPeriod(selectedPeriod.id, selectedAnime.id, 0);
      console.log("Anime added successfully");

      setAddAnimeModalOpen(false);
      setSelectedAnime(null);
      setAnimeOptions([]);
      addAnimeForm.resetFields();

      // Refresh the anime list
      if (viewingAnimes) {
        await onViewAnimes(viewingAnimes);
      }
    } catch (error) {
      console.error("Error adding anime to period:", error);
    }
  };

  const onBackToPeriods = () => {
    setViewingAnimes(null);
  };

  if (viewingAnimes) {
    return (
      <div className={styles.container}>
        <div className={styles.episodesView}>
          <div className={styles.episodesHeader}>
            <div className={styles.episodesHeaderLeft}>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={onBackToPeriods}
                className={styles.backButton}
              >
                Mevsimlere Dön
              </Button>
              <h2>{viewingAnimes.name} - Bölümler</h2>
            </div>
            <Button
              type="primary"
              onClick={() => onAddAnime(viewingAnimes)}
              icon={<PlusOutlined />}
            >
              Anime Ekle
            </Button>
          </div>

          {viewingAnimes.animes && viewingAnimes.animes.length > 0 ? (
            <div className={styles.episodesTable}>
              <Table
                columns={[
                  {
                    title: "Anime Adı",
                    dataIndex: "title",
                    key: "title",
                    width: 300,
                    render: (title: string, record: any) => (
                      <div className={styles.animeTitleCell}>
                        <span className={styles.animeTitle}>{title}</span>
                        <Tag
                          color={
                            record.status === "ONGOING"
                              ? "green"
                              : record.status === "COMPLETED"
                                ? "blue"
                                : "orange"
                          }
                        >
                          {record.status === "ONGOING"
                            ? "Devam Ediyor"
                            : record.status === "COMPLETED"
                              ? "Tamamlandı"
                              : "Yakında"}
                        </Tag>
                      </div>
                    ),
                  },
                  {
                    title: "Bölüm Sayısı",
                    dataIndex: "episodes",
                    key: "episodeCount",
                    width: 120,
                    render: (episodes: any[]) => {
                      const totalEpisodes = episodes ? episodes.length : 0;
                      return (
                        <div className={styles.episodeCountCell}>
                          <Tag color="green">{totalEpisodes}</Tag>
                        </div>
                      );
                    },
                  },
                  {
                    title: "Durum",
                    dataIndex: "status",
                    key: "status",
                    width: 120,
                    render: (status: string) => (
                      <div className={styles.statusCell}>
                        <Tag
                          color={
                            status === "ONGOING"
                              ? "green"
                              : status === "COMPLETED"
                                ? "blue"
                                : "orange"
                          }
                        >
                          {status === "ONGOING"
                            ? "Devam Ediyor"
                            : status === "COMPLETED"
                              ? "Tamamlandı"
                              : "Yakında"}
                        </Tag>
                      </div>
                    ),
                  },
                  {
                    title: "İşlemler",
                    key: "actions",
                    width: 150,
                    render: (_: unknown, record: any) => (
                      <div className={styles.actionsCell}>
                        <Button
                          icon={<DeleteOutlined />}
                          className={`${styles.iconBtn} ${styles.deleteBtn}`}
                          title="Sil"
                        />
                      </div>
                    ),
                  },
                ]}
                dataSource={viewingAnimes.animes}
                rowKey="id"
                pagination={{
                  current: animeCurrentPage,
                  pageSize: animePageSize,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} / ${total} anime`,
                  onChange: setAnimeCurrentPage,
                  onShowSizeChange: setAnimePageSize,
                }}
                className={styles.episodesTableComponent}
              />
            </div>
          ) : (
            <div className={styles.noEpisodes}>
              <p>Bu mevsimde henüz anime bulunmuyor.</p>
            </div>
          )}

          {/* Anime Ekleme Modal - Sadece bu view'da açılır */}
          <Modal
            open={addAnimeModalOpen}
            onCancel={() => {
              setAddAnimeModalOpen(false);
              setSelectedAnime(null);
              setAnimeOptions([]);
              addAnimeForm.resetFields();
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
                  addAnimeForm.resetFields();
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
            <Form form={addAnimeForm} layout="vertical">
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
            </Form>
          </Modal>
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
        loading={false}
        onEdit={openEdit}
        onDelete={onDelete}
        onViewAnimes={onViewAnimes}
        onAddAnime={onAddAnime}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
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

      <DeleteModal
        open={deleteModalOpen}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default PeriodsList;
