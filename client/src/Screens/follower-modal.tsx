import { FollowListModal } from "../components/shared/FollowListModal";

/** รายชื่อผู้ติดตาม */
export function FollowerModal({ userProfile }: { userProfile: any }) {
  return <FollowListModal userProfile={userProfile} list="followers" />;
}
