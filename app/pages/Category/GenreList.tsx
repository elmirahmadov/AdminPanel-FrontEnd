import React, { useEffect, useMemo, useState } from "react";

import { Form, Modal } from "antd";

import GenreForm from "./components/GenreForm";
import GenreHeader from "./components/GenreHeader";
import GenreTable from "./components/GenreTable";
import styles from "./GenreList.module.css";

import { useGenreStore } from "@/common/store/genre";
import type { IGenre } from "@/common/store/genre/genre.types";
import DeleteModal from "@/common/components/DeleteModals/DeleteModal";
import { Loading } from "@/common/components/Loading";

const GenreList: React.FC = () => {
  const { genres, loading } = useGenreStore();
  const { fetchGenres, addGenre, editGenre, removeGenre } = useGenreStore(
    (s) => s.actions
  );

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingGenre, setDeletingGenre] = useState<IGenre | null>(null);
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
        g.slug?.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q)
    );
  }, [genres, search]);

  // Loading durumunda Loading component'ini göster
  if (loading) {
    return <Loading />;
  }

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (genre: IGenre) => {
    setEditing(genre);
    form.setFieldsValue({
      name: genre.name,
      slug: genre.slug,
      description: genre.description,
    });
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

  const onDelete = (genre: IGenre) => {
    setDeletingGenre(genre);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingGenre) {
      await removeGenre(deletingGenre.id);
      setDeleteModalOpen(false);
      setDeletingGenre(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeletingGenre(null);
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
        loading={false}
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

      <DeleteModal
        open={deleteModalOpen}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default GenreList;
