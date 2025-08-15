import React from "react";
import { Form, Input } from "antd";

interface GenreFormProps {
  form: any;
}

const GenreForm: React.FC<GenreFormProps> = ({ form }) => {
  return (
    <Form layout="vertical" form={form}>
      <Form.Item
        name="name"
        label="Ad"
        rules={[{ required: true, message: "Ad gerekli" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Açıklama">
        <Input.TextArea rows={3} />
      </Form.Item>
    </Form>
  );
};

export default GenreForm;
