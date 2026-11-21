import { useCallback, useMemo, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchFollow, fetchProfile } from "../../api/follow";
import type { FollowListKind, FollowListModalProps } from "../../types/user";

const LABELS: Record<FollowListKind, { button: string; title: string; empty: string }> = {
  followers: { button: "followers", title: "ผู้ติดตาม", empty: "ไม่มีบัญชีที่ติดตาม" },
  following: { button: "following", title: "กำลังติดตาม", empty: "ไม่มีบัญชีที่กำลังติดตาม" },
};

const followButtonStyle = (backgroundColor: string) => ({ backgroundColor, color: "white", border: "none" });

/**
 * ปุ่ม "N followers / N following" บนหน้าโปรไฟล์ — กดแล้วเปิดรายชื่อ พร้อมปุ่มติดตาม / เลิกติดตาม
 * list = "followers" แสดงผู้ติดตาม · "following" แสดงคนที่กำลังติดตาม
 */
export function FollowListModal({ userProfile, list }: FollowListModalProps) {
  const label = LABELS[list];
  const [show, setShow] = useState(false);
  const [myUser, setMyUser] = useState<any>(null);
  const [followChanged, setFollowChanged] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>([]);

  const handleButtonClick = async () => {
    setShow(true);
    const me = sessionStorage.getItem("userId");
    if (me) {
      try {
        const profileData = await fetchProfile(me);
        const resx = await fetchFollow(userProfile._id);
        setMyUser(profileData);
        setCurrentUser(resx);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    }
  };

  // คนในรายการที่ผู้ใช้ปัจจุบันติดตามอยู่แล้ว
  const alreadyFollowing = useMemo(() => {
    const ids: string[] = [];
    userProfile?.[list]?.forEach((e: any) => {
      if (myUser?.following?.some((f: any) => f._id === e)) ids.push(e);
    });
    return ids;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile, myUser, followChanged, list]);

  const handleFollow = useCallback(async (you: string) => {
    const url = `${import.meta.env.REACT_APP_API_ENDPOINT}/follow`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ me: sessionStorage.getItem("userId"), you }),
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText || "Unknown Error"} for ${url}`);
      }
      const followerData = await response.json();
      setFollowChanged(followerData.newFollow.if_followed);
      setMyUser(await fetchProfile(sessionStorage.getItem("userId")));
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  }, []);

  const handleUnfollow = useCallback(async (you: string) => {
    const url = `${import.meta.env.REACT_APP_API_ENDPOINT}/follow/delete`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ me: sessionStorage.getItem("userId"), you }),
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText || "Unknown Error"} for ${url}`);
      }
      await response.json();
      setFollowChanged(false);
      setMyUser(await fetchProfile(sessionStorage.getItem("userId")));
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  }, []);

  const people: any[] = currentUser?.[list] ?? [];

  return (
    <>
      <Button
        onClick={handleButtonClick}
        className="me-2"
        style={{ backgroundColor: "white", color: "black", border: "none" }}
      >
        <p className="m-0">{`${userProfile?.[list]?.length} ${label.button}`}</p>
      </Button>
      <Modal size="sm" centered show={show} onHide={() => setShow(false)} aria-labelledby={`follow-list-title-${list}`}>
        <Modal.Header closeButton>
          <Modal.Title id={`follow-list-title-${list}`}>{label.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {people.length > 0 ? (
            people.map((c: any) => (
              <div key={c._id} style={{ display: "flex", gap: "1rem", padding: "0.5rem", alignItems: "center" }}>
                <Link to={`/user/${c._id}`} style={{ flex: 1, textDecoration: "none" }}>
                  <p style={{ color: "black" }}>{c.fullname}</p>
                </Link>
                <div className="d-flex justify-content-end">
                  {sessionStorage.getItem("userId") === c._id ? (
                    <Button style={followButtonStyle("black")} disabled>
                      คุณ
                    </Button>
                  ) : alreadyFollowing.some((id) => id === c._id) ? (
                    <Button onClick={() => handleUnfollow(c._id)} style={followButtonStyle("gray")}>
                      ติดตามแล้ว
                    </Button>
                  ) : (
                    <Button onClick={() => handleFollow(c._id)} style={followButtonStyle("black")}>
                      ติดตาม
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "gray" }}>{label.empty}</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
