import React, { useEffect, useState } from "react";

import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { Button, Image, Table, Tag, Tooltip } from "antd";

import styles from "./AnimeList.module.css";
import AnimeAddEditModal from "./components/AnimeAddEditModal/AnimeAddEditModal";
import AnimeFilterBar from "./components/AnimeFilterBar/AnimeFilterBar";
import SeasonModal from "./components/SeasonModal/SeasonModal";

import DeleteModal from "@/common/components/DeleteModals/DeleteModal";
import { Loading } from "@/common/components/Loading";
import { useAnimeStore } from "@/common/store/anime";
import type { IAnime } from "@/common/store/anime/anime.types";
import { useSeasonStore } from "@/common/store/season";
import type { ISeason } from "@/common/store/season/season.types";

const PAGE_SIZE = 5;

const initialForm = {
  title: "",
  slug: "",
  description: "",
  releaseYear: undefined as number | undefined,
  type: "",
  status: "",
  imageUrl: "",
  bannerUrl: "",
  studios: [] as string[],
  trailerUrl: "",
  genres: [] as number[],
  rating: 0,
};

// Build API payload in required shape
function slugify(text: string): string {
  return String(text)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildAnimePayload(values: Record<string, unknown>) {
  const {
    title,
    slug,
    description,
    releaseYear,
    type,
    status,
    imageUrl,
    bannerUrl,
    studios,
    trailerUrl,
    genres,
    rating,
  } = values as {
    title: string;
    slug: string;
    description?: string;
    releaseYear?: number | string;
    type: string;
    status: string;
    imageUrl?: string;
    bannerUrl?: string;
    studios?: string[];
    trailerUrl?: string;
    genres?: (number | string)[];
    rating?: number | string;
  };

  return {
    title,
    slug: slug ? slugify(slug) : slugify(title),
    description,
    releaseYear: Number(releaseYear) || undefined,
    type,
    status,
    imageUrl,
    bannerUrl,
    studios: Array.isArray(studios) ? studios : [],
    trailerUrl,
    genres: Array.isArray(genres)
      ? (genres as (number | string)[])
          .map((g) => Number(g))
          .filter((n) => !Number.isNaN(n))
      : [],
    rating: typeof rating === "number" ? rating : Number(rating) || 0,
  };
}

// SeasonModal's public prop expects Season with optional id and episodeCount etc.
// We mirror that here to type our local handlers without any casts.
export type SeasonModalSeason = {
  id?: string;
  name: string;
  number: number;
  episodeCount?: number;
  releaseYear?: number;
};

const AnimeList: React.FC = () => {
  const { animes, loading } = useAnimeStore();
  const {
    fetchAnimes,
    addAnime,
    updateAnime,
    deleteAnime,
    addToFeatured,
    removeFromFeatured,
  } = useAnimeStore((s) => s.actions);
  const { seasons, loading: seasonsLoading } = useSeasonStore();
  const { fetchSeasons, addSeason, updateSeason, deleteSeason } =
    useSeasonStore((s) => s.actions);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [modalType, setModalType] = useState<
    null | "add" | "edit" | "delete" | "season"
  >(null);
  const [selectedAnime, setSelectedAnime] = useState<IAnime | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [seasonModalOpen, setSeasonModalOpen] = useState(false);
  const [featuredOverride, setFeaturedOverride] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    fetchAnimes();
  }, [fetchAnimes]);

  // Loading durumunda Loading component'ini göster
  if (loading) {
    return <Loading />;
  }

  // Tam sayfayı yeniden render eden loading yerine tablo içi loading kullanacağız

  const allGenres = Array.from(new Set(animes.flatMap((a) => a.genres || [])));
  const filteredData = animes.filter(
    (anime) =>
      anime.title.toLowerCase().includes(search.toLowerCase()) &&
      (genre ? anime.genres?.includes(genre) : true)
  );
  // Table'ın dahili pagination'ını kullanacağız (Genres sayfası ile aynı yaklaşım)

  const openAddModal = () => {
    setModalType("add");
    setSelectedAnime(null);
  };
  const openEditModal = (anime: IAnime) => {
    setModalType("edit");
    setSelectedAnime(anime);
  };
  const openDeleteModal = (anime: IAnime) => {
    setModalType("delete");
    setSelectedAnime(anime);
  };
  const openSeasonModal = (anime: IAnime) => {
    setModalType("season");
    setSelectedAnime(anime);
    fetchSeasons(anime.id);
    setSeasonModalOpen(true);
  };
  const closeModal = () => {
    setModalType(null);
    setSelectedAnime(null);
  };
  const closeSeasonModal = () => {
    setSeasonModalOpen(false);
    setModalType(null);
  };

  const handleAddSeason = (season: SeasonModalSeason) => {
    if (!selectedAnime) return;
    addSeason({
      ...season,
      animeId: selectedAnime.id,
    } as unknown as ISeason).catch((err: unknown) => console.error(err));
  };
  const handleEditSeason = (season: SeasonModalSeason) => {
    if (!selectedAnime || !season.id) return;
    updateSeason(season.id, {
      ...(season as ISeason),
      animeId: selectedAnime.id,
    } as ISeason).catch((err: unknown) => console.error(err));
  };
  const handleDeleteSeason = (season: SeasonModalSeason) => {
    if (!selectedAnime || !season.id) return;
    deleteSeason(season.id, selectedAnime.id).catch((err: unknown) =>
      console.error(err)
    );
  };

  const currentFeatured = (anime: IAnime) =>
    featuredOverride[anime.id] ?? Boolean(anime.featured);

  const toggleFeatured = async (anime: IAnime) => {
    const next = !currentFeatured(anime);
    setFeaturedOverride((prev) => ({ ...prev, [anime.id]: next }));
    try {
      if (next) {
        await addToFeatured(anime.id);
      } else {
        await removeFromFeatured(anime.id);
      }
    } catch (err) {
      console.error("Featured toggle error", err);
      setFeaturedOverride((prev) => ({ ...prev, [anime.id]: !next }));
    }
  };

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    setFormError(null);
    const payload = buildAnimePayload(values);
    try {
      if (modalType === "add") {
        await addAnime(payload);
      } else if (modalType === "edit" && selectedAnime) {
        await updateAnime(selectedAnime.id, payload);
      }
    } catch (err) {
      console.error(err);
    }
    // önce modalı kapat; store içindeki action zaten listeyi yeniliyor
    closeModal();
  };
  const handleDelete = async () => {
    if (selectedAnime) {
      try {
        await deleteAnime(selectedAnime.id);
      } catch (err) {
        console.error(err);
      }
    }
    closeModal();
  };

  // Table columns configuration
  const columns = [
    {
      title: "Cover",
      dataIndex: "imageUrl",
      key: "cover",
      width: 110,
      align: "center" as const,
      render: (imageUrl: string | undefined, record: IAnime) => (
        <div className={styles.coverCell}>
          <div className={styles.coverWrapper}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={record.title}
                preview={false}
                className={styles.coverImage}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
            ) : (
              <div className={styles.noImage}>
                <span>—</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (title: string, record: IAnime) => (
        <div className={styles.titleCell} title={title}>
          <div className={styles.titleText}>{title}</div>
          <div className={styles.slugText}>{record.slug}</div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 90,
      align: "center" as const,
      render: (type: string | undefined) => (
        <Tag
          color={type === "TV" ? "blue" : type === "MOVIE" ? "green" : "orange"}
        >
          {type || "TV"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center" as const,
      render: (status: string) => {
        const statusColors: Record<string, string> = {
          ONGOING: "green",
          COMPLETED: "blue",
          UPCOMING: "orange",
          PAUSED: "red",
        };
        return <Tag color={statusColors[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Year",
      dataIndex: "releaseYear",
      key: "year",
      width: 90,
      align: "center" as const,
      render: (year: number | undefined) => year || "-",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 140,
      align: "center" as const,
      render: (ratingValue: number | undefined) => {
        const numeric =
          typeof ratingValue === "number"
            ? ratingValue
            : Number(ratingValue) || 0; // backend 0-10
        const clampedTen = Math.min(10, Math.max(0, numeric)); // 0-10 aralığına al
        const starCount = Math.max(
          0,
          Math.min(5, Math.round((clampedTen / 10) * 5))
        ); // 0-5 yıldıza ölçekle
        const fullStars = starCount;
        const emptyStars = 5 - fullStars;
        return (
          <div className={styles.ratingCell}>
            <span className={styles.ratingStars}>
              {"★".repeat(fullStars)}
              {"☆".repeat(emptyStars)}
            </span>
            <span className={styles.ratingNumber}>
              {clampedTen.toFixed(1)}/10
            </span>
          </div>
        );
      },
    },
    {
      title: "Genres",
      dataIndex: "genres",
      key: "genres",
      width: 160,
      render: (genres: unknown) => {
        // genres backend'den string[], number[] veya obje[] ({name}) gelebilir
        const list: string[] = Array.isArray(genres)
          ? (genres as Array<string | number | { name?: string }>).map((g) =>
              typeof g === "object" ? g?.name || "" : String(g)
            )
          : [];
        return (
          <div className={styles.genresCell}>
            {list.length > 0 ? (
              list.slice(0, 3).map((genre, index) => (
                <Tag key={index} color="purple" className={styles.genreTag}>
                  {genre}
                </Tag>
              ))
            ) : (
              <span className={styles.noGenres}>-</span>
            )}
            {list.length > 3 && (
              <Tooltip title={list.slice(3).join(", ")}>
                <Tag color="purple" className={styles.moreGenres}>
                  +{list.length - 3}
                </Tag>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 240,
      align: "center" as const,
      render: (_unused: unknown, record: IAnime) => (
        <div className={styles.actionRow}>
          {/* Featured toggle as a star icon */}
          <Tooltip
            title={currentFeatured(record) ? "Öne Çıkarıldı" : "Öne Çıkar"}
          >
            <Button
              icon={
                currentFeatured(record) ? (
                  <StarFilled style={{ color: "#fbbf24" }} />
                ) : (
                  <StarOutlined />
                )
              }
              onClick={() => toggleFeatured(record)}
              className={`${styles.iconBtn} ${
                currentFeatured(record) ? styles.starActive : styles.starBtn
              }`}
            />
          </Tooltip>
          <Tooltip title="Edit Anime">
            <Button
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
              className={styles.iconBtn}
            />
          </Tooltip>
          <Tooltip title="Manage Seasons">
            <Button
              icon={<PlayCircleOutlined />}
              onClick={() => openSeasonModal(record)}
              className={styles.iconBtn}
            />
          </Tooltip>
          <Tooltip title="Delete Anime">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => openDeleteModal(record)}
              className={`${styles.iconBtn} ${styles.deleteBtn}`}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const initialFormValues: Record<string, unknown> = selectedAnime
    ? { ...(selectedAnime as unknown as Record<string, unknown>) }
    : initialForm;

  return (
    <div className={styles.animeListContainer}>
      <div className={styles.filterBarRow}>
        <AnimeFilterBar
          search={search}
          onSearchChange={setSearch}
          genre={genre}
          onGenreChange={setGenre}
          genres={allGenres}
          onAdd={openAddModal}
        />
      </div>

      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total: filteredData.length,
            onChange: setPage,
            showSizeChanger: false,
          }}
          className={styles.animeTable}
          rowClassName={styles.tableRow}
          tableLayout="fixed"
          size="small"
          loading={false}
        />
      </div>

      {(modalType === "add" || modalType === "edit") && (
        <AnimeAddEditModal
          open={true}
          onCancel={closeModal}
          onSubmit={handleFormSubmit}
          initialValues={initialFormValues}
          modalType={modalType === "add" ? "add" : "edit"}
          loading={loading}
          formError={formError}
        />
      )}
      <DeleteModal
        open={modalType === "delete"}
        onCancel={closeModal}
        onConfirm={handleDelete}
      />
      <SeasonModal
        open={seasonModalOpen}
        onCancel={closeSeasonModal}
        animeTitle={selectedAnime?.title}
        animeId={selectedAnime?.id}
        seasons={seasons}
        loading={seasonsLoading}
        onAddSeason={handleAddSeason}
        onEditSeason={handleEditSeason}
        onDeleteSeason={handleDeleteSeason}
        onManageEpisodes={() => {}}
      />
    </div>
  );
};

export default AnimeList;
