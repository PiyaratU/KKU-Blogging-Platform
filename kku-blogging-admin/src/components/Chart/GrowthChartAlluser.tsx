import React from "react";
import GrowthCountChart from "../../components/shared/GrowthCountChart";
import type { GrowthChartProps } from "../../types/stats";

/** กราฟจำนวนผู้ใช้ที่สมัครใหม่ */
const GrowthChartUser: React.FC<GrowthChartProps> = ({ data }) => (
  <GrowthCountChart data={data} dateField="joinedAt" unitLabel="ผู้ใช้" />
);

export default GrowthChartUser;
