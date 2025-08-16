import React, { useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useForumStore } from "../../../../common/store/forum";

const { TextArea } = Input;

interface ReplyModalProps {
  open: boolean;
  onCancel: () => void;
  topicId: string;
  editingReply?: any;
  mode: "create" | "edit";
}

const ReplyModal: React.FC<ReplyModalProps> = ({
  open,
  onCancel,
  topicId,
  editingReply,
  mode,
}) => {
  const [form] = Form.useForm();
  const { addReply, editReply, repliesLoading } = useForumStore();

  useEffect(() => {
    if (open && editingReply && mode === "edit") {
      form.setFieldsValue({
        content: editingReply.content,
      });
    } else if (open && mode === "create") {
      form.resetFields();
    }
  }, [open, editingReply, mode, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (mode === "create") {
        await addReply(topicId, values);
      } else {
        await editReply(editingReply.id, values);
      }

      form.resetFields();
      onCancel();
    } catch (error) {}
  };

  return (
    <Modal
      title={mode === "create" ? "Yanıt Ekle" : "Yanıt Düzenle"}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          İptal
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={repliesLoading}
          onClick={handleSubmit}
        >
          {mode === "create" ? "Ekle" : "Güncelle"}
        </Button>,
      ]}
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="content"
          label="Yanıt İçeriği"
          rules={[{ required: true, message: "Lütfen yanıt içeriği girin!" }]}
        >
          <TextArea rows={4} placeholder="Yanıtınızı yazın..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReplyModal;
