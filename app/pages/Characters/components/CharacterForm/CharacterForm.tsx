import React from "react";
import { Form, Input, Select } from "antd";
import type { ICharacter } from "@/common/store/character/character.types";
import styles from "./CharacterForm.module.css";

interface CharacterFormProps {
  form: any;
  animeOptions: Array<{ value: string; label: string }>;
  animeFetching: boolean;
  onAnimeSearch: (value: string) => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({
  form,
  animeOptions,
  animeFetching,
  onAnimeSearch,
}) => {
  return (
    <Form layout="vertical" form={form}>
      <div className={styles.formRow}>
        <Form.Item
          name="animeId"
          label="Anime"
          rules={[{ required: true, message: "Anime seçin" }]}
          className={styles.formItem}
        >
          <Select
            showSearch
            placeholder="Anime adı yazın..."
            filterOption={false}
            onSearch={onAnimeSearch}
            notFoundContent={animeFetching ? "Aranıyor..." : "Sonuç yok"}
            options={animeOptions}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="Ad"
          rules={[{ required: true, message: "Ad gerekli" }]}
          className={styles.formItem}
        >
          <Input />
        </Form.Item>
      </div>

      <div className={styles.formRow}>
        <Form.Item
          name="role"
          label="Rol"
          rules={[{ required: true, message: "Rol gerekli" }]}
          className={styles.formItem}
        >
          <Select
            options={[
              { value: "MAIN", label: "Başrol" },
              { value: "SUPPORTING", label: "Yardımcı" },
              { value: "ANTAGONIST", label: "Karşıt" },
              { value: "CAMEO", label: "Kısa Görünüm" },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="voiceActor"
          label="Seslendiren"
          className={styles.formItem}
        >
          <Input />
        </Form.Item>
      </div>

      <div className={styles.formRow}>
        <Form.Item name="age" label="Yaş" className={styles.formItem}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="imageUrl" label="Görsel URL" className={styles.formItem}>
          <Input placeholder="https://..." />
        </Form.Item>
      </div>

      <Form.Item name="description" label="Açıklama">
        <Input.TextArea rows={3} />
      </Form.Item>
    </Form>
  );
};

export default CharacterForm;
