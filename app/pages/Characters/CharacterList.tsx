import React, { useEffect, useMemo, useState } from "react";

import { Form, Modal } from "antd";

import CharacterHeader from "./components/CharacterHeader";
import CharacterTable from "./components/CharacterTable";
import CharacterForm from "./components/CharacterForm";
import CharacterDetailModal from "./components/CharacterDetailModal";

import DeleteModal from "@/common/components/DeleteModals/DeleteModal";
import { Loading } from "@/common/components/Loading";
import { useCharacterStore } from "@/common/store/character/character.store";
import type { ICharacter } from "@/common/store/character/character.types";

const CharacterList: React.FC = () => {
  const { characters, loading } = useCharacterStore();
  const {
    fetchCharacters,
    searchCharacters,
    addCharacter,
    editCharacter,
    removeCharacter,
  } = useCharacterStore((s) => s.actions);
  // Anime listesi kullanılmayacak; arama ile belirlenecek

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCharacter, setDeletingCharacter] = useState<ICharacter | null>(
    null
  );
  const [editing, setEditing] = useState<ICharacter | null>(null);
  const [viewing, setViewing] = useState<ICharacter | null>(null);
  const [form] = Form.useForm();
  const [animeOptions, setAnimeOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [animeFetching, setAnimeFetching] = useState(false);
  const animeSearchTimer = React.useRef<number | undefined>(undefined);
  // Başlık çözümleme cache/flags kaldırıldı (kayıttan okunuyor)

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return characters;
    return characters.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q)
    );
  }, [characters, search]);

  // Loading durumunda Loading component'ini göster
  if (loading) {
    return <Loading />;
  }

  // Anime listesi çağrılmıyor

  // Karakter objesinden anime başlığı mevcut; extra fetch yapmıyoruz

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };
  const openEdit = (character: ICharacter) => {
    setEditing(character);

    // Anime title'ını al
    const animeTitle =
      (character as ICharacter & { anime?: { title?: string } }).anime?.title ||
      character.animeTitle;

    form.setFieldsValue({
      name: character.name,
      description: character.description,
      animeId: animeTitle || undefined,
      role: character.role,
      voiceActor: character.voiceActor,
      age: character.age,
      imageUrl: character.imageUrl,
    });
    setModalOpen(true);
  };

  const onView = (character: ICharacter) => {
    console.log("Karakter verisi:", character);
    setViewing(character);
    setViewModalOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      animeId: values.animeId ? Number(values.animeId) : undefined,
      name: values.name,
      description: values.description || undefined,
      imageUrl: values.imageUrl || undefined,
      voiceActor: values.voiceActor || undefined,
      role: values.role ? String(values.role).toUpperCase() : undefined,
      age:
        values.age !== undefined && values.age !== null
          ? Number(values.age)
          : undefined,
    } as Record<string, unknown>;
    if (editing) {
      await editCharacter(editing.id, payload);
    } else {
      await addCharacter(payload);
    }
    setModalOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const onDelete = (character: ICharacter) => {
    setDeletingCharacter(character);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingCharacter) {
      await removeCharacter(deletingCharacter.id);
      setDeleteModalOpen(false);
      setDeletingCharacter(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeletingCharacter(null);
  };

  const handleAnimeLookup = async (query: string) => {
    const q = query.trim();
    if (!q) {
      setAnimeOptions([]);
      return;
    }
    if (animeSearchTimer.current) window.clearTimeout(animeSearchTimer.current);
    setAnimeFetching(true);
    animeSearchTimer.current = window.setTimeout(async () => {
      try {
        const { lookupAnime } = await import("../../../services/api/anime.api");
        const res = await lookupAnime(q);
        const list = Array.isArray(res.data) ? res.data : res.data?.items || [];
        type LookupItem = {
          id?: string | number;
          title?: string;
          name?: string;
          slug?: string;
        };
        const opts = (list as LookupItem[]).map((it) => ({
          value: String(it.id ?? it.slug ?? q),
          label: String(it.title ?? it.name ?? it.slug ?? it.id ?? q),
        }));
        setAnimeOptions(opts);
      } catch (e) {
        setAnimeOptions([]);
      } finally {
        setAnimeFetching(false);
      }
    }, 300);
  };

  return (
    <div style={{ padding: 24 }}>
      <CharacterHeader
        search={search}
        onSearchChange={setSearch}
        onSearch={(value) =>
          value.trim()
            ? searchCharacters({ name: value.trim(), anime: value.trim() })
            : fetchCharacters()
        }
        onAddClick={openAdd}
      />

      <CharacterTable
        characters={filtered}
        loading={false}
        onView={onView}
        onEdit={openEdit}
        onDelete={onDelete}
      />

      <DeleteModal
        open={deleteModalOpen}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        title={editing ? "Karakteri Düzenle" : "Yeni Karakter"}
        width={700}
      >
        <CharacterForm
          form={form}
          animeOptions={animeOptions}
          animeFetching={animeFetching}
          onAnimeSearch={handleAnimeLookup}
        />
      </Modal>

      <CharacterDetailModal
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        character={viewing}
      />
    </div>
  );
};

export default CharacterList;
