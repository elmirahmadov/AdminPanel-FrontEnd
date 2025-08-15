import React, { useState } from "react";

import { Button, Card, Form, Input, Typography, Alert } from "antd";
import { useNavigate } from "react-router-dom";

import { ROUTER } from "@/common/constants/router";
import { useAuthActions } from "@/common/store/auth";

const { Title } = Typography;

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      await login({ email: values.email, password: values.password });
      setLoading(false);
      navigate(ROUTER.DASHBOARD);
    } catch (err) {
      setLoading(false);
      setError(
        "Giriş başarısız. Lütfen bilgilerinizi kontrol edin veya tekrar deneyin."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#181c27",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <Card
        style={{
          maxWidth: 380,
          width: "100%",
          background: "#23263a",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          border: "none",
        }}
        bodyStyle={{ padding: 32 }}
      >
        <Title
          level={3}
          style={{
            color: "#fff",
            textAlign: "center",
            marginBottom: 24,
            fontWeight: 700,
          }}
        >
          Admin Panel Girişi
        </Title>
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 18 }}
          />
        )}
        <Form
          form={form}
          name="adminLogin"
          onFinish={handleLogin}
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label={
              <span style={{ color: "#bfc9da", fontWeight: 500 }}>Email</span>
            }
            name="email"
            rules={[
              { required: true, message: "Email adresi girin!" },
              { type: "email", message: "Geçerli bir email adresi girin!" },
            ]}
          >
            <Input
              placeholder="Email"
              size="large"
              style={{
                background: "#23263a",
                color: "#fff",
                borderRadius: 10,
                border: "1px solid #3a3f54",
              }}
            />
          </Form.Item>
          <Form.Item
            label={
              <span style={{ color: "#bfc9da", fontWeight: 500 }}>Parola</span>
            }
            name="password"
            rules={[{ required: true, message: "Parolanızı girin!" }]}
          >
            <Input.Password
              placeholder="••••••••"
              size="large"
              style={{
                background: "#23263a",
                color: "#fff",
                borderRadius: 10,
                border: "1px solid #3a3f54",
              }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                width: "100%",
                borderRadius: 10,
                background: "#4f8cff",
                fontWeight: 600,
                border: "none",
                boxShadow: "0 2px 8px rgba(79,140,255,0.08)",
              }}
            >
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
