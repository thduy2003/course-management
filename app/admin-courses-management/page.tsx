'use client';
import { useState, useEffect } from 'react';
import Table from '../../components/Table';
import { courses as coursesMock, Course } from '../../mock/courses';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Form, Input, Button, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const PAGE_SIZE = 10;

export default function AdminCoursesManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<Course[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [warningModal, setWarningModal] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // On mount, load courses from localStorage (or fallback to coursesMock) and set query data.
  useEffect(() => {
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
      queryClient.setQueryData<Course[]>(['adminCourses'], JSON.parse(storedCourses));
    } else {
      queryClient.setQueryData<Course[]>(['adminCourses'], coursesMock);
    }
  }, [queryClient]);

  // Use TanStack Query to fetch (and update) courses from query cache (which is updated from localStorage).
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['adminCourses'],
    queryFn: () => {
      const storedCourses = localStorage.getItem('courses');
      return storedCourses ? JSON.parse(storedCourses) : coursesMock;
    },
  });

  // Add course mutation (adds a new course, updates query cache, and stores in localStorage).
  const addCourseMutation = useMutation({
    mutationFn: (newCourse: Course) => Promise.resolve(newCourse),
    onSuccess: (newCourse) => {
      const updatedCourses = [newCourse, ...courses];
      queryClient.setQueryData<Course[]>(['adminCourses'], updatedCourses);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      setSuccessModalOpen(true);
    },
  });

  // Filtered and paginated data (using courses from query cache).
  const filtered = courses.filter(c => c.id.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase()));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((c, i) => ({ ...c, key: (page - 1) * PAGE_SIZE + i }));

  const columns: ColumnsType<Course> = [
    { title: <span className="text-blue-500">Mã khoá học</span>, dataIndex: 'id', key: 'id', align: 'center' },
    { title: <span className="text-blue-500">Tên khoá học</span>, dataIndex: 'name', key: 'name', align: 'center' },
    { title: <span className="text-blue-500">Ngày bắt đầu</span>, dataIndex: 'startDate', key: 'startDate', align: 'center' },
    { title: <span className="text-blue-500">Ngày kết thúc</span>, dataIndex: 'endDate', key: 'endDate', align: 'center' },
    { title: <span className="text-blue-500">Số buổi</span>, dataIndex: 'sessions', key: 'sessions', align: 'center' },
    { title: <span className="text-blue-500">Số lượng tối đa</span>, dataIndex: 'maxStudents', key: 'maxStudents', align: 'center' },
  ];

  const handleCreate = (values: any) => {
    const newCourse: Course = {
      id: 'KH' + (courses.length + 1).toString().padStart(4, '0'),
      name: values.name,
      startDate: values.startDate,
      endDate: values.endDate,
      sessions: Number(values.sessions),
      maxStudents: Number(values.maxStudents),
      fee: `${values.fee} ₫`, // default fee (so that student page can "register")
      status: 'Còn chỗ',
      action: 'Đăng ký',
      description: '',
    };
    addCourseMutation.mutate(newCourse);
    setCreateModalOpen(false);
    form.resetFields();
  };

  const handleRowSelectionChange = (keys: React.Key[], rows: Course[]) => {
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
  };

  const handleEdit = () => {
    if (selectedRowKeys.length === 0) {
      setWarningModal({ open: true, message: 'Vui lòng chọn một khoá học để chỉnh sửa!' });
      return;
    }
    if (selectedRowKeys.length > 1) {
      setWarningModal({ open: true, message: 'Chỉ được chỉnh sửa một khoá học tại một thời điểm!' });
      return;
    }
    editForm.setFieldsValue(selectedRows[0]);
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedRowKeys.length === 0) {
      setWarningModal({ open: true, message: 'Vui lòng chọn ít nhất một khoá học để xoá!' });
      return;
    }
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    const remaining = courses.filter(c => !selectedRowKeys.includes(c.id));
    queryClient.setQueryData<Course[]>(['adminCourses'], remaining);
    localStorage.setItem('courses', JSON.stringify(remaining));
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setDeleteConfirmOpen(false);
    message.success('Đã xoá khoá học thành công!');
  };

  const handleEditSave = (values: any) => {
    const updatedCourses = courses.map(c =>
      c.id === selectedRows[0].id ? { ...c, ...values, sessions: Number(values.sessions), maxStudents: Number(values.maxStudents), fee: `${values.fee} ₫` } : c
    );
    queryClient.setQueryData<Course[]>(['adminCourses'], updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    setEditModalOpen(false);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    message.success('Thông tin khoá học đã được cập nhật!');
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-blue-500 mb-4">QUẢN LÝ KHOÁ HỌC</h2>
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Tìm kiếm"
          value={search}
          onChange={e => setSearch(e.target.value)}
          prefix={<SearchOutlined />}
          className="max-w-xs"
          allowClear
        />
        <Button icon={<DeleteOutlined />} className="ml-auto" onClick={handleDelete} disabled={selectedRowKeys.length === 0} />
        <Button icon={<EditOutlined />} onClick={handleEdit} disabled={selectedRowKeys.length !== 1} />
        <Button type="primary" icon={<PlusOutlined />} className="bg-blue-500 px-6" onClick={() => setCreateModalOpen(true)}>
          TẠO
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow p-0 overflow-x-auto">
        <Table
          columns={columns}
          dataSource={paginated}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total: filtered.length,
            onChange: setPage,
            showSizeChanger: false,
          }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: handleRowSelectionChange,
            getCheckboxProps: () => ({
              style: { cursor: 'pointer' },
            }),
          }}
        />
      </div>
      {/* Create Modal */}
      <Modal
        title={<div className="text-xl font-bold text-blue-500 text-center">THÊM KHOÁ HỌC MỚI</div>}
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        centered
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{}}
          onFinish={handleCreate}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Mã khoá học" name="id" className="mb-2">
              <Input disabled value={'KH' + (courses.length + 1).toString().padStart(4, '0')} />
            </Form.Item>
            <Form.Item label="Tên khoá học" name="name" className="mb-2" rules={[{ required: true, message: 'Vui lòng nhập tên khoá học!' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Số buổi học" name="sessions" className="mb-2" rules={[{ required: true, message: 'Vui lòng nhập số buổi học!' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Học phí" name="fee" className="mb-2" rules={[{ required: true, message: 'Vui lòng nhập học phí!' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Ngày bắt đầu" name="startDate" className="mb-2" rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu!' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Số lượng học viên" name="maxStudents" className="mb-2" rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên!' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Ngày kết thúc" name="endDate" className="mb-2" rules={[{ required: true, message: 'Vui lòng nhập ngày kết thúc!' }]}> 
              <Input />
            </Form.Item>
          </div>
          <div className="flex justify-center mt-4 gap-4">
            <Button onClick={() => setCreateModalOpen(false)} className="w-1/2 h-10 text-lg font-semibold">Huỷ</Button>
            <Button type="primary" htmlType="submit" className="w-1/2 h-10 text-lg font-semibold bg-blue-500">Tạo</Button>
          </div>
        </Form>
      </Modal>
      {/* Success Modal */}
      <Modal
        title={<div className="text-xl font-bold text-blue-500 text-center">THÊM THÀNH CÔNG</div>}
        open={successModalOpen}
        onCancel={() => setSuccessModalOpen(false)}
        footer={null}
        centered
        width={500}
      >
        <div className="text-center text-lg py-8">Thông tin khoá học mới đã được thêm vào danh sách!</div>
      </Modal>
      {/* Edit Modal */}
      <Modal
        title={<div className="text-xl font-bold text-blue-500 text-center">CHỈNH SỬA THÔNG TIN KHOÁ HỌC</div>}
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        centered
        width={700}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSave}
          initialValues={selectedRows[0]}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Mã khoá học" name="id" className="mb-2">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Tên khoá học" name="name" className="mb-2" rules={[{ required: true, message: 'Vui lòng nhập tên khoá học!' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Số buổi học" name="sessions" className="mb-2" rules={[{ required: true, message: 'Vui lòng nhập số buổi học!' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Học phí" name="fee" className="mb-2" rules={[{ required: true, message: 'Vui lòng nhập học phí!' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Ngày bắt đầu" name="startDate" className="mb-2" rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu!' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Số lượng học viên" name="maxStudents" className="mb-2" rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên!' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Ngày kết thúc" name="endDate" className="mb-2" rules={[{ required: true, message: 'Vui lòng nhập ngày kết thúc!' }]}> 
              <Input />
            </Form.Item>
          </div>
          <div className="flex justify-center mt-4 gap-4">
            <Button onClick={() => setEditModalOpen(false)} className="w-1/2 h-10 text-lg font-semibold">Huỷ</Button>
            <Button type="primary" htmlType="submit" className="w-1/2 h-10 text-lg font-semibold bg-blue-500">Lưu</Button>
          </div>
        </Form>
      </Modal>
      {/* Warning Modal */}
      <Modal
        title={<div className="text-xl font-bold text-blue-500 text-center">CẢNH BÁO</div>}
        open={warningModal.open}
        onCancel={() => setWarningModal({ open: false, message: '' })}
        footer={null}
        centered
        width={500}
      >
        <div className="text-center text-lg py-8">{warningModal.message}</div>
      </Modal>
      {/* Delete Confirm Modal */}
      <Modal
        title={<div className="text-xl font-bold text-blue-500 text-center">XÁC NHẬN XOÁ</div>}
        open={deleteConfirmOpen}
        onCancel={() => setDeleteConfirmOpen(false)}
        onOk={confirmDelete}
        okText="Xoá"
        cancelText="Huỷ"
        centered
        width={500}
      >
        <div className="text-center text-lg py-8">Bạn có chắc chắn muốn xoá {selectedRowKeys.length} khoá học đã chọn?</div>
      </Modal>
    </div>
  );
} 