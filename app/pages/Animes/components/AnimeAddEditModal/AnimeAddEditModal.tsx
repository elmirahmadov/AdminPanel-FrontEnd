import React from "react";

import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";

import styles from "./AnimeAddEditModal.module.css";

import { useGenreStore } from "@/common/store/genre";

const { Option } = Select;

interface AnimeAddEditModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Record<string, unknown>) => void;
  initialValues: Record<string, unknown>;
  modalType: "add" | "edit";
  loading?: boolean;
  formError?: string | null;
}

const AnimeAddEditModal: React.FC<AnimeAddEditModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  modalType,
  loading,
  formError,
}) => {
  const [form] = Form.useForm();
  const didInitRef = React.useRef(false);
  const { genres, loading: genresLoading } = useGenreStore();
  const { fetchGenres } = useGenreStore((s) => s.actions);

  React.useEffect(() => {
    if (!open) return;
    // sadece liste boşsa veya ilk açılışta çek
    if (!genres || genres.length === 0) {
      fetchGenres().catch(() => undefined);
    }
  }, [open, genres, fetchGenres]);
  React.useEffect(() => {
    if (!open) return;
    if (didInitRef.current) return;
    // Formu kontrollü doldur: mevcut seçili değerlerin Select ile uyumlu olduğundan emin ol
    const nextValues: Record<string, unknown> = { ...initialValues };
    const incoming = (nextValues as Record<string, unknown>).genres;
    if (incoming) {
      const raw: unknown[] = Array.isArray(incoming) ? incoming : [incoming];
      const normalizedIds = raw
        .map((g: unknown) => {
          if (typeof g === "string" || typeof g === "number") {
            const str = String(g);
            const found = (genres || []).find(
              (it) => it.id === str || it.name === str
            );
            return found?.id ?? str;
          }
          if (g && typeof g === "object") {
            const id = (g as { id?: string | number }).id;
            if (id !== undefined) return String(id);
          }
          return undefined;
        })
        .filter((v): v is string => typeof v === "string" && v.length > 0);
      // duplicate id'leri temizle
      nextValues.genres = Array.from(new Set(normalizedIds));
    }
    form.setFieldsValue(nextValues);
    didInitRef.current = true;
  }, [open, form, initialValues, genres]);

  // modal kapandığında bir sonraki açılış için yeniden init edilsin
  React.useEffect(() => {
    if (!open) {
      didInitRef.current = false;
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={modalType === "add" ? "Anime Ekle" : "Anime Düzenle"}
      footer={null}
      /* match Categories modal defaults: no explicit destroy/transition overrides */
      width={700}
      styles={{ body: { maxHeight: "65vh", overflowY: "auto", padding: 20 } }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={initialValues}
        preserve
      >
        {formError && (
          <Alert
            message={formError}
            type="error"
            showIcon
            style={{ marginBottom: 12 }}
          />
        )}
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="title"
              label={<span className={styles.label}>Anime Adı</span>}
              rules={[{ required: true, message: "Anime adı girin!" }]}
            >
              <Input
                className={styles.input}
                onChange={(e) => {
                  const value = e.target.value;
                  const slug = value
                    .normalize("NFKD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");
                  // sadece slug alanı boşsa otomatik doldur
                  const current = form.getFieldValue("slug");
                  if (!current) {
                    form.setFieldsValue({ slug });
                  }
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="genres"
              label={<span className={styles.label}>Türler</span>}
              rules={[{ required: true, message: "En az bir tür seçin!" }]}
            >
              <Select
                className={styles.select}
                mode="multiple"
                allowClear
                showSearch
                maxTagCount="responsive"
                getPopupContainer={(trigger) =>
                  trigger.parentElement || document.body
                }
                placeholder={
                  genresLoading ? "Türler yükleniyor..." : "Tür seçin..."
                }
                loading={genresLoading}
                optionFilterProp="label"
                options={Array.from(
                  new Map(
                    (genres || []).map((g) => [
                      String(g.id),
                      { value: String(g.id), label: g.name },
                    ])
                  )
                ).map(([, opt]) => opt)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="rating"
              label={<span className={styles.label}>Puan</span>}
              rules={[{ required: true, message: "Puan girin!" }]}
            >
              <InputNumber min={0} max={10} className={styles.inputNumber} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="releaseYear"
              label={<span className={styles.label}>Yayın Yılı</span>}
              rules={[{ required: true, message: "Yayın yılı girin!" }]}
            >
              <InputNumber
                min={1900}
                max={2100}
                className={styles.inputNumber}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="type"
              label={<span className={styles.label}>Tür</span>}
              rules={[{ required: true, message: "Tür seçin!" }]}
            >
              <Select className={styles.select}>
                <Option value="TV">TV</Option>
                <Option value="MOVIE">Movie</Option>
                <Option value="OVA">OVA</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="status"
              label={<span className={styles.label}>Durum</span>}
              rules={[{ required: true, message: "Durum seçin!" }]}
            >
              <Select className={styles.select}>
                <Option value="ONGOING">Ongoing</Option>
                <Option value="COMPLETED">Completed</Option>
                <Option value="CANCELLED">Cancelled</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24}>
            <Form.Item
              name="trailerUrl"
              label={
                <span className={styles.label}>Fragman / Trailer URL</span>
              }
            >
              <Input
                className={styles.input}
                placeholder="https://youtube.com/watch?v=..."
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24}>
            <Form.Item
              name="imageUrl"
              label={<span className={styles.label}>Kapak Görseli URL</span>}
            >
              <Input className={styles.input} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24}>
            <Form.Item
              name="bannerUrl"
              label={<span className={styles.label}>Banner URL</span>}
            >
              <Input className={styles.input} />
            </Form.Item>
          </Col>

          {/* approvedById ve tagIds istenmiyor */}
          <Col xs={24} sm={24}>
            <Form.Item
              name="studios"
              label={<span className={styles.label}>Stüdyolar</span>}
            >
              <Select
                className={styles.select}
                options={[
                  { value: "Wit Studio", label: "Wit Studio" },
                  { value: "MAPPA", label: "MAPPA" },
                  { value: "Bones", label: "Bones" },
                  { value: "A-1 Pictures", label: "A-1 Pictures" },
                  { value: "Toei Animation", label: "Toei Animation" },
                  { value: "Madhouse", label: "Madhouse" },
                  { value: "CloverWorks", label: "CloverWorks" },
                  { value: "Production I.G", label: "Production I.G" },
                  { value: "Studio Pierrot", label: "Studio Pierrot" },
                  { value: "Trigger", label: "Trigger" },
                ]}
                mode={undefined}
                allowClear
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24}>
            <Form.Item
              name="description"
              label={<span className={styles.label}>Açıklama</span>}
            >
              <Input.TextArea
                autoSize={{ minRows: 2, maxRows: 4 }}
                className={styles.textarea}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className={styles.submitButton}
                loading={loading}
              >
                Kaydet
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AnimeAddEditModal;
