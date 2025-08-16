import React, { useEffect } from "react";

import { EditOutlined, WarningOutlined } from "@ant-design/icons";

import { Button, Form, Input, Modal, Select, Tag, Typography } from "antd";

import { IComment } from "@/common/store/comment/comment.types";

const { Text } = Typography;
const { TextArea } = Input;

interface CommentModalProps {
  isAddModalVisible: boolean;
  isEditModalVisible: boolean;
  isModerationModalVisible: boolean;
  onAddModalClose: () => void;
  onEditModalClose: () => void;
  onModerationModalClose: () => void;
  onAddSubmit: () => void;
  onEditSubmit: () => void;
  onModerationSubmit: (action: "APPROVE" | "REJECT" | "HIDE") => void;
  form: ReturnType<typeof Form.useForm>[0];
  editingComment: IComment | null;
  selectedCommentForModeration: IComment | null;
  animeOptions: { value: string; label: string }[];
  episodeOptions: { value: string; label: string }[];
  // Anime lookup
  onAnimeLookup: (query: string) => void;
  onSeasonChange: (animeId: string) => void;
}

const CommentModals: React.FC<CommentModalProps> = ({
  isAddModalVisible,
  isEditModalVisible,
  isModerationModalVisible,
  onAddModalClose,
  onEditModalClose,
  onModerationModalClose,
  onAddSubmit,
  onEditSubmit,
  onModerationSubmit,
  form,
  editingComment,
  selectedCommentForModeration,
  animeOptions,
  episodeOptions,
  onAnimeLookup,
  onSeasonChange,
}) => {
  useEffect(() => {
    if (editingComment && isEditModalVisible) {
      // Set the seasonEpisodeId if both season and episode exist
      let seasonEpisodeId: string | undefined;
      if (editingComment.season?.id && editingComment.episode?.id) {
        seasonEpisodeId = `${editingComment.season.id}-${editingComment.episode.id}`;
      }

      form.setFieldsValue({
        content: editingComment.content,
        animeId: editingComment.anime?.id,
        seasonEpisodeId: seasonEpisodeId,
        status: editingComment.status,
      });
    }
  }, [editingComment, isEditModalVisible, form]);

  return (
    <>
      {/* Add Comment Modal */}
      <Modal
        title="Yeni Yorum Ekle"
        open={isAddModalVisible}
        onCancel={onAddModalClose}
        footer={[
          <Button key="cancel" onClick={onAddModalClose}>
            İptal
          </Button>,
          <Button key="submit" type="primary" onClick={onAddSubmit}>
            Ekle
          </Button>,
        ]}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="animeId"
            label="Anime"
            rules={[{ required: true, message: "Lütfen anime seçin!" }]}
          >
            <Select
              showSearch
              placeholder="Anime ara..."
              filterOption={false}
              onSearch={onAnimeLookup}
              onChange={onSeasonChange}
              options={animeOptions}
              notFoundContent="Anime bulunamadı"
            />
          </Form.Item>

          <Form.Item
            name="seasonEpisodeId"
            label="Sezon & Bölüm (Opsiyonel)"
            rules={[
              { required: false, message: "Lütfen sezon ve bölüm seçin!" },
            ]}
          >
            <Select
              placeholder="Sezon ve bölüm seçin (boş bırakılırsa anime'ye yorum yapılır)..."
              options={episodeOptions}
              notFoundContent="Sezon/bölüm bulunamadı"
              disabled={!form.getFieldValue("animeId")}
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Yorum İçeriği"
            rules={[{ required: true, message: "Lütfen yorum içeriği girin!" }]}
          >
            <TextArea rows={4} placeholder="Yorumunuzu buraya yazın..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Comment Modal */}
      <Modal
        title="Yorum Düzenle"
        open={isEditModalVisible}
        onCancel={onEditModalClose}
        footer={[
          <Button key="cancel" onClick={onEditModalClose}>
            İptal
          </Button>,
          <Button key="submit" type="primary" onClick={onEditSubmit}>
            Güncelle
          </Button>,
        ]}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="animeId"
            label="Anime"
            rules={[{ required: true, message: "Lütfen anime seçin!" }]}
          >
            <Select
              showSearch
              placeholder="Anime ara..."
              filterOption={false}
              onSearch={onAnimeLookup}
              onChange={onSeasonChange}
              options={animeOptions}
              notFoundContent="Anime bulunamadı"
            />
          </Form.Item>

          <Form.Item
            name="seasonEpisodeId"
            label="Sezon & Bölüm (Opsiyonel)"
            rules={[
              { required: false, message: "Lütfen sezon ve bölüm seçin!" },
            ]}
          >
            <Select
              placeholder="Sezon ve bölüm seçin (boş bırakılırsa anime'ye yorum yapılır)..."
              options={episodeOptions}
              notFoundContent="Sezon/bölüm bulunamadı"
              disabled={!form.getFieldValue("animeId")}
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Yorum İçeriği"
            rules={[{ required: true, message: "Lütfen yorum içeriği girin!" }]}
          >
            <TextArea rows={4} placeholder="Yorumunuzu buraya yazın..." />
          </Form.Item>

          <Form.Item
            name="status"
            label="Durum"
            rules={[{ required: true, message: "Lütfen durum seçin!" }]}
          >
            <Select>
              <Select.Option value="APPROVED">Onaylandı</Select.Option>
              <Select.Option value="PENDING">Bekliyor</Select.Option>
              <Select.Option value="REJECTED">Reddedildi</Select.Option>
              <Select.Option value="HIDDEN">Gizlendi</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Moderation Modal */}
      <Modal
        title="Yorum Moderasyonu"
        open={isModerationModalVisible}
        onCancel={onModerationModalClose}
        footer={[
          <Button key="cancel" onClick={onModerationModalClose}>
            İptal
          </Button>,
          <Button key="hide" onClick={() => onModerationSubmit("HIDE")}>
            Gizle
          </Button>,
          <Button
            key="reject"
            danger
            onClick={() => onModerationSubmit("REJECT")}
          >
            Reddet
          </Button>,
          <Button
            key="approve"
            type="primary"
            onClick={() => onModerationSubmit("APPROVE")}
          >
            Onayla
          </Button>,
        ]}
        width={700}
      >
        {selectedCommentForModeration && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Kullanıcı:</Text>{" "}
              {selectedCommentForModeration.user?.username}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Anime/Episode:</Text>{" "}
              {selectedCommentForModeration.anime?.title ||
                selectedCommentForModeration.episode?.title ||
                "-"}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Yorum:</Text>
              <div
                style={{
                  marginTop: 8,
                  padding: 12,
                  border: "1px solid #35395a",
                  borderRadius: 6,
                  background: "#1a1d2e",
                }}
              >
                {selectedCommentForModeration.content}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Beğeni/Beğenmeme:</Text>{" "}
              <span style={{ color: "#52c41a" }}>
                👍 {selectedCommentForModeration.likesCount}
              </span>{" "}
              <span style={{ color: "#ff4d4f" }}>
                👎 {selectedCommentForModeration.dislikesCount}
              </span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Oluşturulma Tarihi:</Text>{" "}
              {new Date(
                selectedCommentForModeration.createdAt
              ).toLocaleDateString("tr-TR")}
            </div>
            {selectedCommentForModeration.isSpoiler && (
              <div style={{ marginBottom: 16 }}>
                <Tag color="orange" icon={<WarningOutlined />}>
                  Spoiler İçeriyor
                </Tag>
              </div>
            )}
            {selectedCommentForModeration.isEdited && (
              <div style={{ marginBottom: 16 }}>
                <Tag color="blue" icon={<EditOutlined />}>
                  Düzenlendi
                </Tag>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default CommentModals;
