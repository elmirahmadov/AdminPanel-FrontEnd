import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  MessageOutlined,
  PushpinOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Button, Form, Modal, Table, Tag } from "antd";

import ForumForm from "./components/ForumForm";
import ForumHeader from "./components/ForumHeader";
import ForumTable from "./components/ForumTable";
import ReplyModal from "./components/ReplyModal/ReplyModal";
import TopicModal from "./components/TopicModal/TopicModal";
import styles from "./ForumList.module.css";

import { useForumStore } from "../../common/store/forum";
import type { IForum, ITopic } from "../../common/store/forum/forum.types";
import DeleteModal from "@/common/components/DeleteModals/DeleteModal";
import { Loading } from "@/common/components/Loading";

const ForumList: React.FC = () => {
  const {
    forums,
    topics,
    loading,
    error,
    fetchForums,
    addForum,
    editForum,
    removeForum,
    getTopicsByForum,
    deleteTopic,
    pinTopic,
    lockTopic,
    stickyTopic,
  } = useForumStore();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IForum | null>(null);
  const [viewing, setViewing] = useState<IForum | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [forumToDelete, setForumToDelete] = useState<IForum | null>(null);
  const [form] = Form.useForm();

  // Topic and Reply modals
  const [topicModalVisible, setTopicModalVisible] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [editingTopic, setEditingTopic] = useState<ITopic | null>(null);
  const [editingReply, setEditingReply] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Topics pagination state
  const [topicsCurrentPage, setTopicsCurrentPage] = useState(1);
  const [topicsPageSize, setTopicsPageSize] = useState(10);

  useEffect(() => {
    fetchForums();
    // Sadece forumları getir, konular forum seçildiğinde getirilecek
  }, [fetchForums]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return forums;
    return forums.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q)
    );
  }, [forums, search]);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (forum: IForum) => {
    setEditing(forum);
    form.setFieldsValue({
      title: forum.title,
      description: forum.description,
      category: forum.category,
      isActive: forum.isActive,
    });
    setModalOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await editForum(editing.id, values);
    } else {
      await addForum(values);
    }
    setModalOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const openDeleteModal = (forum: IForum) => {
    setForumToDelete(forum);
    setIsDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setForumToDelete(null);
  };

  const handleDelete = async () => {
    if (!forumToDelete) return;

    try {
      await removeForum(forumToDelete.id);
      closeDeleteModal();
    } catch (error) {
      console.error("Forum silinirken hata:", error);
    }
  };

  const onDelete = async (forum: IForum) => {
    openDeleteModal(forum);
  };

  const onViewTopics = async (forum: IForum) => {
    setViewing(forum);
    await getTopicsByForum(forum.id); // Sadece bu forumun konularını getir
    // Pagination state'lerini sıfırla
    setTopicsCurrentPage(1);
    setTopicsPageSize(10);
  };

  const onAddTopic = (forumId: string) => {
    setSelectedTopicId(forumId);
    setEditingTopic(null);
    setTopicModalVisible(true);
  };

  const onEditTopic = (topic: ITopic) => {
    setEditingTopic(topic);
    setTopicModalVisible(true);
  };

  const onDeleteTopic = async (topicId: number) => {
    try {
      await deleteTopic(topicId.toString());
      // Konular otomatik olarak güncellenir (store'da state güncelleniyor)
    } catch (error) {
      console.error("Topic silinirken hata:", error);
    }
  };

  const onPinTopic = async (topicId: number) => {
    try {
      await pinTopic(topicId.toString());
    } catch (error) {
      console.error("Topic sabitleme hatası:", error);
    }
  };

  const onLockTopic = async (topicId: number) => {
    try {
      await lockTopic(topicId.toString());
    } catch (error) {
      console.error("Topic kilitleme hatası:", error);
    }
  };

  const onStickyTopic = async (topicId: number) => {
    try {
      await stickyTopic(topicId.toString());
    } catch (error) {
      console.error("Topic yapışkan yapma hatası:", error);
    }
  };

  const onToggleStatus = async (forum: IForum, isActive: boolean) => {
    await editForum(forum.id, { isActive });
  };

  // Loading durumunda Loading component'ini göster
  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      {/* Error Display */}
      {error && <div className={styles.errorDisplay}>{error}</div>}

      {!viewing && (
        <ForumHeader
          search={search}
          onSearchChange={setSearch}
          onAddClick={openAdd}
        />
      )}

      {!viewing ? (
        <ForumTable
          forums={filtered}
          loading={loading}
          onEdit={openEdit}
          onDelete={onDelete}
          onViewTopics={onViewTopics}
          onToggleStatus={onToggleStatus}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      ) : (
        <div className={styles.topicsView}>
          <div className={styles.topicsHeader}>
            <div className={styles.topicsHeaderLeft}>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => setViewing(null)}
                className={styles.backButton}
              >
                Foruma Geri Dön
              </Button>
              <h2>{viewing.title} - Konular</h2>
            </div>
            <Button
              type="primary"
              onClick={() => onAddTopic(viewing.id)}
              icon={<MessageOutlined />}
            >
              Yeni Konu Oluştur
            </Button>
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <p>Konular yükleniyor...</p>
            </div>
          ) : topics && topics.length > 0 ? (
            <div className={styles.topicsTable}>
              <Table
                columns={[
                  {
                    title: "Başlık",
                    dataIndex: "title",
                    key: "title",
                    width: 300,
                    render: (title: string, record: ITopic) => (
                      <div className={styles.topicTitleCell}>
                        {title}
                        {record.isPinned && (
                          <Tag color="green" className={styles.pinnedTag}>
                            📌
                          </Tag>
                        )}
                        {record.isSticky && (
                          <Tag color="orange" className={styles.stickyTag}>
                            ⭐
                          </Tag>
                        )}
                        {record.isLocked && (
                          <Tag color="red" className={styles.lockedTag}>
                            🔒
                          </Tag>
                        )}
                      </div>
                    ),
                  },
                  {
                    title: "Yazar",
                    dataIndex: "user",
                    key: "user",
                    width: 150,
                    render: (user: ITopic["user"], record: ITopic) => (
                      <div className={styles.authorCell}>
                        {record.user?.profileImage && (
                          <img
                            src={record.user.profileImage}
                            alt={record.user.username}
                            className={styles.authorAvatar}
                          />
                        )}
                        <span>{record.user?.username || "Bilinmeyen"}</span>
                      </div>
                    ),
                  },
                  {
                    title: "Yanıtlar",
                    dataIndex: "_count",
                    key: "_count",
                    width: 100,
                    render: (_count: ITopic["_count"], record: ITopic) => (
                      <div className={styles.replyCountCell}>
                        <MessageOutlined /> {record._count?.posts || 0}
                      </div>
                    ),
                  },
                  {
                    title: "Görüntülenme",
                    dataIndex: "viewCount",
                    key: "viewCount",
                    width: 120,
                    render: (count: number) => (
                      <div className={styles.viewCountCell}>
                        <EyeOutlined /> {count}
                      </div>
                    ),
                  },
                  {
                    title: "Tarih",
                    dataIndex: "createdAt",
                    key: "createdAt",
                    width: 120,
                    render: (date: string) => (
                      <div className={styles.dateCell}>
                        {new Date(date).toLocaleDateString("tr-TR")}
                      </div>
                    ),
                  },
                  {
                    title: "İşlemler",
                    key: "actions",
                    width: 150,
                    render: (_: unknown, record: ITopic) => (
                      <div className={styles.actionsCell}>
                        <Button
                          icon={<PushpinOutlined />}
                          onClick={() => onPinTopic(record.id)}
                          className={`${styles.iconBtn} ${record.isPinned ? styles.pinnedButton : ""}`}
                          title={
                            record.isPinned
                              ? "Sabitlemeyi Kaldır (Tekrar tıkla)"
                              : "Sabitle (Tekrar tıkla kaldır)"
                          }
                        />
                        <Button
                          icon={<LockOutlined />}
                          onClick={() => onLockTopic(record.id)}
                          className={`${styles.iconBtn} ${record.isLocked ? styles.lockedButton : ""}`}
                          title={
                            record.isLocked
                              ? "Kilidi Aç (Tekrar tıkla)"
                              : "Kilitle (Tekrar tıkla aç)"
                          }
                        />
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => onEditTopic(record)}
                          className={styles.iconBtn}
                          title="Düzenle"
                        />
                        <Button
                          icon={<StarOutlined />}
                          onClick={() => onStickyTopic(record.id)}
                          className={`${styles.iconBtn} ${record.isSticky ? styles.stickyButton : ""}`}
                          title={
                            record.isSticky
                              ? "Yapışkan Kaldır (Tekrar tıkla)"
                              : "Yapışkan Yap (Tekrar tıkla kaldır)"
                          }
                        />
                        <Button
                          icon={<DeleteOutlined />}
                          onClick={() => onDeleteTopic(record.id)}
                          className={`${styles.iconBtn} ${styles.deleteBtn}`}
                          title="Sil"
                        />
                      </div>
                    ),
                  },
                ]}
                dataSource={topics}
                rowKey="id"
                pagination={{
                  current: topicsCurrentPage,
                  pageSize: topicsPageSize,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} / ${total} konu`,
                  onChange: setTopicsCurrentPage,
                  onShowSizeChange: setTopicsPageSize,
                }}
                className={styles.topicsTableComponent}
              />
            </div>
          ) : (
            <div className={styles.noTopics}>
              <p>Bu forumda henüz konu bulunmuyor.</p>
            </div>
          )}
        </div>
      )}

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title={editing ? "Forumu Düzenle" : "Yeni Forum"}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>
            İptal
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={onSubmit}
          >
            {editing ? "Güncelle" : "Oluştur"}
          </Button>,
        ]}
      >
        <ForumForm form={form} />
      </Modal>

      {/* Topic and Reply Modals */}
      <TopicModal
        open={topicModalVisible}
        onCancel={() => {
          setTopicModalVisible(false);
          setEditingTopic(null);
        }}
        forumId={viewing?.id || ""}
        editingTopic={editingTopic}
        mode={editingTopic ? "edit" : "create"}
        onSuccess={() => {
          // Konu oluşturulduktan sonra sadece bu forumun konularını yenile
          if (viewing) {
            getTopicsByForum(viewing.id);
          }
        }}
      />

      <ReplyModal
        open={replyModalVisible}
        onCancel={() => {
          setReplyModalVisible(false);
          setEditingReply(null);
        }}
        topicId={selectedTopicId}
        editingReply={editingReply}
        mode={editingReply ? "edit" : "create"}
      />

      <DeleteModal
        open={isDeleteModalVisible}
        onCancel={closeDeleteModal}
        onConfirm={handleDelete}
        title="Forum Silme Onayı"
        message={`"${forumToDelete?.title}" forumunu silmek istediğinizden emin misiniz?`}
      />
    </div>
  );
};

export default ForumList;
