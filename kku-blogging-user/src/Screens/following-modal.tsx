import { FollowListModal } from "../components/shared/FollowListModal";

/** รายชื่อคนที่กำลังติดตาม */
export function FollowingModal({ userProfile }: { userProfile: any }) {
  return <FollowListModal userProfile={userProfile} list="following" />;
}
