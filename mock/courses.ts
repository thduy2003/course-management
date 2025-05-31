/* Unified course mock data for both admin and student course management. */
export interface Course {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  sessions: number;
  maxStudents: number;
  fee?: string;
  status?: string;
  action?: string;
  description?: string;
}

export interface RegisteredCourse {
  name: string;
  registerDate: string;
  total: string;
  status: 'Chưa thanh toán' | 'Đã thanh toán';
}

// Unified course list (used by both admin and student pages)
export const courses: Course[] = [
  { id: 'KH0001', name: 'Tiếng Anh Cơ Bản 1', startDate: '01/04/2025', endDate: '31/05/2025', sessions: 24, maxStudents: 60, fee: '3.000.000 ₫', status: 'Hết chỗ', action: 'Đăng ký', description: 'Khóa học cơ bản 1 giúp học viên xây dựng nền tảng tiếng Anh vững chắc.' },
  { id: 'KH0002', name: 'Tiếng Anh Cơ Bản 2', startDate: '01/06/2025', endDate: '31/08/2025', sessions: 24, maxStudents: 60, fee: '3.500.000 ₫', status: 'Còn chỗ', action: 'Đăng ký', description: 'Khóa học tiếp nối Cơ Bản 2, giúp học viên giao tiếp trôi chảy ở mức cơ bản. Học viên sẽ tự tin trong các tình huống hàng ngày. Phù hợp với người lớn và trẻ em từ 12 tuổi.' },
  { id: 'KH0003', name: 'Tiếng Anh Cơ Bản 3', startDate: '01/08/2025', endDate: '31/10/2025', sessions: 24, maxStudents: 60, fee: '4.000.000 ₫', status: 'Còn chỗ', action: 'Đăng ký', description: 'Khóa học nâng cao kỹ năng giao tiếp và ngữ pháp.' },
  { id: 'KH0004', name: 'Tiếng Anh Giao Tiếp 1', startDate: '01/04/2025', endDate: '31/05/2025', sessions: 24, maxStudents: 60, fee: '3.500.000 ₫', status: 'Hết chỗ', action: 'Đăng ký', description: 'Khóa học giao tiếp cơ bản cho người mới bắt đầu.' },
  { id: 'KH0005', name: 'Tiếng Anh Giao Tiếp 2', startDate: '01/06/2025', endDate: '31/08/2025', sessions: 24, maxStudents: 60, fee: '4.000.000 ₫', status: 'Hết chỗ', action: 'Đăng ký', description: 'Khóa học giao tiếp nâng cao.' },
  { id: 'KH0006', name: 'Tiếng Anh Giao Tiếp 3', startDate: '01/08/2025', endDate: '31/10/2025', sessions: 24, maxStudents: 60, fee: '4.500.000 ₫', status: 'Hết chỗ', action: 'Đăng ký', description: 'Khóa học giao tiếp chuyên sâu.' },
  { id: 'KH0007', name: 'Tiếng Anh IELTS 5.5+', startDate: '01/04/2025', endDate: '31/05/2025', sessions: 20, maxStudents: 60, fee: '4.500.000 ₫', status: 'Hết chỗ', action: 'Đăng ký', description: 'Luyện thi IELTS mục tiêu 5.5+.' },
  { id: 'KH0008', name: 'Tiếng Anh IELTS 6.5+', startDate: '01/06/2025', endDate: '31/08/2025', sessions: 20, maxStudents: 60, fee: '5.000.000 ₫', status: 'Còn chỗ', action: 'Đăng ký', description: 'Luyện thi IELTS mục tiêu 6.5+.' },
  { id: 'KH0009', name: 'Tiếng Anh IELTS 7.0+', startDate: '01/08/2025', endDate: '31/10/2025', sessions: 20, maxStudents: 60, fee: '5.500.000 ₫', status: 'Còn chỗ', action: 'Đăng ký', description: 'Luyện thi IELTS mục tiêu 7.0+.' },
  { id: 'KH0010', name: 'Tiếng Anh Lớp 10', startDate: '01/06/2025', endDate: '31/08/2025', sessions: 24, maxStudents: 90, fee: '3.000.000 ₫', status: 'Còn chỗ', action: 'Đăng ký', description: 'Tiếng Anh dành cho học sinh lớp 10.' },
];

export const registeredCoursesMock: RegisteredCourse[] = [
  { name: 'Tiếng Anh Cơ Bản 2', registerDate: '30/05/2025', total: '3.500.000 ₫', status: 'Chưa thanh toán' },
  { name: 'Tiếng Anh Giao Tiếp 2', registerDate: '28/05/2025', total: '4.000.000 ₫', status: 'Chưa thanh toán' },
  { name: 'Tiếng Anh Giao Tiếp 1', registerDate: '30/03/2025', total: '3.500.000 ₫', status: 'Đã thanh toán' },
  { name: 'Tiếng Anh Cơ Bản 1', registerDate: '26/03/2025', total: '3.000.000 ₫', status: 'Đã thanh toán' },
]; 