import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Select, message } from "antd";
import { useForumStore } from "../../../../common/store/forum";

const { TextArea } = Input;
const { Option } = Select;

interface TopicModalProps {
  open: boolean;
  onCancel: () => void;
  forumId: string;
  editingTopic?: any;
  mode: "create" | "edit";
  onSuccess?: () => void;
}

const TopicModal: React.FC<TopicModalProps> = ({
  open,
  onCancel,
  forumId,
  editingTopic,
  mode,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { createTopic, updateTopic, loading } = useForumStore();

  useEffect(() => {
    if (open && editingTopic && mode === "edit") {
      form.setFieldsValue({
        title: editingTopic.title,
        content: editingTopic.content,
        tags: editingTopic.tags?.join(", ") || "",
      });
    } else if (open && mode === "create") {
      form.resetFields();
    }
  }, [open, editingTopic, mode, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const topicData = {
        ...values,
        tags: values.tags
          ? values.tags.split(",").map((tag: string) => tag.trim())
          : [],
      };

      if (mode === "create") {
        await createTopic({ ...topicData, forumId });
      } else {
        await updateTopic(editingTopic.id, topicData);
      }

      form.resetFields();
      onCancel();

      // Başarılı işlemden sonra callback'i çağır
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {}
  };

  return (
    <Modal
      title={mode === "create" ? "Yeni Konu Oluştur" : "Konu Düzenle"}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          İptal
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {mode === "create" ? "Oluştur" : "Güncelle"}
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="Konu Başlığı"
          rules={[{ required: true, message: "Lütfen konu başlığı girin!" }]}
        >
          <Input placeholder="Konu başlığını girin" />
        </Form.Item>

        <Form.Item
          name="content"
          label="İçerik"
          rules={[{ required: true, message: "Lütfen içerik girin!" }]}
        >
          <TextArea rows={6} placeholder="Konu içeriğini girin" />
        </Form.Item>

        <Form.Item name="tags" label="Etiketler">
          <Input placeholder="Etiketleri virgülle ayırarak girin (örn: anime, manga, tartışma)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TopicModal;
