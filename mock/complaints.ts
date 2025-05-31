export interface Complaint {
    id: string;
    content: string;
    date: string;
    status: string;
  }
  
  export const complaintsMock: Complaint[] = [
    { id: 'KN0003', content: 'Hệ thống học online thường xuyên gián đoạn.', date: '04/04/2025', status: 'Đã hoàn tất' },
    { id: 'KN0010', content: 'Bàn ghế trong lớp học quá chật chội.', date: '22/04/2025', status: 'Đang xử lý' },
    { id: 'KN0016', content: 'Giảng viên thường xuyên đến muộn, ảnh hưởng giờ học.', date: '09/05/2025', status: 'Đã hoàn tất' },
    { id: 'KN0020', content: 'Giảng viên không chuẩn bị bài kỹ, dẫn đến giờ học thiếu trọng tâm.', date: '19/05/2025', status: 'Chờ phản hồi' },
  ];