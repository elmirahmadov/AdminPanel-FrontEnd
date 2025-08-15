import React, { useEffect, useMemo, useState } from "react";

import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Tag,
} from "antd";

import PeriodsForm from "./components/PeriodsForm";
import PeriodsHeader from "./components/PeriodsHeader";
import PeriodsTable from "./components/PeriodsTable";
import styles from "./PeriodsList.module.css";

import { type IPeriod, usePeriodsStore } from "@/common/store/periods";

const PeriodsList: React.FC = () => {
  const {
    periods,
    loading,
    fetchAllPeriods,
    addPeriod,
    updatePeriod,
    deletePeriod,
  } = usePeriodsStore();

  const [animeSearch, setAnimeSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IPeriod | null>(null);
  const [viewingAnimes, setViewingAnimes] = useState<IPeriod | null>(null);
  const [addAnimeModalOpen, setAddAnimeModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<IPeriod | null>(null);
  const [form] = Form.useForm();
  const [addAnimeForm] = Form.useForm();

  useEffect(() => {
    // Tüm dönemleri getir
    fetchAllPeriods();
  }, [fetchAllPeriods]);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (period: IPeriod) => {
    setEditing(period);
    form.setFieldsValue({
      name: period.name,
      year: period.year,
      season: period.season,
      startDate: period.startDate,
      endDate: period.endDate,
      animeCount: period.animeCount,
      totalEpisodes: period.totalEpisodes,
      description: period.description,
    });
    setModalOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await updatePeriod(editing.id, values);
    } else {
      await addPeriod(values);
    }
    setModalOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const onDelete = async (period: IPeriod) => {
    await deletePeriod(period.id);
  };

  const onViewAnimes = (period: IPeriod) => {
    setViewingAnimes(period);
  };

  const onAddAnime = (period: IPeriod) => {
    setSelectedPeriod(period);
    addAnimeForm.resetFields();
    setAddAnimeModalOpen(true);
  };

  const onBackToPeriods = () => {
    setViewingAnimes(null);
  };

  if (viewingAnimes) {
    return (
      <div className={styles.container}>
        <div className={styles.animeListView}>
          <div className={styles.animeListHeader}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={onBackToPeriods}
              className={styles.backButton}
            >
              Mevsimlere Dön
            </Button>
            <h2 className={styles.animeListTitle}>
              {viewingAnimes.name} - Anime Listesi
            </h2>
            <div className={styles.animeListStats}>
              <span className={styles.statItem}>
                <strong>Toplam Anime:</strong> {viewingAnimes.animeCount}
              </span>
              <span className={styles.statItem}>
                <strong>Toplam Bölüm:</strong> {viewingAnimes.totalEpisodes}
              </span>
            </div>
          </div>

          <div className={styles.animeTableContainer}>
            <Table
              dataSource={viewingAnimes.animes}
              rowKey="id"
              pagination={false}
              className={styles.animeTable}
              columns={[
                {
                  title: "ID",
                  dataIndex: "id",
                  key: "id",
                  width: 80,
                  render: (text: string) => <Tag color="blue">{text}</Tag>,
                },
                {
                  title: "Anime Adı",
                  dataIndex: "title",
                  key: "title",
                  width: 300,
                  render: (text: string) => (
                    <span className={styles.animeTitle}>{text}</span>
                  ),
                },
                {
                  title: "Bölüm Sayısı",
                  dataIndex: "episodeCount",
                  key: "episodeCount",
                  width: 120,
                  render: (count: number) => <Tag color="green">{count}</Tag>,
                },
                {
                  title: "Durum",
                  dataIndex: "status",
                  key: "status",
                  width: 120,
                  render: (status: string) => {
                    const statusColors = {
                      ONGOING: "processing",
                      COMPLETED: "success",
                      UPCOMING: "warning",
                    };
                    const statusLabels = {
                      ONGOING: "Devam Ediyor",
                      COMPLETED: "Tamamlandı",
                      UPCOMING: "Yakında",
                    };
                    return (
                      <Tag
                        color={
                          statusColors[status as keyof typeof statusColors]
                        }
                      >
                        {statusLabels[status as keyof typeof statusLabels]}
                      </Tag>
                    );
                  },
                },
              ]}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PeriodsHeader
        search={animeSearch}
        onSearchChange={setAnimeSearch}
        onAddClick={openAdd}
      />
      <PeriodsTable
        periods={periods}
        loading={loading}
        onEdit={openEdit}
        onDelete={onDelete}
        onViewAnimes={onViewAnimes}
        onAddAnime={onAddAnime}
      />
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        title={editing ? "Mevsimi Düzenle" : "Yeni Mevsim"}
        okText={editing ? "Güncelle" : "Oluştur"}
        width={600}
      >
        <PeriodsForm form={form} />
      </Modal>

             {/* Anime Ekleme Modal */}
       <Modal
         open={addAnimeModalOpen}
         onCancel={() => setAddAnimeModalOpen(false)}
         onOk={() => setAddAnimeModalOpen(false)}
         title={`${selectedPeriod?.name} - Anime Ekle`}
         okText="Kapat"
         width={500}
         footer={[
           <Button key="close" onClick={() => setAddAnimeModalOpen(false)}>
             Kapat
           </Button>,
         ]}
       >
         <div style={{ marginBottom: 16 }}>
           <Input
             placeholder="Anime ismi yazın..."
             value={animeSearch}
             onChange={(e) => setAnimeSearch(e.target.value)}
             size="large"
             style={{ marginBottom: 16 }}
           />

           {animeSearch && (
             <div
               style={{
                 background: "#f5f5f5",
                 padding: 16,
                 borderRadius: 8,
                 marginBottom: 16,
               }}
             >
               <h4>Bulunan Anime:</h4>
               <p>
                 <strong>İsim:</strong> {animeSearch}
               </p>
               <Button
                 type="primary"
                 onClick={() => {
                   // TODO: Bu anime'yi mevsime ekle
                   console.log("Anime ekleniyor:", animeSearch);
                   setAnimeSearch("");
                 }}
                 style={{ marginTop: 8 }}
               >
                 Bu Anime'yi Ekle
               </Button>
             </div>
           )}
         </div>
       </Modal>
    </div>
  );
};

export default PeriodsList;
