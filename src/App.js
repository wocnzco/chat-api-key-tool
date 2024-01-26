import React from 'react';
import { Layout } from '@douyinfe/semi-ui';
import Log from "./pages/Log";

const { Content } = Layout;

function App() {
  return (
    // 使用margin: auto和指定width来实现水平居中以及宽度控制
    <div className="App" style={{
      width: '70%', // 控制宽度为70%
      margin: '0 auto', // 自动边距实现水平居中
      maxHeight: '800px' // 确保填满视口高度
    }}>
      <Layout style={{ 
        overflow: 'auto',
        flexDirection: 'column',
      }}>
        <Content style={{
          display: 'flex',
          flexDirection: 'column',  // 改变排列方向以适应不同的内容布局
          alignItems: 'center',     // 内容居中对齐
          marginTop: 24,
          padding: '20px 50px',     // 增加内边距
        }}>
          <Log  />
        </Content>
      </Layout>
    </div>
  );
}

export default App;
