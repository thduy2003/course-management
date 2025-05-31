'use client';
import { useEffect, useState } from 'react';
import Table from '../../components/Table';
import { courses as coursesMock, registeredCoursesMock, Course, RegisteredCourse } from '../../mock/courses';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Form, Input, Button, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const PAGE_SIZE = 10;

export default function CoursesManagement() {
  const [page, setPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'courses' | 'history'>('courses');
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelSuccessModalOpen, setCancelSuccessModalOpen] = useState(false);
  const [selectedRegisteredCourse, setSelectedRegisteredCourse] = useState<RegisteredCourse | null>(null);
  const [cancelForm] = Form.useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
      queryClient.setQueryData<Course[]>(['courses'], JSON.parse(storedCourses));
    } else {
      queryClient.setQueryData<Course[]>(['courses'], coursesMock);
    }
  }, [queryClient]);

  // Courses list
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => {
        const storedCourses = localStorage.getItem('courses');
        return storedCourses ? JSON.parse(storedCourses) : coursesMock;
      },
  });

  // Registered courses
  const { data: registeredCourses = [] } = useQuery<RegisteredCourse[]>({
    queryKey: ['registeredCourses'],
    queryFn: () => Promise.resolve(registeredCoursesMock),
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (course: Course) => {
      const newReg: RegisteredCourse = {
        name: course.name,
        registerDate: new Date().toLocaleDateString('vi-VN'),
        total: course.fee || "",
        status: 'Chưa thanh toán',
      };
      return Promise.resolve(newReg);
    },
    onSuccess: (newReg) => {
      queryClient.setQueryData<RegisteredCourse[]>(['registeredCourses'], (old = []) => [newReg, ...old]);
      setSuccessModalOpen(true);
    },
  });

  // Cancel registration mutation
  const cancelMutation = useMutation({
    mutationFn: (name: string) => {
      return Promise.resolve(name);
    },
    onSuccess: (name) => {
      queryClient.setQueryData<RegisteredCourse[]>(['registeredCourses'], (old = []) => old.filter(r => r.name !== name));
      setCancelSuccessModalOpen(true);
    },
  });

  const paginatedCourses = courses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((c, i) => ({ ...c, key: (page - 1) * PAGE_SIZE + i }));
  const paginatedHistory = registeredCourses.slice((historyPage - 1) * PAGE_SIZE, historyPage * PAGE_SIZE).map((c, i) => ({ ...c, key: (historyPage - 1) * PAGE_SIZE + i }));

  const handleRegisterClick = (course: Course) => {
    setSelectedCourse(course);
    setRegisterModalOpen(true);
    form.setFieldsValue({
      id: 'KH000' + (courses.findIndex(c => c.name === course.name) + 1),
      name: course.name,
      description: course.description || '',
      startDate: course.startDate,
      endDate: course.endDate,
      sessions: course.sessions + ' buổi',
      fee: course?.fee?.replace(/\D/g, ''),
    });
  };

  const handleRegister = () => {
    if (selectedCourse) {
      registerMutation.mutate(selectedCourse);
    }
    setRegisterModalOpen(false);
  };

  const handleCancelRegistration = (name: string) => {
    const regCourse = registeredCourses.find(r => r.name === name);
    if (regCourse) {
      setSelectedRegisteredCourse(regCourse);
      setCancelModalOpen(true);
      // Find the course info for more details
      const course = courses.find(c => c.name === regCourse.name);
      cancelForm.setFieldsValue({
        id: 'KH000' + (courses.findIndex(c => c.name === regCourse.name) + 1),
        name: regCourse.name,
        description: course?.description || '',
        startDate: course?.startDate || '',
        endDate: course?.endDate || '',
        sessions: course?.sessions ? course.sessions + ' buổi' : '',
        fee: course?.fee ? course.fee.replace(/\D/g, '') : '',
      });
    }
  };

  const handleCancelConfirm = () => {
    if (selectedRegisteredCourse) {
      cancelMutation.mutate(selectedRegisteredCourse.name);
    }
    setCancelModalOpen(false);
  };

  const columns: ColumnsType<Course> = [
    { title: 'Tên khóa học', dataIndex: 'name', key: 'name', align: 'center' },
    { title: 'Ngày bắt đầu', dataIndex: 'startDate', key: 'startDate', align: 'center' },
    { title: 'Ngày kết thúc', dataIndex: 'endDate', key: 'endDate', align: 'center' },
    { title: 'Số buổi', dataIndex: 'sessions', key: 'sessions', align: 'center' },
    { title: 'Học phí', dataIndex: 'fee', key: 'fee', align: 'center' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', align: 'center', render: (text) => <span className={text === 'Còn chỗ' ? 'text-green-600' : 'text-gray-500'}>{text}</span> },
    { title: '', key: 'action', align: 'center', render: (_, record) => <button disabled={record.status === 'Hết chỗ'} onClick={() => handleRegisterClick(record)} className={`${record.status !== 'Hết chỗ' ? 'text-blue-500 hover:underline' : '' }font-medium cursor-pointer`}>{record.action}</button> },
  ];

  const historyColumns: ColumnsType<RegisteredCourse> = [
    { title: 'Tên khóa học', dataIndex: 'name', key: 'name', align: 'center' },
    { title: 'Ngày đăng ký', dataIndex: 'registerDate', key: 'registerDate', align: 'center' },
    { title: 'Tổng tiền', dataIndex: 'total', key: 'total', align: 'center' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', align: 'center', render: (text) => text === 'Chưa thanh toán' ? <span className="text-blue-500 underline">{text}</span> : <span>{text}</span> },
    { title: '', key: 'action', align: 'center', render: (_, record) => record.status === 'Chưa thanh toán' ? <a onClick={() => handleCancelRegistration(record.name)} className="text-blue-500 hover:underline font-medium cursor-pointer">Hủy đăng ký</a> : null },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-blue-500 mb-4">QUẢN LÝ KHÓA HỌC CÁ NHÂN</h2>
      <div className="flex gap-4 mb-4">
        <button
          className={`flex-1 font-semibold border border-indigo-600 py-2 rounded-lg ${activeTab === 'courses' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}
          onClick={() => setActiveTab('courses')}
        >
          ĐĂNG KÝ KHÓA HỌC
        </button>
        <button
          className={`flex-1 font-semibold border border-indigo-600 py-2 rounded-lg ${activeTab === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}
          onClick={() => setActiveTab('history')}
        >
          LỊCH SỬ ĐĂNG KÝ KHÓA HỌC
        </button>
      </div>
      <div className="bg-white rounded-xl shadow p-0 overflow-x-auto">
        {activeTab === 'courses' ? (
          <Table
            columns={columns}
            dataSource={paginatedCourses}
            pagination={{
              current: page,
              pageSize: PAGE_SIZE,
              total: courses.length,
              onChange: setPage,
              showSizeChanger: false,
            }}
          />
        ) : (
          <Table
            columns={historyColumns}
            dataSource={paginatedHistory}
            pagination={{
              current: historyPage,
              pageSize: PAGE_SIZE,
              total: registeredCourses.length,
              onChange: setHistoryPage,
              showSizeChanger: false,
            }}
          />
        )}
      </div>
      {/* Register Modal */}
      <Modal
        title={<div className="text-xl font-bold text-blue-500 text-center">ĐĂNG KÝ KHÓA HỌC</div>}
        open={registerModalOpen}
        onCancel={() => setRegisterModalOpen(false)}
        footer={null}
        centered
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{}}
          onFinish={handleRegister}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="ID Khóa học" name="id" className="mb-2">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Tên khóa học" name="name" className="mb-2">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Mô tả" name="description" className="mb-2 md:col-span-2">
              <Input.TextArea rows={4} disabled />
            </Form.Item>
            <Form.Item label="Ngày bắt đầu" name="startDate" className="mb-2">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Ngày kết thúc" name="endDate" className="mb-2">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Số buổi" name="sessions" className="mb-2">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Học phí" name="fee" className="mb-2">
              <Input disabled />
            </Form.Item>
          </div>
          <div className="flex justify-center mt-4">
            <Button type="primary" htmlType="submit" className="w-1/2 h-10 text-lg font-semibold bg-blue-500">Đăng ký</Button>
          </div>
        </Form>
      </Modal>
      {/* Success Modal */}
      <Modal
        title={<div className="text-xl font-bold text-blue-500 text-center">ĐĂNG KÝ KHÓA HỌC</div>}
        open={successModalOpen}
        onCancel={() => setSuccessModalOpen(false)}
        footer={null}
        centered
        width={500}
      >
        <div className="text-center text-lg py-8">Đăng ký khóa học thành công!</div>
      </Modal>
      {/* Cancel Modal */}
      <Modal
        title={<div className="text-xl font-bold text-blue-500 text-center">HỦY KHÓA HỌC</div>}
        open={cancelModalOpen}
        onCancel={() => setCancelModalOpen(false)}
        footer={null}
        centered
        width={700}
      >
        <Form
          form={cancelForm}
          layout="vertical"
          initialValues={{}}
          onFinish={handleCancelConfirm}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="ID Khóa học" name="id" className="mb-2">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Tên khóa học" name="name" className="mb-2">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Mô tả" name="description" className="mb-2 md:col-span-2">
              <Input.TextArea rows={4} disabled />
            </Form.Item>
            <Form.Item label="Ngày bắt đầu" name="startDate" className="mb-2">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Ngày kết thúc" name="endDate" className="mb-2">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Số buổi" name="sessions" className="mb-2">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Học phí" name="fee" className="mb-2">
              <Input disabled />
            </Form.Item>
          </div>
          <div className="flex justify-center mt-4">
            <Button type="primary" htmlType="submit" className="w-1/2 h-10 text-lg font-semibold bg-blue-500">Hủy đăng ký</Button>
          </div>
        </Form>
      </Modal>
      {/* Cancel Success Modal */}
      <Modal
        title={<div className="text-xl font-bold text-blue-500 text-center">HỦY KHÓA HỌC</div>}
        open={cancelSuccessModalOpen}
        onCancel={() => setCancelSuccessModalOpen(false)}
        footer={null}
        centered
        width={500}
      >
        <div className="text-center text-lg py-8">Hủy đăng ký khóa học thành công!</div>
      </Modal>
    </div>
  );
} 