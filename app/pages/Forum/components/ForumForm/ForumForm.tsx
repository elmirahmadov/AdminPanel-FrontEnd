import React from "react";
import { Form, Input, Select, Switch } from "antd";
import styles from "./ForumForm.module.css";

interface ForumFormProps {
  form: any;
}

const ForumForm: React.FC<ForumFormProps> = ({ form }) => {
  return (
    <Form layout="vertical" form={form}>
      <div className={styles.formRow}>
        <Form.Item
          name="title"
          label="Başlık"
          rules={[{ required: true, message: "Başlık gerekli" }]}
          className={styles.formItem}
        >
          <Input placeholder="Forum başlığı" />
        </Form.Item>
        <Form.Item name="category" label="Kategori" className={styles.formItem}>
          <Select
            placeholder="Kategori seçin"
            options={[
              { value: "genel", label: "Genel" },
              { value: "anime", label: "Anime" },
              { value: "manga", label: "Manga" },
              { value: "oyun", label: "Oyun" },
              { value: "cosplay", label: "Cosplay" },
              { value: "teknoloji", label: "Teknoloji" },
              { value: "diğer", label: "Diğer" },
            ]}
            allowClear
          />
        </Form.Item>
      </div>

      <Form.Item name="description" label="Açıklama">
        <Input.TextArea rows={4} placeholder="Forum açıklaması..." />
      </Form.Item>

      <Form.Item name="isActive" label="Durum" valuePropName="checked">
        <Switch
          checkedChildren="Aktif"
          unCheckedChildren="Pasif"
          defaultChecked
        />
      </Form.Item>
    </Form>
  );
};

export default ForumForm;
