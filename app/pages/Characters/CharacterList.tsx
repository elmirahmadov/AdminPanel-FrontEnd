import React, { useEffect, useMemo, useState } from "react";

import { Form, Modal } from "antd";

import { useCharacterStore } from "@/common/store/character/character.store";
import type { ICharacter } from "@/common/store/character/character.types";

import CharacterHeader from "./components/CharacterHeader";
import CharacterTable from "./components/CharacterTable";
import CharacterForm from "./components/CharacterForm";
import CharacterDetailModal from "./components/CharacterDetailModal";

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

  // Anime listesi çağrılmıyor

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return characters;
    return characters.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q)
    );
  }, [characters, search]);

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

  const onDelete = async (character: ICharacter) => {
    await removeCharacter(character.id);
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

  const columns = [
    {
      title: "Anime",
      key: "anime",
      width: 200,
      render: (_: unknown, record: ICharacter) => {
        const withAnime = record as unknown as {
          anime?: {
            id?: string | number;
            title?: string;
            name?: string;
            slug?: string;
          };
          animeTitle?: string;
          animeName?: string;
        };
        const animeTitle =
          withAnime.anime?.title ||
          withAnime.animeTitle ||
          withAnime.animeName ||
          "-";
        return (
          <div className="cellContent" title={animeTitle}>
            {animeTitle}
          </div>
        );
      },
    },
    {
      title: "Ad",
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (text?: string) => (
        <div className="cellContent" title={text || "-"}>
          {text || "-"}
        </div>
      ),
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role?: string) => {
        const r = (role || "").toUpperCase();
        const colorMap: Record<string, string> = {
          MAIN: "green",
          SUPPORTING: "blue",
          ANTAGONIST: "red",
          CAMEO: "purple",
        };
        const labelMap: Record<string, string> = {
          MAIN: "Başrol",
          SUPPORTING: "Yardımcı",
          ANTAGONIST: "Karşıt",
          CAMEO: "Kısa Görünüm",
        };
        return r ? (
          <Tag color={colorMap[r] || "default"}>{labelMap[r] || r}</Tag>
        ) : (
          <span>-</span>
        );
      },
    },
    {
      title: "Seslendiren",
      dataIndex: "voiceActor",
      key: "voiceActor",
      width: 150,
      render: (text?: string) => (
        <div className="cellContent" title={text || "-"}>
          {text || "-"}
        </div>
      ),
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "250",
      render: (text?: string) => (
        <div className="cellContent" title={text || "-"}>
          {text || "-"}
        </div>
      ),
    },
    {
      title: "İşlemler",
      key: "actions",
      width: 150,
      render: (_: unknown, record: ICharacter) => (
        <Space size="small">
          <Tooltip title="Görüntüle">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Düzenle">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Sil">
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

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
        loading={loading}
        onView={onView}
        onEdit={openEdit}
        onDelete={removeCharacter}
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
