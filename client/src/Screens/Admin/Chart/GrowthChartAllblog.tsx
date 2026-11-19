import React from "react";
import GrowthCountChart from "../../../components/shared/GrowthCountChart";
import type { GrowthChartAllblogProps } from "../../../types/stats";

/** กราฟจำนวนโพสต์ที่เผยแพร่ */
const GrowthChartAllblog: React.FC<GrowthChartAllblogProps> = ({ data }) => (
  <GrowthCountChart data={data} dateField="publishedAt" unitLabel="โพสต์" />
);

export default GrowthChartAllblog;
