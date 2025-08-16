import React, { useEffect, useState } from "react";

import {
  CloseCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  StarOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Card, Col, Form, message, Row, Statistic, Button } from "antd";

import styles from "./CommentList.module.css";

import CommentFilters from "./components/CommentFilters";
import CommentModals from "./components/CommentModals";
import CommentTable from "./components/CommentTable";

import DeleteModal from "@/common/components/DeleteModals/DeleteModal";
import { Loading } from "@/common/components/Loading";
import { useCommentStore } from "@/common/store/comment/comment.store";
import { useSeasonStore } from "@/common/store/season/season.store";
import { useEpisodeStore } from "@/common/store/episode/episode.store";
import { useAnimeStore } from "@/common/store/anime/anime.store";
import { lookupAnime } from "../../../services/api/anime.api";

import type {
  IComment,
  ICommentCreatePayload,
  ICommentUpdatePayload,
} from "@/common/store/comment/comment.types";

const PAGE_SIZE = 8;

// Admin Dashboard Statistics Interface
interface DashboardStats {
  totalComments: number;
  pendingModeration: number;
  dailyGrowth: number;
  approvedComments: number;
  rejectedComments: number;
  hiddenComments: number;
  averageRating: number;
  activeUsers: number;
}

const CommentList: React.FC = () => {
  const { comments, loading, pagination } = useCommentStore();
  const {
    fetchComments,
    searchComments,
    addComment,
    editComment,
    removeComment,
    approveComment,
    rejectComment,
    setPagination,
  } = useCommentStore((s) => s.actions);

  // State management
  const [searchValue, setSearchValue] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isModerationModalVisible, setIsModerationModalVisible] =
    useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editingComment, setEditingComment] = useState<IComment | null>(null);
  const [selectedCommentForModeration, setSelectedCommentForModeration] =
    useState<IComment | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<IComment | null>(null);
  const [animeOptions, setAnimeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [episodeOptions, setEpisodeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [animeSearchTimer, setAnimeSearchTimer] =
    useState<NodeJS.Timeout | null>(null);
  const [form] = Form.useForm();

  // Page state for pagination
  const [page, setPage] = useState(1);

  // Filter states
  const [filters, setFilters] = useState({
    animeId: undefined as string | undefined,
    seasonId: undefined as string | undefined,
    episodeId: undefined as string | undefined,
    commentType: undefined as "anime" | "episode" | undefined,
    status: undefined as string | undefined,
    dateRange: undefined as [string, string] | undefined,
  });

  // Filtered comments
  const filteredComments = React.useMemo(() => {
    if (!Array.isArray(comments)) return [];

    const filtered = comments.filter((comment) => {
      // Anime filter
      if (
        filters.animeId &&
        comment.anime?.id?.toString() !== filters.animeId
      ) {
        return false;
      }

      // Season filter
      if (
        filters.seasonId &&
        comment.season?.id?.toString() !== filters.seasonId
      ) {
        return false;
      }

      // Episode filter
      if (
        filters.episodeId &&
        comment.episode?.id?.toString() !== filters.episodeId
      ) {
        return false;
      }

      // Comment type filter
      if (filters.commentType) {
        if (filters.commentType === "anime" && comment.episode) {
          return false;
        }
        if (filters.commentType === "episode" && !comment.episode) {
          return false;
        }
      }

      // Status filter
      if (filters.status && comment.status !== filters.status) {
        return false;
      }

      // Date range filter
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        const commentDate = new Date(comment.createdAt);
        const startDate = new Date(filters.dateRange[0]);
        const endDate = new Date(filters.dateRange[1]);

        if (commentDate < startDate || commentDate > endDate) {
          return false;
        }
      }

      return true;
    });

    // Apply pagination
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filtered.slice(startIndex, endIndex);
  }, [comments, filters, page]);

  // Filter handling functions
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilterReset = () => {
    setFilters({
      animeId: undefined,
      seasonId: undefined,
      episodeId: undefined,
      commentType: undefined,
      status: undefined,
      dateRange: undefined,
    });
  };

  const handleSeasonFilterChange = async (animeId: string) => {
    setFilters((prev) => ({
      ...prev,
      animeId,
      seasonId: undefined,
      episodeId: undefined,
    }));

    if (!animeId) return;

    try {
      const selectedAnime = animeOptions.find(
        (option) => option.value === animeId
      );
      if (!selectedAnime) return;

      const response = await lookupAnime(selectedAnime.label);
      const results = response.data;
      const anime = results.find((a: any) => a.id.toString() === animeId);

      if (!anime || !anime.seasons || !Array.isArray(anime.seasons)) {
        return;
      }

      const allEpisodeOptions: Array<{ value: string; label: string }> = [];

      anime.seasons.forEach((season: any) => {
        if (season.episodes && Array.isArray(season.episodes)) {
          season.episodes.forEach((episode: any) => {
            allEpisodeOptions.push({
              value: `${season.id}-${episode.id}`,
              label: `Sezon ${season.number} - Bölüm ${episode.number}`,
            });
          });
        }
      });

      setEpisodeOptions(allEpisodeOptions);
    } catch (error) {
      console.error("Failed to create episode options for filter:", error);
    }
  };

  // Dashboard statistics
  const dashboardStats = ((): DashboardStats => {
    const safeComments = Array.isArray(comments) ? comments : [];
    const totalComments = safeComments.length;
    const pendingModeration = safeComments.filter(
      (comment) => comment.status === "PENDING"
    ).length;
    const approvedComments = safeComments.filter(
      (comment) => comment.status === "APPROVED"
    ).length;
    const rejectedComments = safeComments.filter(
      (comment) => comment.status === "REJECTED"
    ).length;
    const hiddenComments = safeComments.filter(
      (comment) => comment.status === "HIDDEN"
    ).length;

    return {
      totalComments,
      pendingModeration,
      dailyGrowth: 0,
      approvedComments,
      rejectedComments,
      hiddenComments,
      averageRating: 0,
      activeUsers: 0,
    };
  })();

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (animeSearchTimer) {
        clearTimeout(animeSearchTimer);
      }
    };
  }, [animeSearchTimer]);

  // Event handlers
  const openModerationModal = (comment: IComment) => {
    setSelectedCommentForModeration(comment);
    setIsModerationModalVisible(true);
  };

  const handleModeration = async (action: "APPROVE" | "REJECT" | "HIDE") => {
    if (!selectedCommentForModeration) return;

    try {
      switch (action) {
        case "APPROVE":
          await approveComment(selectedCommentForModeration.id);
          break;
        case "REJECT":
          await rejectComment(selectedCommentForModeration.id);
          break;
        case "HIDE":
          await editComment(selectedCommentForModeration.id, {
            status: "HIDDEN",
          });
          break;
      }
      setIsModerationModalVisible(false);
      setSelectedCommentForModeration(null);
      fetchComments();
    } catch (error) {}
  };

  const exportToCSV = () => {
    const safeComments = Array.isArray(comments) ? comments : [];
    if (safeComments.length === 0) {
      return;
    }

    const csvContent = [
      "ID,İçerik,Kullanıcı,Anime,Episode,Durum,Beğeni,Beğenmeme,Tarih",
      ...safeComments.map((comment) =>
        [
          comment.id,
          `"${comment.content}"`,
          comment.user?.username || "-",
          comment.anime?.title || "-",
          comment.episode?.title || "-",
          comment.status,
          comment.likesCount,
          comment.dislikesCount,
          new Date(comment.createdAt).toLocaleDateString("tr-TR"),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `yorumlar_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openAdd = () => {
    setIsAddModalVisible(true);
    form.resetFields();
  };

  const openEdit = (comment: IComment) => {
    setEditingComment(comment);
    setIsEditModalVisible(true);
  };

  const onAddSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Parse seasonId and episodeId from combined field (if provided)
      const seasonEpisodeId = values.seasonEpisodeId;
      let seasonId: number | undefined;
      let episodeId: number | undefined;

      if (seasonEpisodeId) {
        [seasonId, episodeId] = seasonEpisodeId.split("-").map(Number);
      }

      const payload: ICommentCreatePayload = {
        animeId: Number(values.animeId),
        content: values.content,
        isSpoiler: false,
      };

      // Only add seasonId and episodeId if they are provided
      if (seasonId) {
        payload.seasonId = seasonId;
      }
      if (episodeId) {
        payload.episodeId = episodeId;
      }

      console.log("Sending payload:", payload);
      console.log("API endpoint:", "/api/comment");

      await addComment(payload);
      setIsAddModalVisible(false);
      form.resetFields();
      fetchComments();
    } catch (error: any) {
      console.error("Error details:", error);
      console.error("Error message:", error?.message);
      console.error("Error response:", error?.response);
      console.error("Error status:", error?.response?.status);
      console.error("Error data:", error?.response?.data);
    }
  };

  const onEditSubmit = async () => {
    if (!editingComment) return;

    try {
      const values = await form.validateFields();

      // Parse seasonId and episodeId from combined field (if provided)
      const seasonEpisodeId = values.seasonEpisodeId;
      let seasonId: number | undefined;
      let episodeId: number | undefined;

      if (seasonEpisodeId) {
        [seasonId, episodeId] = seasonEpisodeId.split("-").map(Number);
      }

      const payload: ICommentUpdatePayload = {
        content: values.content,
        status: values.status,
      };

      // Only add seasonId and episodeId if they are provided
      if (seasonId) {
        payload.seasonId = seasonId;
      } else {
        payload.seasonId = null;
      }
      if (episodeId) {
        payload.episodeId = episodeId;
      } else {
        payload.episodeId = null;
      }

      await editComment(editingComment.id, payload);
      setIsEditModalVisible(false);
      setEditingComment(null);
      form.resetFields();
      fetchComments();
    } catch (error) {}
  };

  const openDeleteModal = (comment: IComment) => {
    setCommentToDelete(comment);
    setIsDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setCommentToDelete(null);
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;

    try {
      await removeComment(commentToDelete.id);
      fetchComments();
      closeDeleteModal();
    } catch (error) {}
  };

  const onDelete = async (comment: IComment) => {
    openDeleteModal(comment);
  };

  const onApprove = async (comment: IComment) => {
    try {
      await approveComment(comment.id);
      fetchComments();
    } catch (error) {}
  };

  const onReject = async (comment: IComment) => {
    try {
      await rejectComment(comment.id);
      fetchComments();
    } catch (error) {}
  };

  const handleAnimeLookup = async (query: string) => {
    if (query.length < 2) return;

    // Clear previous timer
    if (animeSearchTimer) {
      clearTimeout(animeSearchTimer);
    }

    // Set new timer for 300ms debouncing
    const timer = setTimeout(async () => {
      try {
        const response = await lookupAnime(query);
        const results = response.data;
        const options = results
          .filter(
            (it: {
              id: number;
              title?: string;
              name?: string;
              slug?: string;
            }): it is {
              id: number;
              title?: string;
              name?: string;
              slug?: string;
            } => it !== null
          )
          .map(
            (it: {
              id: number;
              title?: string;
              name?: string;
              slug?: string;
            }) => ({
              value: String(it.id),
              label: it.title || it.name || it.slug || String(it.id),
            })
          );
        setAnimeOptions(options);

        // If there's only one result, automatically populate season/episode options
        if (results.length === 1) {
          const anime = results[0];
          if (anime.seasons && Array.isArray(anime.seasons)) {
            const allEpisodeOptions: Array<{ value: string; label: string }> =
              [];

            anime.seasons.forEach((season: any) => {
              if (season.episodes && Array.isArray(season.episodes)) {
                season.episodes.forEach((episode: any) => {
                  allEpisodeOptions.push({
                    value: `${season.id}-${episode.id}`,
                    label: `Sezon ${season.number} - Bölüm ${episode.number}`,
                  });
                });
              }
            });

            setEpisodeOptions(allEpisodeOptions);
            console.log(
              "Episode options created from lookup:",
              allEpisodeOptions
            );
          }
        }
      } catch (error) {
        console.error("Anime lookup error:", error);
        setAnimeOptions([]);
      }
    }, 300);

    setAnimeSearchTimer(timer);
  };

  const handleSeasonChange = async (animeId: string) => {
    form.setFieldsValue({ seasonEpisodeId: undefined });
    setEpisodeOptions([]);

    if (!animeId) return;

    try {
      // Find the selected anime from the lookup results
      const selectedAnime = animeOptions.find(
        (option) => option.value === animeId
      );
      if (!selectedAnime) return;

      // Get the full anime data from the lookup response
      const response = await lookupAnime(selectedAnime.label);
      const results = response.data;
      const anime = results.find((a: any) => a.id.toString() === animeId);

      if (!anime || !anime.seasons || !Array.isArray(anime.seasons)) {
        console.log("No seasons found for anime:", animeId);
        return;
      }

      // Create episode options from the seasons and episodes data
      const allEpisodeOptions: Array<{ value: string; label: string }> = [];

      anime.seasons.forEach((season: any) => {
        if (season.episodes && Array.isArray(season.episodes)) {
          season.episodes.forEach((episode: any) => {
            allEpisodeOptions.push({
              value: `${season.id}-${episode.id}`,
              label: `Sezon ${season.number} - Bölüm ${episode.number}`,
            });
          });
        }
      });

      setEpisodeOptions(allEpisodeOptions);
      console.log(
        "Episode options created from season change:",
        allEpisodeOptions
      );
    } catch (error) {
      console.error("Failed to create episode options:", error);
    }
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      searchComments({
        content: searchValue,
        anime: searchValue,
        user: searchValue,
      });
    } else {
      fetchComments();
    }
  };

  // Loading durumunda Loading component'ini göster
  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      {/* Yorum İstatistikleri */}
      <div className={styles.dashboard}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Toplam Yorum"
                value={dashboardStats.totalComments}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Bekleyen"
                value={dashboardStats.pendingModeration}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Onaylanan"
                value={dashboardStats.approvedComments}
                prefix={<StarOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Reddedilen"
                value={dashboardStats.rejectedComments}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <CommentFilters
        searchValue={searchValue}
        onSearchChange={(e) => setSearchValue(e.target.value)}
        onSearch={handleSearch}
        onAddComment={openAdd}
        onExportCSV={exportToCSV}
        filters={filters}
        onFilterChange={handleFilterChange}
        onFilterReset={handleFilterReset}
        animeOptions={animeOptions}
        episodeOptions={episodeOptions}
        onSeasonFilterChange={handleSeasonFilterChange}
        onAnimeLookup={handleAnimeLookup}
      />
      <div className={styles.tableContainer}>
        <CommentTable
          comments={filteredComments}
          loading={loading}
          onEdit={openEdit}
          onDelete={onDelete}
          onApprove={onApprove}
          onReject={onReject}
          onModeration={openModerationModal}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total: Array.isArray(comments) ? comments.length : 0,
            onChange: setPage,
            showSizeChanger: false,
          }}
        />
      </div>

      <CommentModals
        isAddModalVisible={isAddModalVisible}
        isEditModalVisible={isEditModalVisible}
        isModerationModalVisible={isModerationModalVisible}
        onAddModalClose={() => setIsAddModalVisible(false)}
        onEditModalClose={() => setIsEditModalVisible(false)}
        onModerationModalClose={() => setIsModerationModalVisible(false)}
        onAddSubmit={onAddSubmit}
        onEditSubmit={onEditSubmit}
        onModerationSubmit={handleModeration}
        form={form}
        editingComment={editingComment}
        selectedCommentForModeration={selectedCommentForModeration}
        animeOptions={animeOptions}
        episodeOptions={episodeOptions}
        onAnimeLookup={handleAnimeLookup}
        onSeasonChange={handleSeasonChange}
      />

      <DeleteModal
        open={isDeleteModalVisible}
        onCancel={closeDeleteModal}
        onConfirm={handleDelete}
        title="Yorum Silme Onayı"
        message={`"${commentToDelete?.content?.substring(0, 50)}${commentToDelete?.content && commentToDelete.content.length > 50 ? "..." : ""}" yorumunu silmek istediğinizden emin misiniz?`}
      />
    </div>
  );
};

export default CommentList;
