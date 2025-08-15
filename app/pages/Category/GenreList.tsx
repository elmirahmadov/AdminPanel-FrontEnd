import React, { useEffect, useMemo, useState } from "react";

import { Form, Modal } from "antd";

import GenreForm from "./components/GenreForm";
import GenreHeader from "./components/GenreHeader";
import GenreTable from "./components/GenreTable";
import styles from "./GenreList.module.css";

import { useGenreStore } from "@/common/store/genre";
import type { IGenre } from "@/common/store/genre/genre.types";

const GenreList: React.FC = () => {
  const { genres, loading } = useGenreStore();
  const { fetchGenres, addGenre, editGenre, removeGenre } = useGenreStore(
    (s) => s.actions
  );

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IGenre | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return genres;
    return genres.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q)
    );
  }, [genres, search]);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (genre: IGenre) => {
    setEditing(genre);
    form.setFieldsValue({ name: genre.name, description: genre.description });
    setModalOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await editGenre(editing.id, values);
    } else {
      await addGenre(values);
    }
    setModalOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const onDelete = async (genre: IGenre) => {
    await removeGenre(genre.id);
  };

  return (
    <div className={styles.container}>
      <GenreHeader
        search={search}
        onSearchChange={setSearch}
        onAddClick={openAdd}
      />

      <GenreTable
        genres={filtered}
        loading={loading}
        onEdit={openEdit}
        onDelete={onDelete}
      />

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        title={editing ? "Türü Düzenle" : "Yeni Tür"}
        okText={editing ? "Güncelle" : "Oluştur"}
      >
        <GenreForm form={form} />
      </Modal>
    </div>
  );
};

export default GenreList;
