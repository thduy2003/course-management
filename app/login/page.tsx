'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { accounts } from '../../mock/accounts';
import { useUser } from '../../context/UserContext';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  const onFinish = (values: any) => {
    setLoading(true);
    const found = accounts.find(
      acc => acc.username === values.username && acc.password === values.password
    );
    setTimeout(() => {
      setLoading(false);
      if (found) {
        localStorage.setItem('user', JSON.stringify(found));
        setUser(found);
        router.push('/');
      } else {
        message.error('Sai tài khoản hoặc mật khẩu!');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-[900px] h-[500px] bg-white rounded-xl shadow overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center bg-blue-500">
          <img src="/edusys_logo.png" alt="Logo" className="w-50 mb-8" />
          <h2 className="text-2xl font-bold text-white mb-2">TRUNG TÂM TIẾNG ANH EDUSYS</h2>
        </div>
        <div className="flex-1 flex flex-col justify-center px-12">
          <h2 className="text-3xl font-bold mb-8 text-right border-b-4 border-purple-400 w-fit mx-auto pr-2">ĐĂNG NHẬP</h2>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Tên đăng nhập/SDT/email" name="username" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}> 
              <Input size="large" />
            </Form.Item>
            <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}> 
              <Input.Password
                size="large"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <div className="flex justify-between items-center mb-4">
              <span></span>
              <a className="text-gray-400 italic" href="#">Quên mật khẩu?</a>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 text-lg font-semibold bg-blue-500"
            >
              Đăng nhập
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
} 