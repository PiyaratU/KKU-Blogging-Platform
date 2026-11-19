import React from "react";
import ReportDetailsModal from "../../components/report-view-modal";
import type { ReportDetailsModalProps } from "../../types/admin";

/** รายละเอียดรายงาน + ปุ่มอนุญาต / ลบบล็อก สำหรับผู้ดูแลระบบ */
const ApproveReportModal: React.FC<ReportDetailsModalProps> = (props) => (
  <ReportDetailsModal {...props} showVerifyActions />
);

export default ApproveReportModal;
