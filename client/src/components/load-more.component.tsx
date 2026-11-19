import type { LoadmoreProps } from "../types/ui";
const LoadMoreDataBtn: React.FC<LoadmoreProps> = ({
  state,
  fetchDataFun,
  additionalParam,
}) => {
  if (
    state !== null &&
    state.result &&
    Array.isArray(state.result) &&
    state.totalDocs > state.result.length &&
    state.page
  ) {
    return (
      <button
        onClick={() =>
          fetchDataFun({ ...additionalParam, page: state.page + 1 })
        }
        className="loadmore"
      >
        โหลดเพิ่มเติม
      </button>
    );
  }

  return null;
};

export default LoadMoreDataBtn;
