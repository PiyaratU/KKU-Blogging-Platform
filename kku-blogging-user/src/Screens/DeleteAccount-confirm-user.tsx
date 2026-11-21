import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import styled from "styled-components"; // ใช้ Styled Components

const DeleteAccountModalUser: React.FC<{
  userId: string | null;
  show: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
}> = ({ userId, show, onClose, onDeleteSuccess }) => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const API_BASE_URL =
    import.meta.env.REACT_APP_API_ENDPOINT ||
    "https://kku-blog-server-ak2l.onrender.com";

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/profile/user/delete/${userId}`,
        {
          data: { password },
        }
      );

      if (response.data.message === "User deleted successfully") {
        setSuccessMessage("บัญชีของคุณถูกลบเรียบร้อยแล้ว!");
        setErrorMessage("");
        onDeleteSuccess();
        localStorage.removeItem("userId");
        sessionStorage.removeItem("userId");
      } else {
        setErrorMessage(response.data.error);
      }
    } catch (error) {
      setErrorMessage("เกิดข้อผิดพลาดในการลบบัญชี โปรดตรวจสอบรหัสผ่านของคุณ.");
    }
  };

  return (
    <CustomModal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>ลบบัญชีผู้ใช้</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="warning-text">
          คุณแน่ใจหรือไม่ที่จะลบบัญชีของคุณ? การกระทำนี้ไม่สามารถยกเลิกได้.
        </p>
        <Form>
          <Form.Group controlId="password">
            <Form.Label>กรุณากรอกรหัสผ่านของคุณเพื่อยืนยัน</Form.Label>
            <Form.Control
              type="password"
              placeholder="กรอกรหัสผ่านของคุณ"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
            />
          </Form.Group>

          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          {successMessage && <p className="text-success">{successMessage}</p>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-cancel" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button className="btn-danger" onClick={handleDeleteAccount}>
          ลบบัญชี
        </Button>
      </Modal.Footer>
    </CustomModal>
  );
};

export default DeleteAccountModalUser;

// 🔥 ใช้ Styled Components เพื่อแยก CSS ออกไป 🎨
const CustomModal = styled(Modal)`
  .modal-content {
    border-radius: 12px;
    border: none;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }

  .modal-header {
    border-bottom: none;
    font-size: 18px;
    font-weight: bold;
  }

  .modal-footer {
    border-top: none;
    display: flex;
    justify-content: flex-end;
  }

  .btn-cancel {
    color: #fff;
    background: #6c757d;
    border: none;
    font-size: 16px;
    padding: 10px 20px;
  }

  .btn-danger {
    background-color: #d9534f;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 16px;
    color: white;
  }

  .warning-text {
    color: #6c757d;
    font-weight: bold;
  }

  .password-input {
    margin-top: 5px;
    border-radius: 6px;
  }
`;
