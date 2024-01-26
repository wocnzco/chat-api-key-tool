import React, {useState} from 'react';
import {API, showError, timestamp2string} from '../helpers';
import { Input, Button, Table, Tag, Layout,Space,Form,ImagePreview,Modal,Typography } from '@douyinfe/semi-ui'; 
import {ITEMS_PER_PAGE} from '../constants';
import {renderQuota} from '../helpers/render';
import { IconSearch } from '@douyinfe/semi-icons';
function renderTimestamp(timestamp) {
    return (
        <>
            {timestamp2string(timestamp)}
        </>
    );
}
const colors = ['amber', 'blue', 'cyan', 'green', 'grey', 'indigo',
    'light-blue', 'lime', 'orange', 'pink',
    'purple', 'red', 'teal', 'violet', 'yellow'
]
const MODE_OPTIONS = [
    {key: 'all', text: '全部用户', value: 'all'},
    {key: 'self', text: '当前用户', value: 'self'}
];

const LOG_OPTIONS = [
    {key: '0', text: '全部', value: 0},
    {key: '1', text: '充值', value: 1},
    {key: '2', text: '消费', value: 2},
    {key: '3', text: '管理', value: 3},
    {key: '4', text: '系统', value: 4}
];

function renderType(type) {
    switch (type) {
        case 1:
            return <Tag color='cyan' size='large'> 充值 </Tag>;
        case 2:
            return <Tag color='lime' size='large'> 消费 </Tag>;
        case 3:
            return <Tag color='orange' size='large'> 管理 </Tag>;
        case 4:
            return <Tag color='purple' size='large'> 系统 </Tag>;
        default:
            return <Tag color='black' size='large'> 未知 </Tag>;
    }
}
function renderIsStream(bool) {
    if (bool) {
        return <Tag color='blue' size='large'>流</Tag>;
    } else {
        return <Tag color='purple' size='large'>非流</Tag>;
    }	
}
		

		
function renderUseTime(type) {
    const time = parseInt(type);
    if (time < 101) {
        return <Tag color='green' size='large'> {time} s </Tag>;
    } else if (time < 300) {
        return <Tag color='orange' size='large'> {time} s </Tag>;
    } else {
        return <Tag color='red' size='large'> {time} s </Tag>;
    }	
}

function stringToColor(str) {
    let sum = 0;
    // 对字符串中的每个字符进行操作
    for (let i = 0; i < str.length; i++) {
        // 将字符的ASCII值加到sum中
        sum += str.charCodeAt(i);
    }
    // 使用模运算得到个位数
    let i = sum % colors.length;
    return colors[i];
}

function renderTypeMj(type) {
    switch (type) {
      case 'IMAGINE':
        return <Tag color="blue" size='large'>绘图</Tag>;
      case 'UPSCALE':
        return <Tag color="orange" size='large'>放大</Tag>;
      case 'VARIATION':
        return <Tag color="purple" size='large'>变换</Tag>;
      case 'DESCRIBE':
        return <Tag color="yellow" size='large'>图生文</Tag>;
      case 'BLEAND':
        return <Tag color="lime" size='large'>图混合</Tag>;
      default:
        return <Tag color="black" size='large'>未知</Tag>;
    }
  }
  
  
  function renderCode(code) {
    switch (code) {
      case 1:
        return <Tag color="green" size='large'>已提交</Tag>;
      case 21:
        return <Tag color="lime" size='large'>排队中</Tag>;
      case 22:
        return <Tag color="orange" size='large'>重复提交</Tag>;
      default:
        return <Tag color="black" size='large'>未知</Tag>;
    }
  }
  
  
  function renderStatus(type) {
    // Ensure all cases are string literals by adding quotes.
    switch (type) {
      case 'SUCCESS':
        return <Tag color="green" size='large'>成功</Tag>;
      case 'NOT_START':
        return <Tag color="grey" size='large'>未启动</Tag>;
      case 'SUBMITTED':
        return <Tag color="yellow" size='large'>队列中</Tag>;
      case 'IN_PROGRESS':
        return <Tag color="blue" size='large'>执行中</Tag>;
      case 'FAILURE':
        return <Tag color="red" size='large'>失败</Tag>;
      default:
        return <Tag color="black" size='large'>未知</Tag>;
    }
  }
  

