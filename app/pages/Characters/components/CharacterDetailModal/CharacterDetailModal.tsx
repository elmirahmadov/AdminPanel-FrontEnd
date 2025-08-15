import React from "react";
import { Modal } from "antd";
import type { ICharacter } from "@/common/store/character/character.types";
import styles from "./CharacterDetailModal.module.css";

interface CharacterDetailModalProps {
  open: boolean;
  onCancel: () => void;
  character: ICharacter | null;
}

const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  open,
  onCancel,
  character,
}) => {
  if (!character) return null;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title="Karakter Detayları"
      width={600}
    >
      <div className={styles.characterDetailModal}>
        <div className={styles.leftSection}>
          {character.imageUrl ? (
            <img
              src={character.imageUrl}
              alt={character.name}
              className={styles.characterImage}
            />
          ) : (
            <div className={styles.characterImage}>
              <div className={styles.placeholderImage}>👤</div>
            </div>
          )}
          <h3 className={styles.characterName}>{character.name}</h3>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Anime:</span>
            <span className={styles.infoValue}>
              {(() => {
                const animeName =
                  character.animeTitle ||
                  character.anime?.title ||
                  character.anime?.name;
                console.log("Anime bilgisi:", {
                  animeTitle: character.animeTitle,
                  anime: character.anime,
                  animeName,
                  fullRecord: character,
                });
                return animeName || "-";
              })()}
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Rol:</span>
            <span className={styles.infoValue}>
              <span
                className={`${styles.roleTag} ${
                  character.role === "MAIN"
                    ? styles.roleMain
                    : character.role === "SUPPORTING"
                      ? styles.roleSupporting
                      : character.role === "ANTAGONIST"
                        ? styles.roleAntagonist
                        : character.role === "CAMEO"
                          ? styles.roleCameo
                          : ""
                }`}
              >
                {character.role === "MAIN"
                  ? "Başrol"
                  : character.role === "SUPPORTING"
                    ? "Yardımcı"
                    : character.role === "ANTAGONIST"
                      ? "Karşıt"
                      : character.role === "CAMEO"
                        ? "Kısa Görünüm"
                        : character.role || "-"}
              </span>
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Seslendiren:</span>
            <span className={styles.infoValue}>
              {character.voiceActor || "-"}
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Yaş:</span>
            <span className={styles.infoValue}>{character.age || "-"}</span>
          </div>

          <div className={styles.descriptionContainer}>
            <div className={styles.descriptionLabel}>Açıklama:</div>
            <div className={styles.descriptionText}>
              {character.description || "Açıklama bulunmuyor."}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CharacterDetailModal;
