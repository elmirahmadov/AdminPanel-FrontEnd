import { Spin } from "antd";

import styles from "./Loading.module.css";

import { clsnm } from "@/common/utils/clsnm";

const Loading = ({ full }: { full?: boolean }) => {
  return (
    <div className={clsnm(styles.wrapper, full && styles.full)}>
      <Spin size="large" />
    </div>
  );
};

export { Loading };
