import React from "react";

import { Form, Input, InputNumber, Select } from "antd";

import styles from "./PeriodsForm.module.css";

interface PeriodsFormProps {
  form: any;
}

const PeriodsForm: React.FC<PeriodsFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical" className={styles.form}>
      <div className={styles.formRow}>
        <Form.Item
          name="name"
          label="Mevsim Adı"
          rules={[{ required: true, message: "Mevsim adı girin!" }]}
          className={styles.formItem}
        >
          <Input placeholder="Örn: İlkbahar 2024" />
        </Form.Item>
        <Form.Item
          name="year"
          label="Yıl"
          rules={[{ required: true, message: "Yıl girin!" }]}
          className={styles.formItem}
        >
          <InputNumber
            min={2000}
            max={2030}
            style={{ width: "100%" }}
            placeholder="2024"
          />
        </Form.Item>
      </div>

      <div className={styles.formRow}>
        <Form.Item
          name="season"
          label="Mevsim"
          rules={[{ required: true, message: "Mevsim seçin!" }]}
          className={styles.formItem}
        >
          <Select placeholder="Mevsim seçin">
            <Select.Option value="SPRING">İlkbahar</Select.Option>
            <Select.Option value="SUMMER">Yaz</Select.Option>
            <Select.Option value="AUTUMN">Sonbahar</Select.Option>
            <Select.Option value="WINTER">Kış</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Açıklama"
          className={styles.formItem}
        >
          <Input.TextArea rows={3} placeholder="Mevsim açıklaması..." />
        </Form.Item>
      </div>
    </Form>
  );
};

export default PeriodsForm;
