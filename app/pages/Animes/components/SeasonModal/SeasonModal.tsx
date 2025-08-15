import React, { useState } from "react";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  notification,
  Pagination,
} from "antd";

import styles from "./SeasonModal.module.css";

import { Loading } from "@/common/components/Loading";
import { useEpisodeStore } from "@/common/store/episode";
import { useSeasonStore } from "@/common/store/season";

interface Season {
  id?: string;
  name: string;
  number: number;
  episodeCount?: number;
}

interface Episode {
  id?: string;
  title: string;
  episodeNumber: number;
  duration?: number;
  videoUrl?: string;
  description?: string;
  thumbnailUrl?: string;
  releaseDate?: string;
}

interface AnimeSeasonModalProps {
  open: boolean;
  onCancel: () => void;
  animeTitle?: string;
  animeId?: string; // Anime ID'sini ekle
  seasons: Season[];
  loading?: boolean;
  onAddSeason: (season: Season) => void;
  onEditSeason: (season: Season) => void;
  onDeleteSeason: (season: Season) => void;
  onManageEpisodes?: (season: Season) => void;
}

const AnimeSeasonModal: React.FC<AnimeSeasonModalProps> = ({
  open,
  onCancel,
  animeTitle,
  animeId, // Anime ID'sini al
  seasons,
  loading = false,
  onAddSeason,
  onEditSeason,
  onDeleteSeason,
}) => {
  const [formVisible, setFormVisible] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalView, setModalView] = useState<"seasons" | "episodes">("seasons");
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [episodeFormVisible, setEpisodeFormVisible] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  type Deletable =
    | { type: "season"; item: Season }
    | { type: "episode"; item: Episode };
  const [itemToDelete, setItemToDelete] = useState<Deletable | null>(null);
  const pageSize = 4;

  // Episode store
  const { episodes = [], loading: episodesLoading } = useEpisodeStore();
  const { fetchEpisodes, addEpisode, updateEpisode, deleteEpisode } =
    useEpisodeStore((s: any) => s.actions);

  // Season store
  const { fetchSeasons } = useSeasonStore((s: any) => s.actions);

  const handleAdd = () => {
    setEditingSeason({ name: "", number: seasons.length + 1 });
    setFormVisible(true);
  };
  const handleEdit = (season: Season) => {
    setEditingSeason(season);
    setFormVisible(true);
  };
  const handleFormSave = (values: Season) => {
    if (editingSeason && editingSeason.id) {
      onEditSeason({ ...editingSeason, ...values });
    } else {
      onAddSeason({ ...values });
    }
    setFormVisible(false);
    setEditingSeason(null);
  };
  const handleFormCancel = () => {
    setFormVisible(false);
    setEditingSeason(null);
  };

  const handleAddEpisode = () => {
    setEditingEpisode({
      title: "",
      episodeNumber: (Array.isArray(episodes) ? episodes.length : 0) + 1,
    });
    setEpisodeFormVisible(true);
  };
  const handleEditEpisode = (episode: Episode) => {
    setEditingEpisode(episode);
    setEpisodeFormVisible(true);
  };
  const handleEpisodeFormSave = async (values: Episode) => {
    try {
      if (editingEpisode && editingEpisode.id) {
        await updateEpisode(editingEpisode.id, {
          ...values,
          seasonId: selectedSeason?.id,
        });
        notification.success({
          message: "Başarılı",
          description: "Bölüm başarıyla güncellendi.",
        });
      } else {
        if (!animeId || !selectedSeason?.id) {
          notification.error({
            message: "Hata",
            description: "Anime ID veya Sezon ID eksik!",
          });
          return;
        }
        // seasonId'yi episode data'sına ekle
        const episodeData = {
          ...values,
          seasonId: selectedSeason.id,
        };
        await addEpisode(animeId, selectedSeason.id, episodeData);
        notification.success({
          message: "Başarılı",
          description: "Bölüm başarıyla eklendi.",
        });
      }
      setEpisodeFormVisible(false);
      setEditingEpisode(null);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Episode save error:", error);
      notification.error({
        message: "Hata",
        description: `Bölüm kaydedilirken hata oluştu: ${error}`,
      });
    }
  };
  const handleEpisodeFormCancel = () => {
    setEpisodeFormVisible(false);
    setEditingEpisode(null);
  };

  const handleDeleteSeason = (season: Season) => {
    setItemToDelete({ type: "season", item: season });
    setDeleteModalVisible(true);
  };

  const handleDeleteEpisode = (episode: Episode) => {
    setItemToDelete({ type: "episode", item: episode });
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      if (itemToDelete.type === "season") {
        const season = itemToDelete.item;
        if (season.id) {
          await onDeleteSeason({ ...season, id: season.id });
          if (animeId) fetchSeasons(animeId);
        } else {
          await onDeleteSeason(season);
          if (animeId) fetchSeasons(animeId);
        }
      } else if (itemToDelete.type === "episode") {
        const episode = itemToDelete.item;
        if (episode.id) {
          await deleteEpisode(episode.id);
          if (animeId && selectedSeason?.id)
            fetchEpisodes(animeId, selectedSeason.id);
        }
      }
    }
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const handleManageEpisodes = (season: Season) => {
    // eslint-disable-next-line no-console
    console.log("Managing episodes for season:", season);
    // eslint-disable-next-line no-console
    console.log("Current animeId:", animeId);

    setSelectedSeason(season);
    setModalView("episodes");
    setCurrentPage(1);
    // Bölümleri API'den getir
    if (season.id && animeId) {
      // eslint-disable-next-line no-console

      fetchEpisodes(animeId, season.id).catch((error: any) => {
        notification.error({
          message: "Hata",
          description: `Bölümler yüklenirken hata oluştu: ${error}`,
        });
      });
    } else {
      notification.error({
        message: "Hata",
        description: "Sezon ID'si veya Anime ID'si bulunamadı!",
      });
    }
  };

  const handleBackToSeasons = () => {
    setModalView("seasons");
    setSelectedSeason(null);
    setCurrentPage(1);
  };

  const handleModalCancel = () => {
    // Modal kapanırken view'ı sezonlara döndür
    setModalView("seasons");
    setSelectedSeason(null);
    setCurrentPage(1);
    onCancel();
  };

  const paginatedSeasons = seasons.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const paginatedEpisodes = Array.isArray(episodes)
    ? episodes.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  const renderSeasonsView = () => (
    <>
      <div className={styles.seasonHeader}>
        <span className={styles.seasonTitle}>Sezonlar</span>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className={styles.addSeasonButton}
        >
          Sezon Ekle
        </Button>
      </div>
      <div className={styles.seasonListContainer}>
        <List
          itemLayout="horizontal"
          dataSource={paginatedSeasons}
          renderItem={(season) => (
            <List.Item
              className={styles.seasonListItem}
              actions={[
                <Button
                  icon={<UnorderedListOutlined />}
                  onClick={() => handleManageEpisodes(season)}
                />,
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(season)}
                />,
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleDeleteSeason(season)}
                />,
              ]}
            >
              <List.Item.Meta
                title={
                  <span className={styles.seasonName}>
                    {season.name || `Sezon ${season.number}`}
                  </span>
                }
                description={
                  season.episodeCount !== undefined ? (
                    <span className={styles.seasonMetaDescription}>
                      {season.episodeCount} bölüm
                    </span>
                  ) : null
                }
              />
            </List.Item>
          )}
          locale={{
            emptyText: (
              <span className={styles.emptyText}>Henüz sezon eklenmedi.</span>
            ),
          }}
        />
        {seasons.length > pageSize && (
          <div className={styles.paginationContainer}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={seasons.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              style={{ textAlign: "center" }}
            />
          </div>
        )}
      </div>
    </>
  );

  const renderEpisodesView = () => (
    <>
      <div className={styles.episodeHeader}>
        <div className={styles.episodeTitleContainer}>
          <span
            className={styles.episodeTitle}
            onClick={handleBackToSeasons}
            style={{ cursor: "pointer" }}
            title="Sezonlara dön"
          >
            {selectedSeason?.name || `Sezon ${selectedSeason?.number}`} -
            Bölümler
          </span>
        </div>
        <div className={styles.episodeActionButtons}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddEpisode}
            className={styles.addEpisodeButton}
          >
            Bölüm Ekle
          </Button>
        </div>
      </div>
      <div className={styles.episodeListContainer}>
        {episodesLoading ? (
          <Loading />
        ) : (
          <>
            <List
              itemLayout="horizontal"
              dataSource={paginatedEpisodes}
              renderItem={(episode) => (
                <List.Item
                  className={styles.episodeListItem}
                  actions={[
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleEditEpisode(episode)}
                    />,
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => handleDeleteEpisode(episode)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <span className={styles.episodeTitle}>
                        {episode.title || `Bölüm ${episode.episodeNumber}`}
                      </span>
                    }
                    description={
                      <div className={styles.episodeMetaDescription}>
                        {episode.duration && `Süre: ${episode.duration} dk`}
                        {episode.releaseDate && ` • ${episode.releaseDate}`}
                      </div>
                    }
                  />
                </List.Item>
              )}
              locale={{
                emptyText: (
                  <span className={styles.emptyText}>
                    Henüz bölüm eklenmedi.
                  </span>
                ),
              }}
            />
            {Array.isArray(episodes) && episodes.length > pageSize && (
              <div className={styles.paginationContainer}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={episodes.length}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  style={{ textAlign: "center" }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );

  return (
    <Modal
      open={open}
      onCancel={handleModalCancel}
      title={animeTitle ? `${animeTitle} - Sezonlar` : "Sezonlar"}
      footer={null}
      destroyOnHidden
      width={600}
      styles={{
        body: {
          background: "#23263a",
          color: "#fff",
          padding: 24,
          height: "500px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {loading ? (
        <Loading />
      ) : modalView === "seasons" ? (
        renderSeasonsView()
      ) : (
        renderEpisodesView()
      )}
      <Modal
        open={formVisible}
        onCancel={handleFormCancel}
        title={
          editingSeason && editingSeason.id ? "Sezon Düzenle" : "Sezon Ekle"
        }
        footer={null}
        destroyOnHidden
        width={400}
      >
        <SeasonForm
          initialValues={editingSeason}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
          animeId={animeId} // Anime ID'sini form'a ilet
        />
      </Modal>
      <Modal
        open={episodeFormVisible}
        onCancel={handleEpisodeFormCancel}
        title={
          editingEpisode && editingEpisode.id ? "Bölüm Düzenle" : "Bölüm Ekle"
        }
        footer={null}
        destroyOnHidden
        width={400}
      >
        <EpisodeForm
          initialValues={editingEpisode}
          onSave={handleEpisodeFormSave}
          onCancel={handleEpisodeFormCancel}
        />
      </Modal>
      <Modal
        open={deleteModalVisible}
        onCancel={handleCancelDelete}
        onOk={handleConfirmDelete}
        title={`${itemToDelete?.type === "season" ? "Sezon" : "Bölüm"} Sil`}
        okText="Sil"
        cancelText="İptal"
      >
        <p>
          {itemToDelete?.type === "season"
            ? `"${itemToDelete?.item.name || `Sezon ${itemToDelete?.item.number}`}" adlı sezonu silmek istediğinize emin misiniz?`
            : `"${itemToDelete?.item.title || `Bölüm ${itemToDelete?.item.episodeNumber}`}" adlı bölümü silmek istediğinize emin misiniz?`}
        </p>
      </Modal>
    </Modal>
  );
};

// Local SeasonForm component
const SeasonForm: React.FC<{
  initialValues: Partial<Season> | null;
  onSave: (values: Season) => void;
  onCancel: () => void;
  animeId?: string; // Anime ID'sini ekle
}> = ({ initialValues, onSave, onCancel, animeId }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  React.useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, [form]);

  const handleFinish = (
    values: Partial<Season> & { releaseYear?: number; episodeCount?: number }
  ) => {
    // Sezon adından numarayı çıkar (örn: "Sezon 11" -> 11)
    const seasonNumberMatch = values.name?.match(/sezon\s*(\d+)/i);
    const number = seasonNumberMatch ? parseInt(seasonNumberMatch[1]) : 1;

    const slug = values.name?.toLowerCase().replace(/\s+/g, "-");

    // İstenen formatta veri oluştur
    const seasonData: Season & {
      slug?: string;
      releaseYear?: number;
      episodeCount?: number;
      animeId?: string;
    } = {
      name: values.name || "",
      slug: slug,
      releaseYear: values.releaseYear,
      episodeCount: values.episodeCount,
      number: number, // Otomatik çıkarılan numara
      animeId: animeId, // Anime ID'sini ekle
    };

    onSave(seasonData);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={initialValues || {}}
    >
      <Form.Item
        name="name"
        label="Sezon Adı"
        rules={[{ required: true, message: "Sezon adı girin!" }]}
      >
        <Input placeholder="Örn: Sezon 11" />
      </Form.Item>
      <Form.Item
        name="releaseYear"
        label="Yayın Yılı"
        rules={[{ required: true, message: "Yayın yılı girin!" }]}
      >
        <InputNumber
          min={1900}
          max={2100}
          style={{ width: "100%" }}
          placeholder="2024"
        />
      </Form.Item>
      <Form.Item
        name="episodeCount"
        label="Bölüm Sayısı"
        rules={[{ required: true, message: "Bölüm sayısı girin!" }]}
      >
        <InputNumber min={1} style={{ width: "100%" }} placeholder="12" />
      </Form.Item>
      <div className={styles.formButtons}>
        <Button onClick={onCancel} className={styles.cancelButton}>
          İptal
        </Button>
        <Button type="primary" htmlType="submit" className={styles.saveButton}>
          Kaydet
        </Button>
      </div>
    </Form>
  );
};

// Local EpisodeForm component
const EpisodeForm: React.FC<{
  initialValues: Partial<Episode> | null;
  onSave: (values: Episode) => void | Promise<void>;
  onCancel: () => void;
}> = ({ initialValues, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  React.useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, [form]);

  const handleFinish = async (values: Partial<Episode>) => {
    try {
      setLoading(true);

      // Validate required fields
      if (!values.title || !values.episodeNumber) {
        notification.warning({
          message: "Uyarı",
          description: "Bölüm başlığı ve numarası zorunludur!",
        });
        return;
      }

      // API formatına uygun veri oluştur
      const episodeData: Episode = {
        id: (values as Episode).id,
        title: values.title || "",
        episodeNumber: values.episodeNumber || 1,
        duration: values.duration || 25,
        videoUrl: values.videoUrl || "",
        description: values.description || "",
        thumbnailUrl: values.thumbnailUrl || "",
        releaseDate: values.releaseDate || new Date().getFullYear().toString(),
      } as Episode;

      await onSave(episodeData);
      form.resetFields();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Episode form error:", error);
      notification.error({
        message: "Hata",
        description: `Form gönderilirken hata oluştu: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={initialValues || {}}
    >
      <Form.Item
        name="title"
        label="Bölüm Başlığı"
        rules={[{ required: true, message: "Bölüm başlığı girin!" }]}
      >
        <Input placeholder="Örn: Naruto Bölüm 1" />
      </Form.Item>
      <Form.Item
        name="episodeNumber"
        label="Bölüm Numarası"
        rules={[{ required: true, message: "Bölüm numarası girin!" }]}
      >
        <InputNumber min={1} style={{ width: "100%" }} placeholder="1" />
      </Form.Item>
      <Form.Item name="duration" label="Süre (Dakika)">
        <InputNumber
          min={1}
          max={180}
          style={{ width: "100%" }}
          placeholder="25"
        />
      </Form.Item>
      <Form.Item name="videoUrl" label="Video URL">
        <Input placeholder="https://cdn.example.com/videos/naruto-ep1.mp4" />
      </Form.Item>
      <Form.Item name="thumbnailUrl" label="Thumbnail URL">
        <Input placeholder="https://cdn.example.com/thumbnails/naruto-ep1.jpg" />
      </Form.Item>
      <Form.Item name="releaseDate" label="Yayın Tarihi">
        <Input placeholder="2002" />
      </Form.Item>
      <Form.Item name="description" label="Açıklama">
        <Input.TextArea rows={3} placeholder="Bölüm açıklaması..." />
      </Form.Item>
      <div className={styles.formButtons}>
        <Button
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={loading}
        >
          İptal
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className={styles.saveButton}
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </Form>
  );
};

export default AnimeSeasonModal;
