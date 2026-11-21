/** วงกลมหมุนระหว่างโหลดข้อมูล */
const Loader = () => (
  <div className="tw:flex tw:w-full tw:justify-center tw:py-10" role="status">
    <span className="tw:size-8 tw:animate-spin tw:rounded-full tw:border-2 tw:border-line tw:border-t-ink" />
    <span className="tw:sr-only">กำลังโหลด...</span>
  </div>
);

export default Loader;
