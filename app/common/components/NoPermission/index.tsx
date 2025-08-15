import { WarningOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import styles from "./styles.module.css";

import { ROUTER } from "@/common/constants/router";

export default function NoPermission() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate(ROUTER.LOGIN);
  };

  return (
    <div className={styles.no_permission_box}>
      <WarningOutlined className={styles.warningIcon} />
      <h1>Kifayət qədər icazə yoxdur</h1>
      <p>Cari rolunuz bu bölməyə girişə icazə vermir.</p>
      <Button type="primary" onClick={handleLogout} size="large">
        Çıxış
      </Button>
    </div>
  );
}
