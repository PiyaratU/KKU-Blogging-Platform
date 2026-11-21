/** รวม className — ข้ามค่าว่าง / false / undefined */
export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");
