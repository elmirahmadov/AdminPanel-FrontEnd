import React from "react";
import { Form, Input } from "antd";

interface GenreFormProps {
  form: any;
}

// Slugify function to generate URL-friendly slugs
function slugify(text: string): string {
  return String(text)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const GenreForm: React.FC<GenreFormProps> = ({ form }) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = slugify(name);
    form.setFieldsValue({ slug });
  };

  return (
    <Form layout="vertical" form={form}>
      <Form.Item
        name="name"
        label="Ad"
        rules={[{ required: true, message: "Ad gerekli" }]}
      >
        <Input onChange={handleNameChange} />
      </Form.Item>
      <Form.Item name="slug" label="Slug">
        <Input placeholder="Otomatik oluşturulacak" />
      </Form.Item>
      <Form.Item name="description" label="Açıklama">
        <Input.TextArea rows={3} />
      </Form.Item>
    </Form>
  );
};

export default GenreForm;