const LogsTable = () => {
    const [modalImageUrl, setModalImageUrl] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenurl, setIsModalOpenurl] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const columns = [
        {
            title: '时间',
            dataIndex: 'created_at',
            width: '15%',  
            render: (text, record, index) => {
                return (
                    <div>
                       {renderTimestamp(text)}
                    </div>
                );
            },
        },
        {
            title: '类型',
            dataIndex: 'type',
            render: (text, record, index) => {
                return (
                    <div>
                        {renderType(text)}
                    </div>
                );
            },
        },
        {
            title: '模型',
            dataIndex: 'model_name',
            render: (text, record, index) => {
                return (
                    record.type === 0 || record.type === 2 ?
                        <div>
                            <Tag color={stringToColor(text)} size='large' > {text} </Tag>
                        </div>
                        :
                        <></>
                );
            },
        },
        {
            title: '用时',
            dataIndex: 'use_time',
            render: (text, record, index) => {
                return (
                    <div>
                        <Space>
                            {renderUseTime(text)}
                            {renderIsStream(record.is_stream)}
                        </Space>
                    </div>
                );
            },
        },
        {
            title: '提示',
            dataIndex: 'prompt_tokens',
            render: (text, record, index) => {
                return (
                    record.type === 0 || record.type === 2 ?
                        <div>
                            {<span> {text} </span>}
                        </div>
                        :
                        <></>
                );
            },
        },
        {
            title: '补全',
            dataIndex: 'completion_tokens',
            render: (text, record, index) => {
                return (
                    parseInt(text) > 0 && (record.type === 0 || record.type === 2) ?
                        <div>
                            {<span> {text} </span>}
                        </div>
                        :
                        <></>
                );
            },
        },
        {
            title: '消费',
            dataIndex: 'quota',
            render: (text, record, index) => {
                return (
                    record.type === 0 || record.type === 2 ?
                        <div>
                            {
                                renderQuota(text, 6)
                            }
                        </div>
                        :
                        <></>
                );
            }
        }
    ];

    const columnsmj = [
        {
          title: '提交时间',
          dataIndex: 'submit_time',
          width: '15%', 
          render: (text, record, index) => {
            return (
              <div>
                {renderTimestamp(text / 1000)} 
              </div>
            );
          },
        },
        {
          title: '类型',
          dataIndex: 'action',
          render: (text, record, index) => {
              return (
                  <div>
                      {renderTypeMj(text)}
                  </div>
              );
          },
        },
        {
            title: '任务ID',
            dataIndex: 'mj_id',
            width: '15%', 
            render: (text, record, index) => {
                return (
                  <div>
                    {text}
                </div>
                );
            },
        },
        {
          title: '提交结果',
          dataIndex: 'code',
          render: (text, record, index) => {
              return (
                <div>
                 {renderCode(text)}
               </div>
              );
          },
        },
        {
            title: '任务状态',
            dataIndex: 'status',
            render: (text, record, index) => {
                return (
                  <div>
                    {renderStatus(text)}
                  </div>
                );
            },
        },
        {
            title: '进度',
            dataIndex: 'progress',
            render: (text, record, index) => {
                return (
                  <div>
                     {<span> {text} </span>}
                  </div>
                );
            },
        },
        {
          title: '结果图片',
          dataIndex: 'image_url',
          render: (text, record, index) => {
            if (!text) {
              return '无';
            }
            return (
              <Button
              size='small'
                onClick={() => {
                  setModalImageUrl(text);  // 更新图片URL状态
                  setIsModalOpenurl(true);    // 打开模态框
                }}
              >
                查看
              </Button>
            );
          }
        },
        {
            title: 'Prompt',
            dataIndex: 'prompt',
            render: (text, record, index) => {
              // 如果text未定义，返回替代文本，例如空字符串''或其他
              if (!text) {
                  return '无';
              }
      
              return (
                  <Typography.Text
                      ellipsis={{ showTooltip: true }}
                      style={{ width: 100 }}
                      onClick={() => {
                          setModalContent(text);
                          setIsModalOpen(true);
                      }}
                  >
                      {text}
                  </Typography.Text>
              );
          }
        },
        {
            title: 'PromptEn',
            dataIndex: 'prompt_en',
            render: (text, record, index) => {
              // 如果text未定义，返回替代文本，例如空字符串''或其他
              if (!text) {
                  return '无';
              }
      
              return (
                  <Typography.Text
                      ellipsis={{ showTooltip: true }}
                      style={{ width: 100 }}
                      onClick={() => {
                          setModalContent(text);
                          setIsModalOpen(true);
                      }}
                  >
                      {text}
                  </Typography.Text>
              );
          }
        },
        {
            title: '失败原因',
            dataIndex: 'fail_reason',
            render: (text, record, index) => {
              // 如果text未定义，返回替代文本，例如空字符串''或其他
              if (!text) {
                  return '无';
              }
      
              return (
                  <Typography.Text
                      ellipsis={{ showTooltip: true }}
                      style={{ width: 100 }}
                      onClick={() => {
                          setModalContent(text);
                          setIsModalOpen(true);
                      }}
                  >
                      {text}
                  </Typography.Text>
              );
          }
        }

    ];

    const [balance, setBalance] = useState(0)
    const [usage, setUsage] = useState(0)

    const [loading, setLoading] = useState(false);
    const [keyValue, setKeyValue] = useState(''); 
    const [searching, setSearching] = useState(false);
    const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);

    const [currentViewType, setCurrentViewType] = useState('normal'); // 'normal' 或 'mj'

    const toggleViewType = (type) => {
        setCurrentViewType(type);
    };
    
    const [data, setData] = useState({
        key: '',
        balance: 0,
        usage: 0,
        logs: [],
        loading: false,
        activePage: 1,
        searching: false,
        stat: {
            quota: 0,
            token: 0
        }
    });


    const searchLogs = async (key) => {
        if (key === '') {
            alert('请输入搜索关键字');
            return;
        }
        setData(prevData => ({...prevData, searching: true}));
        
        try {
            const res = await API.get(`${process.env.REACT_APP_BASE_URL}/api/log/token?key=${key}`);
            if (res.data && typeof res.data === 'object' && 'success' in res.data) {
                const {success, message, data: logsData} = res.data;
                if (success) {
                    let totalQuota = logsData ? logsData.reduce((acc, curr) => acc + curr.quota, 0) : 0;
                    setData(prevData => ({
                        ...prevData,
                        logs: logsData || [],
                        stat: {...prevData.stat, quota: totalQuota},
                        activePage: 1
                    }));
                } else {
                    alert("查询失败，请输入正确的key");
                }
            } else {
                // 处理API响应格式不正确的情况
                showError("API响应格式不正确。");
            }
        } catch (error) {
            showError(error.message);
        } finally {
            setData(prevData => ({...prevData, searching: false}));
        }
    };

    const searchMjs = async (key) => {
        if (key === '') {
            alert('请输入搜索关键字');
            return;
        }
        setData(prevData => ({...prevData, searching: true}));
        
        try {
            const res = await API.get(`${process.env.REACT_APP_BASE_URL}/api/log/tokenmj?key=${key}`);
            if (res.data && typeof res.data === 'object' && 'success' in res.data) {
                const {success, message, data: logsData} = res.data;
                if (success) {
                    let totalQuota = logsData ? logsData.reduce((acc, curr) => acc + curr.quota, 0) : 0;
                    setData(prevData => ({
                        ...prevData,
                        logs: logsData || [],
                        stat: {...prevData.stat, quota: totalQuota},
                        activePage: 1
                    }));
                } else {
                    alert("查询失败，请输入正确的key");
                }
            } else {
                // 处理API响应格式不正确的情况
                showError("API响应格式不正确。");
            }
        } catch (error) {
            showError(error.message);
        } finally {
            setData(prevData => ({...prevData, searching: false}));
        }
    };
    

    const getBalance = async (key) => {
        if (key === '') {
            alert('请输入你的key');
            return;
        }
        setData(prevData => ({...prevData, loading: true}));
    
        try {
            const subscription = await API.get(`${process.env.REACT_APP_BASE_URL}/v1/dashboard/billing/subscription`, {headers: {Authorization: `Bearer ${key}`}});
            // 安全检查subscription response
            if (subscription.data && typeof subscription.data === 'object') {
                const subscriptionData = subscription.data;
    
                const usageRes = await API.get(`${process.env.REACT_APP_BASE_URL}/v1/dashboard/billing/usage`, {headers: {Authorization: `Bearer ${key}`}});
                // 安全检查usage response
                if (usageRes.data && typeof usageRes.data === 'object') {
                    const usageData = usageRes.data;
    
                    // 假设我们要设置的是balance和usage而不是直接操作data状态
                    setBalance(subscriptionData.hard_limit_usd);
                    setUsage(usageData.total_usage / 100);
                } else {
                    // 处理用量信息的API响应格式不正确的情况
                    showError("用量信息API响应格式不正确。");
                }
            } else {
                // 处理订阅信息的API响应格式不正确的情况
                showError("订阅信息API响应格式不正确。");
            }
        } catch (e) {
            showError("查询失败，请输入正确的key");
        } finally {
            setData(prevData => ({...prevData, loading: false}));
        }
    };
    

    // 更新键值的函数
    const handleInputChange = (value) => {
        setKeyValue(value);
    };
    
    // 触发搜索的函数
    const triggerSearch = () => {
        
        // 根据环境变量判断是否显示余额信息
        if (process.env.REACT_APP_SHOW_BALANCE === "true") {
            getBalance(keyValue); // 使用 keyValue 调用 getBalance
        }
        
        // 根据环境变量判断是否显示详细日志信息
        if (process.env.REACT_APP_SHOW_DETAIL === 'true') {
            searchLogs(keyValue); // 使用 keyValue 调用 searchLogs
        }
        
        // 无条件切换到普通日志视图，不管环境变量如何设置
        toggleViewType('normal');
    };
    

    return (
        <>
        <h1 style={{ textAlign: 'center', marginTop: 20 }}>{process.env.REACT_APP_SHOW_NAME}</h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            {/* 内层容器, 包含输入框和按钮 */}
            <div style={{ position: 'relative' }}> 
                <Input 
                     placeholder="请输入key"
                     value={keyValue}
                     onChange={(value) => handleInputChange(value)}
                     style={{ minWidth: 450 }} 
                />
                {/* 按钮定位在输入框右侧 */}
                <div style={{ position: 'absolute', right: '-130px', top: '0' }}>
                    <Button
                        icon={<IconSearch />}
                        onClick={triggerSearch}
                        loading={searching}
                    >
                        搜索
                    </Button>
                    {process.env.REACT_APP_SHOW_MJ === "true" && (
                        <Button
                            onClick={() => {
                                searchMjs(keyValue); // 获取Midjourney数据
                                toggleViewType('mj'); // 切换到Midjourney视图
                            }}
                            loading={searching}
                            style={{ marginLeft: 8 }} // 根据需要调整间距
                        >
                            MJ
                        </Button>
                    )}
                    {process.env.REACT_APP_SHOW_KAFA !== "" && (
                        <Button
                            onClick={() => window.open(process.env.REACT_APP_SHOW_KAFA, '_blank')}
                            style={{ marginLeft: 8 }} // 根据需要调整间距
                        >
                            获取密钥
                        </Button>
                    )}
                </div>
            </div>
        </div>
    
            <Form style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
                {process.env.REACT_APP_SHOW_BALANCE === "true" && (
                    <Space>
                        <Tag color="green" style={{ fontSize: '16px' }}>
                            余额：${balance.toFixed(2)}
                        </Tag>
                        <Tag color="blue" style={{ fontSize: '16px' }}>
                            已用：${usage.toFixed(2)}
                        </Tag>
                    </Space>
                )}
            </Form>
    
            {process.env.REACT_APP_SHOW_DETAIL === "true" &&
                <Table
                columns={currentViewType === 'normal' ? columns : columnsmj} 
                dataSource={data.logs}
                loading={loading}
                scroll={{ y: 800 }}
                pagination={{
                    pageSize: pageSize,
                    total: data.logs.length,
                    onPageSizeChange: (newPageSize) => setPageSize(newPageSize),
                    showSizeChanger: true
                }}
                style={{ marginTop: 20 }}
            />
            
            
            }
            <Modal
                    visible={isModalOpen}
                    onOk={() => setIsModalOpen(false)}
                    onCancel={() => setIsModalOpen(false)}
                    closable={null}
                    bodyStyle={{ height: '400px', overflow: 'auto' }} // 设置模态框内容区域样式
                    width={800} // 设置模态框宽度
                >
                    <p style={{ whiteSpace: 'pre-line' }}>{modalContent}</p>
                </Modal>
                <ImagePreview
                    src={modalImageUrl}
                    visible={isModalOpenurl}
                    onVisibleChange={(visible) => setIsModalOpenurl(visible)}
                />
        </>
    );
    
};

export default LogsTable;
